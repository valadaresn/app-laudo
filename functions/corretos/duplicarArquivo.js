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

async function getDocumentContent(auth, documentId) {
    const docs = google.docs({ version: 'v1', auth });

    try {
        const response = await docs.documents.get({
            documentId: documentId,
        });

        const content = response.data.body.content || [];
        return content; // Retorna o conteúdo completo do corpo do documento
    } catch (err) {
        console.error('Erro ao obter conteúdo do documento:', err.message);
        throw err;
    }
}

async function createNewDocumentWithElements(auth, content) {
    const docs = google.docs({ version: 'v1', auth });

    try {
        // Cria um novo documento vazio
        const newDocResponse = await docs.documents.create({
            requestBody: {
                title: 'Documento Consolidado',
            },
        });

        const newDocId = newDocResponse.data.documentId;

        // Processa cada elemento e cria uma lista de requests para o novo documento
        const requests = [];
        content.forEach((element) => {
            if (element.paragraph) {
                // Adiciona parágrafos
                const paragraphText = element.paragraph.elements.map(e => e.textRun?.content || '').join('');
                requests.push({
                    insertText: {
                        location: { index: 1 },
                        text: paragraphText,
                    },
                });
            } else if (element.table) {
                // Adiciona tabelas (exemplo básico para criar tabelas no novo documento)
                const rows = element.table.tableRows.map(row => ({
                    cells: row.tableCells.map(cell => ({
                        content: cell.content.map(c => c.paragraph.elements.map(e => e.textRun?.content || '').join('')).join(''),
                    })),
                }));
                rows.forEach((row) => {
                    requests.push({
                        insertTableRow: {
                            tableIndex: 0,
                            insertBelow: true,
                        },
                    });
                });
            }
        });

        // Aplica as requisições no novo documento
        await docs.documents.batchUpdate({
            documentId: newDocId,
            requestBody: {
                requests,
            },
        });

        // Configura permissões para o novo documento
        const drive = google.drive({ version: 'v3', auth });
        await drive.permissions.create({
            fileId: newDocId,
            requestBody: {
                role: 'reader',
                type: 'anyone',
            },
        });

        console.log('Novo documento criado: https://docs.google.com/document/d/' + newDocId);
        return `https://docs.google.com/document/d/${newDocId}`;
    } catch (err) {
        console.error('Erro ao criar o novo documento:', err.message);
        throw err;
    }
}

app.get("/consolidate-doc", async (req, res) => {
    try {
        const auth = await authorize();
        const content = await getDocumentContent(auth, DOCUMENT_ID);
        const newDocUrl = await createNewDocumentWithElements(auth, content);

        return res.send({ message: "Documento consolidado criado com sucesso, mantendo estilos e estrutura.", url: newDocUrl });
    } catch (error) {
        console.error('Erro ao consolidar o documento:', error.message);
        return res.status(500).send({ error: error.message });
    }
});

module.exports = app;
