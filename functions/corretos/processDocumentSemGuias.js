const { google } = require("googleapis");
const path = require("path");
const express = require("express");
const cors = require("cors");

const SCOPES = ['https://www.googleapis.com/auth/documents.readonly'];
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

async function getDocument(auth) {
    const docs = google.docs({ version: 'v1', auth });
    const res = await docs.documents.get({
        documentId: DOCUMENT_ID,
    });
    return res.data;
}

function processDocument(document) {
    const laudo = [];
    let text = '';

    // Extrair texto do documento
    for (const elem of document.body.content) {
        if (elem.paragraph) {
            for (const elem2 of elem.paragraph.elements) {
                if (elem2.textRun && elem2.textRun.content) {
                    text += elem2.textRun.content;
                }
            }
        }
    }

    console.log("Extracted text:", text);

    // Regex para identificar subjects e placeholders
    const subjectRegex = /@(.+?)(?=\n@|\n\n|$)/gs;
    const placeholderRegex = /\{([^}]+)\}/g;

    let match;
    while ((match = subjectRegex.exec(text)) !== null) {
        const subjectText = match[1].trim();
        console.log("Found subject:", subjectText);
        const questions = [];
        let placeholderMatch;
        while ((placeholderMatch = placeholderRegex.exec(subjectText)) !== null) {
            questions.push(placeholderMatch[1].trim());
            console.log("Found placeholder:", placeholderMatch[1].trim());
        }
        laudo.push({
            subject: subjectText.split('\n')[0].trim(), // Primeira linha como título do subject
            questions: questions,
        });
    }

    console.log("Document content retrieved:", laudo);
    return laudo;
}

app.get("/read-doc", async (req, res) => {
    try {
        const auth = await authorize();
        const document = await getDocument(auth);
        const laudo = processDocument(document);
        res.status(200).json(laudo);
    } catch (error) {
        console.error("Error reading document:", error);
        res.status(500).send("Error reading document");
    }
});

module.exports = app;