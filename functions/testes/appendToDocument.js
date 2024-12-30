const { google } = require("googleapis");
const path = require("path");
const express = require("express");
const cors = require("cors");

const SCOPES = ['https://www.googleapis.com/auth/documents'];
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

async function appendTextToDocument(auth, documentId, text) {
    console.log("Appending text to document...");
    const client = await auth.getClient();
    const docs = google.docs({ version: 'v1', auth: client });

    // Get the document to find the end index
    const doc = await docs.documents.get({ documentId });
    const endIndex = doc.data.body.content[doc.data.body.content.length - 1].endIndex;

    const requests = [
        {
            insertText: {
                location: {
                    index: endIndex - 1, // Insert at the end of the document
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

    console.log("Text appended to document.");
}

app.get("/append-text", async (req, res) => {
    console.log(`Received request to append text to document with ID: ${DOCUMENT_ID}`);
    try {
        const auth = await authorize();
        await appendTextToDocument(auth, DOCUMENT_ID, "Olá, Mundo!");
        console.log('Text appended successfully.');
        return res.send({ message: "Text appended successfully." });
    } catch (error) {
        console.error('Error appending text to document:', error);
        return res.status(500).send({ error: error.message });
    }
});

module.exports = app;