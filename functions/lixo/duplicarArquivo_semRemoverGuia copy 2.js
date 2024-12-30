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

async function removeExcludedSubjects(auth, documentId, laudo) {
    const docs = google.docs({ version: 'v1', auth });

    // Primeiro, obtenha o conteúdo do documento
    const document = await docs.documents.get({ documentId });
    let text = '';
    for (const elem of document.data.body.content) {
        if (elem.paragraph) {
            for (const elem2 of elem.paragraph.elements) {
                if (elem2.textRun && elem2.textRun.content) {
                    text += elem2.textRun.content;
                }
            }
        }
    }

    // Regex para identificar subjects e seus conteúdos
    const subjectRegex = /(@[^\n]+)([\s\S]*?)(?=\n@|\n\n|$)/g;
    let match;
    const requests = [];

    while ((match = subjectRegex.exec(text)) !== null) {
        const subjectText = match[0];
        const subjectName = match[1].trim().substring(1).trim();
        const subject = laudo.sections.find(s => s.name === subjectName);

        if (subject && !subject.include) {
            const startIndex = match.index;
            const endIndex = match.index + subjectText.length;

            requests.push({
                deleteContentRange: {
                    range: {
                        startIndex: startIndex,
                        endIndex: endIndex,
                    },
                },
            });
        }
    }

    try {
        if (requests.length > 0) {
            await docs.documents.batchUpdate({
                documentId: documentId,
                requestBody: {
                    requests: requests,
                },
            });
            console.log('Subjects excluídos do documento:', documentId);
        } else {
            console.log('Nenhum subject excluído.');
        }
    } catch (err) {
        console.error('Erro ao excluir subjects do documento:', err);
        throw err;
    }
}

const duplicateDocHandler = async (req, res) => {
    console.log(`Received request to duplicate document with ID: ${DOCUMENT_ID}`);
    try {
        const auth = await authorize();
        const newFileId = await duplicateGoogleDoc(auth, DOCUMENT_ID, "Novo Teste Gerado");

        const laudo = req.body.laudo;
        await removeExcludedSubjects(auth, newFileId, laudo);

        console.log('Documento duplicado e subjects excluídos com sucesso!');
        return res.send({ message: "Documento duplicado e subjects excluídos com sucesso.", newDocumentId: newFileId, url: `https://docs.google.com/document/d/${newFileId}` });
    } catch (error) {
        console.error('Erro ao duplicar o documento:', error);
        return res.status(500).send({ error: error.message });
    }
};

module.exports = duplicateDocHandler;