const functions = require("firebase-functions");
const app = require("./processDocument");

console.log("Registering greetUser function...");
exports.greetUser = functions.https.onRequest(app);
console.log("greetUser function registered.");