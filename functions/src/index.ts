// import * as functions from "firebase-functions";
const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const { XummSdk } = require("xumm-sdk");

const app = express();
app.use(cors({ origin: true }));

const sdk = new XummSdk(
  functions.config().xummsdk.key,
  functions.config().xummsdk.secret
);

app.get("/generateLink", async (req: object, res: any) => {
  try {
    const created = await sdk.payload.create(req);

    res.status(200).json({ url: created, error: null });
  } catch (e) {
    res.status(201).json({ url: null, error: "unable_to_generate_url" });
  }
});
