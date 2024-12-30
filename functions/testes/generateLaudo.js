const { google } = require("googleapis");
const path = require("path");
const express = require("express");
const cors = require("cors");
const fs = require("fs");

const SCOPES = ['https://www.googleapis.com/auth/drive.file', 'https://www.googleapis.com/auth/documents'];
const CREDENTIALS_PATH = path.join(__dirname, 'service-account.json');
const DOCUMENT_ID = "1QY_0TvM8R6fsSMvWYeWPiFUeXWbvXHKvPlxmnN3p15I";
const LAUDO_DATA_PATH = path.join(__dirname, 'laudoData.json');

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

async function generateLaudo(auth) {
    console.log("Generating laudo...");
    const client = await auth.getClient();
    const docs = google.docs({ version: 'v1', auth: client });

    // Load laudo data from JSON file
    const laudo = JSON.parse(fs.readFileSync(LAUDO_DATA_PATH, 'utf8'));
    console.log("Laudo data loaded:", laudo);

    // Get the template document
    const template = await docs.documents.get({ documentId: DOCUMENT_ID });
    const templateContent = template.data;
    console.log("Template document loaded:", templateContent);

    // Create a new document
    const drive = google.drive({ version: 'v3', auth: client });
    const createResponse = await drive.files.create({
        requestBody: {
            name: 'Generated Laudo',
            mimeType: 'application/vnd.google-apps.document',
        },
    });

    const newDocumentId = createResponse.data.id;
    console.log(`New document created with ID: ${newDocumentId}`);

    // Set permissions to allow anyone with the link to view the document
    await drive.permissions.create({
        fileId: newDocumentId,
        requestBody: {
            role: 'reader',
            type: 'anyone',
        },
    });

    console.log("Permissions set to allow anyone with the link to view the document.");

    // Prepare requests to update the new document
    const requests = [];

    templateContent.body.content.forEach((element, index) => {
        if (element.paragraph && element.paragraph.elements) {
            const tab = templateContent.body.content[index];
            const laudoSection = laudo.sections.find(section => section.name === tab.tabProperties?.title);

            if (laudoSection && laudoSection.include) {
                console.log(`Including section: ${laudoSection.name}`);

                // Copy the tab content to the new document
                let text = element.paragraph.elements.map(e => e.textRun.content).join('');

                // Replace questions with answers
                laudoSection.questions.forEach(({ placeholder, answer }) => {
                    const regex = new RegExp(placeholder, 'g');
                    text = text.replace(regex, answer);
                });

                requests.push({
                    insertText: {
                        location: {
                            index: index + 1,
                        },
                        text: text,
                    },
                });

                // Insert a page break after each tab
                requests.push({
                    insertPageBreak: {
                        location: {
                            index: index + 2,
                        },
                    },
                });
            } else {
                console.log(`Skipping section: ${tab.tabProperties?.title}`);
            }
        }
    });

    if (requests.length === 0) {
        throw new Error("No content to update in the new document.");
    }

    // Update the new document with the prepared requests
    await docs.documents.batchUpdate({
        documentId: newDocumentId,
        requestBody: {
            requests: requests,
        },
    });

    console.log("Laudo generated successfully.");
    return newDocumentId;
}

app.get("/generate-laudo", async (req, res) => {
    console.log("Received request to generate laudo");

    try {
        const auth = await authorize();
        const newDocumentId = await generateLaudo(auth);
        console.log('Laudo generated successfully.');
        const documentUrl = `https://docs.google.com/document/d/${newDocumentId}/edit`;
        return res.send({ message: "Laudo generated successfully.", documentId: newDocumentId, url: documentUrl });
    } catch (error) {
        console.error('Error generating laudo:', error);
        return res.status(500).send({ error: error.message });
    }
});

module.exports = app;