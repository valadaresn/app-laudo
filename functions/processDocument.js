const { google } = require("googleapis");
const path = require("path");
const express = require("express");
const cors = require("cors");

const SCOPES = ['https://www.googleapis.com/auth/documents.readonly'];
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

    const guides = [];

    function extractTextFromTab(tab) {
        const title = tab.tabProperties?.title || "Guia sem título";
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

        guides.push({
            tituloGuia: title,
            textoDaGuia: text.trim(),
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
    return guides;
}

app.get("/read-doc", async (req, res) => {
    console.log(`Received request to read document with ID: ${DOCUMENT_ID}`);
    try {
        const auth = await authorize();
        const content = await getDocumentContent(auth, DOCUMENT_ID);
        console.log('Document content retrieved successfully:', content);
        return res.send({ guides: content });
    } catch (error) {
        console.error('Error reading document:', error);
        return res.status(500).send({ error: error.message });
    }
});

module.exports = app;