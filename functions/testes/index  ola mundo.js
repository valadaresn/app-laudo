const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors({ origin: true }));

// Endpoint simples para retornar "Olá, Mundo!"
app.get("/", (req, res) => {
  res.send("Olá, Mundo!");
});

exports.greetUser = functions.https.onRequest(app);
