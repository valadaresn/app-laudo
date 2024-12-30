const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const { google } = require("googleapis");
const path = require("path");

const app = express();
app.use(cors({ origin: true }));

const SCOPES = ['https://www.googleapis.com/auth/documents.readonly'];
const CREDENTIALS_PATH = path.join(__dirname, 'service-account.json'); // Atualize o caminho se necessário
const DOCUMENT_ID = "1QY_0TvM8R6fsSMvWYeWPiFUeXWbvXHKvPlxmnN3p15I";

async function authorize() {
    console.log("Authorizing with Google API...");
    try {
        const auth = new google.auth.GoogleAuth({
            keyFile: CREDENTIALS_PATH,
            scopes: SCOPES,
        });
        console.log("Authorization successful.");
        return auth;
    } catch (error) {
        console.error("Error during authorization:", error);
        throw error;
    }
}

async function getDocumentContent(auth, documentId) {
    console.log("Getting document content...");
    try {
        const client = await auth.getClient();
        const docs = google.docs({ version: 'v1', auth: client });
        const res = await docs.documents.get({ documentId });
        const document = res.data;

        let text = '';
        if (document.body && document.body.content) {
            for (const element of document.body.content) {
                if (element.paragraph && element.paragraph.elements) {
                    for (const elem of element.paragraph.elements) {
                        if (elem.textRun && elem.textRun.content) {
                            text += elem.textRun.content;
                        }
                    }
                }
            }
        }
        console.log("Document content retrieved.");
        return text;
    } catch (error) {
        console.error("Error getting document content:", error);
        throw error;
    }
}

app.get("/read-doc", async (req, res) => {
    console.log(`Received request to read document with ID: ${DOCUMENT_ID}`);

    try {
        const auth = await authorize();
        const content = await getDocumentContent(auth, DOCUMENT_ID);
        console.log('Document content retrieved successfully:', content);
        return res.send({ text: content });
    } catch (error) {
        console.error('Error reading document:', error);
        if (error instanceof Error) {
            return res.status(500).send({ error: error.message });
        } else {
            return res.status(500).send({ error: 'An unknown error occurred' });
        }
    }
});

// Endpoint básico para teste
app.get("/", (req, res) => {
    console.log("Received request at root endpoint");
    res.send("Hello from Firebase!");
});

console.log("Registering greetUser function...");
exports.greetUser = functions.https.onRequest(app);
console.log("greetUser function registered.");