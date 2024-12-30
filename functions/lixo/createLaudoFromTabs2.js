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

    function extractContentFromTab(tab) {
        const subject = tab.tabProperties?.title || "Guia sem título";
        const content = tab.documentTab?.body?.content || [];

        laudo.push({
            subject: subject,
            content: content,
        });

        if (tab.childTabs && tab.childTabs.length > 0) {
            for (const childTab of tab.childTabs) {
                extractContentFromTab(childTab);
            }
        }
    }

    for (const tab of document.tabs) {
        extractContentFromTab(tab);
    }
    console.log("Document content retrieved.");
    return laudo;
}

async function createDocumentWithContent(auth, laudo) {
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

    // Prepare requests to be written to the new document
    const requests = [];
    laudo.forEach(item => {
        requests.push({
            insertText: {
                location: {
                    index: 1, // Index 1 is the start of the document
                },
                text: `Subject: ${item.subject}\n`,
            },
        });
        item.content.forEach(element => {
            if (element.paragraph) {
                const text = element.paragraph.elements.map(e => e.textRun ? e.textRun.content : '').join('');
                if (text) {
                    requests.push({
                        insertText: {
                            location: {
                                index: 1,
                            },
                            text: text,
                        },
                    });
                }
            }
        });
    });

    await docs.documents.batchUpdate({
        documentId: documentId,
        requestBody: {
            requests: requests,
        },
    });

    console.log("Content written to document.");

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

app.get("/create-laudo-from-tabs2", async (req, res) => {
    console.log(`Received request to read document with ID: ${DOCUMENT_ID}`);
    try {
        const auth = await authorize();
        const laudo = await getDocumentContent(auth, DOCUMENT_ID);
        const documentId = await createDocumentWithContent(auth, laudo);
        console.log('Document created and content written successfully.');
        const documentUrl = `https://docs.google.com/document/d/${documentId}/edit`;
        return res.send({ message: "Document created and content written successfully.", documentId: documentId, url: documentUrl });
    } catch (error) {
        console.error('Error creating and writing to document:', error);
        return res.status(500).send({ error: error.message });
    }
});

module.exports = app;