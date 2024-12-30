const functions = require("firebase-functions");
const fs = require("fs");
const path = require("path");

const functionsPath = path.join(__dirname, "corretos");

fs.readdirSync(functionsPath).forEach(file => {
    if (file.endsWith(".js")) {
        const functionName = path.basename(file, ".js");
        const functionModule = require(path.join(functionsPath, file));
        console.log(`Registering ${functionName} function...`);
        exports[functionName] = functions.https.onRequest(functionModule);
        console.log(`${functionName} function registered.`);
    }
});