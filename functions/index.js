const functions = require("firebase-functions");
const processDocumentApp = require("./processDocument");
const appendToDocumentApp = require("./appendToDocument");
const createAndWriteDocumentApp = require("./createAndWriteDocument");
const generateLaudoApp = require("./generateLaudo");
const extractTextFromTabsApp = require("./extractTextFromTabs");

console.log("Registering greetUser function...");
exports.greetUser = functions.https.onRequest(processDocumentApp);
console.log("greetUser function registered.");

console.log("Registering appendText function...");
exports.appendText = functions.https.onRequest(appendToDocumentApp);
console.log("appendText function registered.");

console.log("Registering createAndWriteDocument function...");
exports.createAndWriteDocument = functions.https.onRequest(createAndWriteDocumentApp);
console.log("createAndWriteDocument function registered.");

console.log("Registering generateLaudo function...");
exports.generateLaudo = functions.https.onRequest(generateLaudoApp);
console.log("generateLaudo function registered.");

console.log("Registering extractTextFromTabs function...");
exports.extractTextFromTabs = functions.https.onRequest(extractTextFromTabsApp);
console.log("extractTextFromTabs function registered.");