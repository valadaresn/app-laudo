const { google } = require("googleapis");
const path = require("path");
const express = require("express");
const cors = require("cors");

const SCOPES = ['https://www.googleapis.com/auth/drive.file', 'https://www.googleapis.com/auth/documents'];
const CREDENTIALS_PATH = path.join(__dirname, 'service-account.json');

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

async function createAndWriteDocument(auth) {
    console.log("Creating and writing to document...");
    const client = await auth.getClient();
    const drive = google.drive({ version: 'v3', auth: client });
    const docs = google.docs({ version: 'v1', auth: client });

    // Create a new document
    const createResponse = await drive.files.create({
        requestBody: {
            name: 'teste2 google docs',
            mimeType: 'application/vnd.google-apps.document',
        },
    });

    const documentId = createResponse.data.id;
    console.log(`Document created with ID: ${documentId}`);

    // Write "Olá, Mundo!" to the new document
    const requests = [
        {
            insertText: {
                location: {
                    index: 1, // Index 1 is the start of the document
                },
                text: "Olá, Mundo!",
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

app.get("/create-and-write-doc", async (req, res) => {
    console.log("Received request to create and write to a new document");
    try {
        const auth = await authorize();
        const documentId = await createAndWriteDocument(auth);
        console.log('Document created and text written successfully.');
        const documentUrl = `https://docs.google.com/document/d/${documentId}/edit`;
        return res.send({ message: "Document created and text written successfully.", documentId: documentId, url: documentUrl });
    } catch (error) {
        console.error('Error creating and writing to document:', error);
        return res.status(500).send({ error: error.message });
    }
});

module.exports = app;