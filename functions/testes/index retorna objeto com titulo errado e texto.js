const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const { google } = require("googleapis");
const path = require("path");

const app = express();
app.use(cors({ origin: true }));

const SCOPES = ['https://www.googleapis.com/auth/documents.readonly'];
const CREDENTIALS_PATH = path.join(__dirname, 'service-account.json');
const DOCUMENT_ID = "1QY_0TvM8R6fsSMvWYeWPiFUeXWbvXHKvPlxmnN3p15I";

async function authorize() {
    const auth = new google.auth.GoogleAuth({
        keyFile: CREDENTIALS_PATH,
        scopes: SCOPES,
    });
    return auth;
}

app.get("/read-doc", async (req, res) => {
    try {
        const auth = await authorize();
        const client = await auth.getClient();
        const docs = google.docs({ version: 'v1', auth: client });
        const document = await docs.documents.get({
            documentId: DOCUMENT_ID,
            includeTabsContent: true, // Inclui o conteúdo de todas as guias
        });

        // Envia o JSON completo do documento
        return res.send(document.data);
    } catch (error) {
        console.error('Error reading document:', error);
        return res.status(500).send({ error: error.message });
    }
});

exports.greetUser = functions.https.onRequest(app);
