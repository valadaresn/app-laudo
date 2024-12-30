const { google } = require('googleapis');
const path = require('path');
const express = require('express');
const cors = require('cors');

const DRIVE_SCOPES = ['https://www.googleapis.com/auth/drive'];
const CREDENTIALS_PATH = path.join(__dirname, 'service-account.json');
const DOCUMENT_ID = "1QY_0TvM8R6fsSMvWYeWPiFUeXWbvXHKvPlxmnN3p15I";

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

async function authorize() {
    console.log("Authorizing with Google API...");
    const auth = new google.auth.GoogleAuth({
        keyFile: CREDENTIALS_PATH,
        scopes: DRIVE_SCOPES,
    });
    console.log("Authorization successful.");
    return auth;
}

async function duplicateGoogleDoc(auth, fileId, newFileName) {
    const drive = google.drive({ version: 'v3', auth });

    try {
        // Faz a cópia do documento
        const response = await drive.files.copy({
            fileId: fileId,
            requestBody: {
                name: newFileName,
            },
        });

        const newFileId = response.data.id;

        // Define permissões para permitir que qualquer pessoa com o link visualize o documento
        await drive.permissions.create({
            fileId: newFileId,
            requestBody: {
                role: 'reader',
                type: 'anyone',
            },
        });

        console.log('Novo documento criado: ', newFileId);
        console.log('Link do novo documento: https://docs.google.com/document/d/' + newFileId);

        return newFileId;
    } catch (err) {
        console.error('Erro ao duplicar o documento:', err);
        throw err;
    }
}

async function appendLaudoToDoc(auth, documentId, laudo) {
    const docs = google.docs({ version: 'v1', auth });

    const laudoJson = JSON.stringify(laudo, null, 2);

    const requests = [
        {
            insertText: {
                location: {
                    index: 1,
                },
                text: `\n\n${laudoJson}\n`,
            },
        },
    ];

    try {
        await docs.documents.batchUpdate({
            documentId: documentId,
            requestBody: {
                requests: requests,
            },
        });
        console.log('Laudo JSON adicionado ao documento:', documentId);
    } catch (err) {
        console.error('Erro ao adicionar laudo JSON ao documento:', err);
        throw err;
    }
}

const duplicateDocHandler = async (req, res) => {
    console.log(`Received request to duplicate document with ID: ${DOCUMENT_ID}`);
    try {
        const auth = await authorize();
        const newFileId = await duplicateGoogleDoc(auth, DOCUMENT_ID, "Novo Teste Gerado");

        const laudo = req.body.laudo;
        await appendLaudoToDoc(auth, newFileId, laudo);

        console.log('Documento duplicado e laudo JSON adicionado com sucesso!');
        return res.send({ message: "Documento duplicado e laudo JSON adicionado com sucesso.", newDocumentId: newFileId, url: `https://docs.google.com/document/d/${newFileId}` });
    } catch (error) {
        console.error('Erro ao duplicar o documento:', error);
        return res.status(500).send({ error: error.message });
    }
};

module.exports = duplicateDocHandler;