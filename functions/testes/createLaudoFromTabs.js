const { google } = require("googleapis");
const path = require("path");
const express = require("express");
const cors = require("cors");

const SCOPES = ['https://www.googleapis.com/auth/drive.file', 'https://www.googleapis.com/auth/documents'];
const CREDENTIALS_PATH = path.join(__dirname, 'service-account.json');
const DOCUMENT_ID = "1QY_0TvM8R6fsSMvWYeWPiFUeXWbvXHKvPlxmnN3p15I";

const app = express();
app.use(cors({ origin: true }));

async function authorize() {
    console.log("Authorizing with Google API...");
    const auth = new google.auth.GoogleAuth({
        keyFile: CREDENTIALS_PATH,
        scopes: SCOPES,
    });
    console.log("Authorization successful.");
    return auth;
}

async function getDocumentContent(auth, documentId) {
    console.log("Getting document content...");
    const client = await auth.getClient();
    const docs = google.docs({ version: 'v1', auth: client });
    const res = await docs.documents.get({
        documentId,
        includeTabsContent: true,
    });
    const document = res.data;

    if (!document.tabs || document.tabs.length === 0) {
        throw new Error("O documento não contém guias.");
    }

    const laudo = [];

    function extractTextFromTab(tab) {
        const subject = tab.tabProperties?.title || "Guia sem título";
        let text = '';

        if (tab.documentTab && tab.documentTab.body && tab.documentTab.body.content) {
            for (const element of tab.documentTab.body.content) {
                if (element.paragraph && element.paragraph.elements) {
                    for (const elem of element.paragraph.elements) {
                        if (elem.textRun && elem.textRun.content) {
                            text += elem.textRun.content;
                        }
                    }
                }
            }
        }

        laudo.push({
            subject: subject,
            text: text,
        });

        if (tab.childTabs && tab.childTabs.length > 0) {
            for (const childTab of tab.childTabs) {
                extractTextFromTab(childTab);
            }
        }
    }

    for (const tab of document.tabs) {
        extractTextFromTab(tab);
    }
    console.log("Document content retrieved.");
    return laudo;
}

async function createDocumentWithText(auth, laudo) {
    console.log("Creating and writing to document...");
    const client = await auth.getClient();
    const drive = google.drive({ version: 'v3', auth: client });
    const docs = google.docs({ version: 'v1', auth: client });

    // Create a new document
    const createResponse = await drive.files.create({
        requestBody: {
            name: 'Laudo Document',
            mimeType: 'application/vnd.google-apps.document',
        },
    });

    const documentId = createResponse.data.id;
    console.log(`Document created with ID: ${documentId}`);

    // Prepare text to be written to the new document
    let text = '';
    laudo.forEach(item => {
        text += `Subject: ${item.subject}\n${item.text}\n\n`;
    });

    // Write text to the new document
    const requests = [
        {
            insertText: {
                location: {
                    index: 1, // Index 1 is the start of the document
                },
                text: text,
            },
        },
    ];

    await docs.documents.batchUpdate({
        documentId: documentId,
        requestBody: {
            requests: requests,
        },
    });

    console.log("Text written to document.");

    // Set permissions to allow anyone with the link to view the document
    await drive.permissions.create({
        fileId: documentId,
        requestBody: {
            role: 'reader',
            type: 'anyone',
        },
    });

    console.log("Permissions set to allow anyone with the link to view the document.");
    return documentId;
}

app.get("/create-laudo-from-tabs", async (req, res) => {
    console.log(`Received request to read document with ID: ${DOCUMENT_ID}`);
    try {
        const auth = await authorize();
        const laudo = await getDocumentContent(auth, DOCUMENT_ID);
        const documentId = await createDocumentWithText(auth, laudo);
        console.log('Document created and text written successfully.');
        const documentUrl = `https://docs.google.com/document/d/${documentId}/edit`;
        return res.send({ message: "Document created and text written successfully.", documentId: documentId, url: documentUrl });
    } catch (error) {
        console.error('Error creating and writing to document:', error);
        return res.status(500).send({ error: error.message });
    }
});

module.exports = app;