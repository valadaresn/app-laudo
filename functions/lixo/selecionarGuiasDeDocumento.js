const { google } = require("googleapis");
const path = require("path");
const express = require("express");
const cors = require("cors");
const fs = require('fs');

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

async function copyDocument(auth, documentId) {
    console.log("Copying document...");
    const client = await auth.getClient();
    const drive = google.drive({ version: 'v3', auth: client });

    try {
        // Create a copy of the document
        const copyResponse = await drive.files.copy({
            fileId: documentId,
            requestBody: {
                name: 'selecionarGuiasDeDocumento',
            },
        });

        const newDocumentId = copyResponse.data.id;
        console.log(`Document copied with new ID: ${newDocumentId}`);
        return newDocumentId;
    } catch (error) {
        console.error('Error copying document:', error);
        throw new Error(`Error copying document: ${error.message}`);
    }
}

async function filterDocument(auth, documentId, laudoData) {
    console.log("Filtering document...");
    const client = await auth.getClient();
    const docs = google.docs({ version: 'v1', auth: client });

    try {
        // Get the document content
        const res = await docs.documents.get({
            documentId,
        });
        const document = res.data;

        // Create a list of requests to remove tabs
        const requests = [];

        // Iterate over the tabs and check against laudoData
        document.tabs.forEach((tab, index) => {
            const section = laudoData.sections.find(section => section.name === tab.tabProperties.title);
            if (section && !section.include) {
                requests.push({
                    deleteTab: {
                        tabId: tab.tabId,
                    },
                });
            }
        });

        // Send batch update request to remove tabs
        if (requests.length > 0) {
            await docs.documents.batchUpdate({
                documentId,
                requestBody: {
                    requests: requests,
                },
            });
            console.log("Tabs removed from document.");
        } else {
            console.log("No tabs to remove.");
        }
    } catch (error) {
        console.error('Error filtering document:', error);
        throw new Error(`Error filtering document: ${error.message}`);
    }
}

app.get("/create-and-filter-doc", async (req, res) => {
    console.log("Received request to create and filter a new document");
    try {
        const auth = await authorize();
        const newDocumentId = await copyDocument(auth, DOCUMENT_ID);

        // Load laudoData.json
        const laudoData = JSON.parse(fs.readFileSync(path.join(__dirname, 'laudoData.json'), 'utf8'));

        // Filter the document based on laudoData.json
        await filterDocument(auth, newDocumentId, laudoData);

        console.log('Document created and filtered successfully.');
        const documentUrl = `https://docs.google.com/document/d/${newDocumentId}/edit`;
        return res.send({ message: "Document created and filtered successfully.", documentId: newDocumentId, url: documentUrl });
    } catch (error) {
        console.error('Error creating and filtering document:', error);
        return res.status(500).send({ error: error.message });
    }
});

module.exports = app;