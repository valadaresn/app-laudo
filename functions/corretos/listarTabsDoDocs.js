const { google } = require('googleapis');
const path = require('path');
const express = require('express');
const cors = require('cors');

const DRIVE_SCOPES = ['https://www.googleapis.com/auth/drive'];
const CREDENTIALS_PATH = path.join(__dirname, 'service-account.json');
const DOCUMENT_ID = "1QY_0TvM8R6fsSMvWYeWPiFUeXWbvXHKvPlxmnN3p15I";

const app = express();
app.use(cors({ origin: true }));

async function authorize() {
    const auth = new google.auth.GoogleAuth({
        keyFile: CREDENTIALS_PATH,
        scopes: DRIVE_SCOPES,
    });
    return auth;
}

async function listTabs(auth, documentId) {
    const docs = google.docs({ version: 'v1', auth });

    try {
        const response = await docs.documents.get({
            documentId: documentId,
        });

        const bodyContent = response.data.body.content || [];
        const tabs = [];

        // Percorre o conteúdo para identificar seções correspondentes às guias
        bodyContent.forEach((element, index) => {
            if (element.sectionBreak && element.sectionBreak.sectionStyle) {
                const title = element.sectionBreak.sectionStyle.sectionName || `Seção ${index + 1}`;
                const startIndex = element.startIndex || 0;
                const endIndex = bodyContent[index + 1]?.startIndex || null; // Próximo início como fim
                tabs.push({ title, startIndex, endIndex });
            }
        });

        console.log('Detalhes das guias encontradas:', tabs);
        return tabs;
    } catch (err) {
        console.error('Erro ao listar as guias:', err.message);
        throw err;
    }
}

app.get("/list-tabs", async (req, res) => {
    try {
        const auth = await authorize();
        const tabs = await listTabs(auth, DOCUMENT_ID);
        return res.send({ message: "Guias listadas com sucesso.", tabs });
    } catch (error) {
        console.error('Erro ao listar as guias:', error.message);
        return res.status(500).send({ error: error.message });
    }
});

module.exports = app;
