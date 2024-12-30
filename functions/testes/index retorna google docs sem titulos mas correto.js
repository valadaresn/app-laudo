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

async function getDocumentContent(auth, documentId) {
    const client = await auth.getClient();
    const docs = google.docs({ version: 'v1', auth: client });
    const res = await docs.documents.get({
        documentId,
        includeTabsContent: true, // Inclui o conteúdo de todas as guias
    });
    const document = res.data;

    if (!document.tabs || document.tabs.length === 0) {
        throw new Error("O documento não contém guias.");
    }

    const guides = []; // Array para armazenar os dados de cada guia

    function extractTextFromTab(tab) {
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

        const title = tab.title || "Guia sem título"; // Tenta pegar o título da guia ou um padrão
        guides.push({
            tituloGuia: title,
            textoDaGuia: text.trim(), // Remove espaços desnecessários
        });

        // Verifica guias filhas, se existirem
        if (tab.childTabs && tab.childTabs.length > 0) {
            for (const childTab of tab.childTabs) {
                extractTextFromTab(childTab);
            }
        }
    }

    // Processa cada guia principal
    for (const tab of document.tabs) {
        extractTextFromTab(tab);
    }
    return guides;
}

app.get("/read-doc", async (req, res) => {
    try {
        const auth = await authorize();
        const content = await getDocumentContent(auth, DOCUMENT_ID);
        return res.send({ guides: content });
    } catch (error) {
        console.error('Error reading document:', error);
        return res.status(500).send({ error: error.message });
    }
});

exports.greetUser = functions.https.onRequest(app);
