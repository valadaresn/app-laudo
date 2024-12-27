const functions = require("firebase-functions");
const app = require("./processDocument");

// Exporte a função para o Firebase
exports.greetUser = functions.https.onRequest(app);
