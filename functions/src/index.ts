// import * as functions from "firebase-functions";
const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const { XummSdk } = require("xumm-sdk");

const app = express();

var corsOptions = {
  origin: true,
};

app.use(cors(corsOptions));

const sdk = new XummSdk(
  functions.config().xummsdk.key,
  functions.config().xummsdk.secret
);

function getTrustSetTxPayload(
  issuer_address: string,
  currency_id_hex_string: string,
  limit_value: string
) {
  return {
    TransactionType: "TrustSet",
    Flags: 131072,
    LimitAmount: {
      currency: currency_id_hex_string,
      issuer: issuer_address,
      value: limit_value,
    },
  };
}

//*
interface request_body {
  issuer_address: string;
  currency_id_hex_string: string;
}
interface request_object {
  body: request_body;
}
//*/
app.post("/generateLink", async (req: request_object, res: any) => {
  try {
    //*
    const _payload = getTrustSetTxPayload(
      req.body.issuer_address,
      req.body.currency_id_hex_string,
      "1000000000000000e-96"
    );
    //*/

    /*
    const _payload = getTrustSetTxPayload(
      "rsBQmWC4F7NcSfRTY8DJqUBRjDP8E157vG",
      "0213000303FC09B0000000454C534C6F676F3031",
      "1000000000000000e-96"
    );
    //*/

    const created = await sdk.payload.create(_payload);

    res.status(200).json({ url: created.next.always, error: null });
  } catch (e) {
    res.status(201).json({ url: null, error: "unable_to_generate_url" });
  }
});

exports.api = functions.region("europe-west1").https.onRequest(app);
