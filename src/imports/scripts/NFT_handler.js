import {
  printErrorWithPrefix,
  printWithPrefix,
  isUndefinedOrNull,
  hexToAscii,
  bytesToHex,
  stringToUTF8Bytes,
  hexToBigInt,
  intToHexString,
  stringToHexString,
  getFirst4BitsFromHexString,
  convertToHttp,
  isValidHttpUrl,
  extractCIDFromHashUrl,
} from "./utils.mjs";
import {
  getCorrectRippleApiObj,
  connectToAServer,
  logConnectionStatus,
  ctiTxIndex,
  ctiLedgerIndex,
  ctiLedgerHash,
  ctiTxHash,
  verifyAccountDomain,
  rippleApiRequest,
  rippleApiGetBalances,
  rippleApiGetSettings,
} from "./ripple_handler.mjs";
import { IPFSFetch } from "./ipfs_handler.mjs";

async function getMemoTx(nft_cti, ripple_api_obj) {
  const _prefix = "getMemoTx(): ";

  //request the ledger
  const cti_ledger_index = ctiLedgerIndex(nft_cti);
  const ledger_result = await rippleApiRequest(ripple_api_obj, "ledger", {
    ledger_index: cti_ledger_index.toString(),
    transactions: true,
    expand: true,
    binary: false,
  });

  //get the right Tx
  const cti_tx_index = ctiTxIndex(nft_cti);
  const ledger_txs = ledger_result.ledger.transactions;
  var metadata_tx = null;
  var _tx;
  for (var i = 0; i < ledger_txs.length; i++) {
    _tx = ledger_txs[i];
    if (_tx.metaData.TransactionIndex === cti_tx_index) {
      //if the index is the correct one
      metadata_tx = _tx;
      break;
    }
  }

  return { ledger_result: ledger_result, metadata_tx: metadata_tx };
}
async function getMemoFromMemoTx(nft_cti, ripple_api_obj) {
  const _prefix = "getMemoFromMemoTx(): ";

  const cti_ledger_hash = ctiLedgerHash(nft_cti);
  const cti_tx_hash = ctiTxHash(nft_cti);

  //get the metadata tx
  const _memo_tx_result = await getMemoTx(nft_cti, ripple_api_obj);
  const ledger_result = _memo_tx_result.ledger_result;
  const metadata_tx = _memo_tx_result.metadata_tx;
  if (metadata_tx === null) {
    //console.log("Incorrect CTI: Tx not found");
    throw new Error("Incorrect CTI: Tx not found");
  }

  //get ledger hash, and take the 1st 4 bits
  const ledger_hash = ledger_result.ledger_hash;
  const ledger_hash_starting_4_bits = getFirst4BitsFromHexString(ledger_hash);
  if (cti_ledger_hash !== ledger_hash_starting_4_bits) {
    //console.log("Incorrect CTI: Ledger Hash not matching");
    throw new Error("Incorrect CTI: Ledger Hash not matching");
    //return null;
  }

  //get tx hash, and take the 1st 4 bits
  const tx_hash = metadata_tx.hash;
  const tx_hash_starting_4_bits = getFirst4BitsFromHexString(tx_hash);
  if (cti_tx_hash !== tx_hash_starting_4_bits) {
    //console.log("Incorrect CTI: Tx Hash not matching");
    throw new Error("Incorrect CTI: Tx Hash not matching");
    //return null;
  }

  return { memos: metadata_tx.Memos, metadata_tx_hash: tx_hash };
}

async function getMetadata(metadata_cid, nft_cti, ripple_api_obj) {
  const _prefix = "getMetadata: ";
  var metadata_obj = {
    name: null,
    description: null,
    author: null,
    content_cid: null,
    metadata_tx_hash: null,
  };

  var found = false;
  if (isUndefinedOrNull(metadata_cid)) {
    //if the CID is null or undefined
    //printWithPrefix("metadata_cid is undefined or null", _prefix);
  } else {
    //if the CID is not null or undefined
    //printWithPrefix("fetching CID " + metadata_cid + "...", _prefix);
    await IPFSFetch(metadata_cid)
      .then((response) => {
        if (isUndefinedOrNull(response)) {
          throw new Error(
            "Fetching operation gave undefined or null as a response"
          );
        }

        return response.json();
      })
      .then((response_json) => {
        if (isUndefinedOrNull(response_json)) {
          throw new Error(
            "Conversion to json operation gave undefined or null as a response"
          );
        }

        metadata_obj.name = isUndefinedOrNull(response_json.name)
          ? null
          : response_json.name;
        metadata_obj.description = isUndefinedOrNull(response_json.description)
          ? null
          : response_json.description;
        metadata_obj.content_cid = isUndefinedOrNull(response_json.image)
          ? null
          : extractCIDFromHashUrl(response_json.image);
        if (!isUndefinedOrNull(response_json.properties)) {
          metadata_obj.author = isUndefinedOrNull(
            response_json.properties.author
          )
            ? null
            : response_json.properties.author;
        }

        found = true;
      })
      .catch((error) => {
        //printWithPrefix("metadata retrieval for " + metadata_cid + " (maybe partially) failed", _prefix);
        //printErrorWithPrefix(error, _prefix);
      });
  }

  if (found) {
    //if all the metadata were successfully retrieved from IPFS
    //printWithPrefix("All the metadata were retrieved from IPFS!", _prefix);
    if (nft_cti === 0) {
      //if the CTI is not defined
      //printWithPrefix("the CTI is not defined, therefore we cannot retrieve the on-chain metadata Tx", _prefix);
      return metadata_obj;
    }
    //get only the metadata Tx hash
    const _memo_tx_obj = await getMemoTx(nft_cti, ripple_api_obj);
    const _metadata_tx = _memo_tx_obj.metadata_tx;
    if (isUndefinedOrNull(_metadata_tx)) {
      //printWithPrefix("the retrieved metadata Tx is undefined or null", _prefix);
      return metadata_obj;
    }
    metadata_obj.metadata_tx_hash = _metadata_tx.hash;
    return metadata_obj;
  }
  //printWithPrefix("NOT all the metadata were retrieved from IPFS", _prefix);

  if (nft_cti === 0) {
    //if the CTI is not defined
    //printWithPrefix("the CTI is not defined, therefore we cannot retrieve the on-chain metadata", _prefix);
    return metadata_obj;
  }
  //if the CTI is defined, get the memo fields from the metadata Tx
  const _memos_obj = await getMemoFromMemoTx(nft_cti, ripple_api_obj);
  if (_memos_obj === null) {
    //printWithPrefix("no metadata Tx found found", _prefix);
    return metadata_obj;
  }
  //get the metadata Tx hash
  metadata_obj.metadata_tx_hash = _memos_obj.metadata_tx_hash;
  const memos = _memos_obj.memos;
  if (memos === null) {
    //printWithPrefix("no memos found", _prefix);
    return metadata_obj;
  }

  var memo_type;
  for (let i = 0; i < memos.length; i++) {
    memo_type = hexToAscii(memos[i].Memo.MemoType).toLowerCase();

    if (memo_type === "description" && metadata_obj.description === null) {
      metadata_obj.description = hexToAscii(memos[i].Memo.MemoData);
    } else if (memo_type === "author" && metadata_obj.author === null) {
      metadata_obj.author = hexToAscii(memos[i].Memo.MemoData);
    } else if (
      memo_type === "primaryuri" &&
      metadata_obj.content_url === null
    ) {
      metadata_obj.content_cid = extractCIDFromHashUrl(
        hexToAscii(memos[i].Memo.MemoData)
      );
    }
  }

  return metadata_obj;
}
function composeCurrencyIdHexString(_cti, nft_id) {
  return (
    "02" +
    intToHexString(_cti).padStart(14, "0") +
    stringToHexString(nft_id).padStart(24, "0")
  );
}
async function getHotWallet(issuer_address, nft_id, nft_cti, ripple_api_obj) {
  const _prefix = "getHotWallet: ";
  var detected_hot_wallet_obj = {
    value: null,
    certified: false,
  };

  //TODO PUSH THESE CHANGES
  //OLD
  //const _ledger_index = ctiLedgerIndex(nft_cti);
  //NEW
  var _ledger_index;
  if (nft_cti > 0) {
    _ledger_index = ctiLedgerIndex(nft_cti);
  }

  //request the account's transactions
  const result = await rippleApiRequest(ripple_api_obj, "account_tx", {
    account: issuer_address,
    binary: false,
    forward: true,
    ledger_index_min: -1,
    ledger_index_max: -1,
  });

  //OLD
  //if(result.ledger_index_min <= _ledger_index){
  //NEW
  if (nft_cti > 0 && result.ledger_index_min <= _ledger_index) {
    detected_hot_wallet_obj.certified = true;
    //printWithPrefix("Hot Wallet certified", _prefix);
  }

  const currency_id_hex_string = composeCurrencyIdHexString(nft_cti, nft_id);
  const transactions = result.transactions;
  var detected_issuing_tx = null;
  for (let i = 0; i < transactions.length; i++) {
    const tx_data = transactions[i].tx;

    if (tx_data.Account !== issuer_address) {
      //if the Tx is not initiated by issuer_address
      continue; //just skip it
    }
    if (tx_data.TransactionType !== "Payment") {
      //if the Tx is not a payment
      continue; //just skip it
    }
    const tx_amount = tx_data.Amount;
    if (
      tx_amount.currency !== currency_id_hex_string || //if the currency is not the interested one
      tx_amount.issuer !== issuer_address
    ) {
      // or if has not been issued by issuer_address
      continue; //just skip it
    }
    if (tx_amount.value !== "1000000000000000e-96") {
      //if the amount sent is not the indivisible one
      //printWithPrefix("there's a Tx issuing more than 1000000000000000e-96", _prefix);//then it's an error
      throw new Error(
        "not an NFT: there's a Tx issuing more than 1000000000000000e-96"
      );
      //return {is_ok: false, value: null};
    }
    if (detected_hot_wallet_obj.value !== null) {
      //if there's more than one issuing Tx
      //then it's an error
      //printWithPrefix("there's more than one issuing Tx or there's a trustline opened for this currency", _prefix);
      throw new Error(
        "not an NFT: either there are more than one issuing Tx or the issuer has a trustline opened for this currency"
      );
      //return {is_ok: false, value: null};
    }

    //here we have the 1st payment, from the issuing account, in the issued currency, of the indivisible amount: the Issue Tx
    //the receiver must be the (suspected) hot wallet
    detected_hot_wallet_obj.value = tx_data.Destination;

    //here we cannot return because we gotta check that no other "irregular" Tx happened after the (supposed) issuing one.
    //So, the issuing account cannot send the NFT, receive it back and send it again: that would trigger an error.
    //Therefore, if someone sends back the NFT to the issuer account (which meanwhile should've been blackholed, btw),
    //then that NFT is burned. In that case the previously retrieved balance is 0: no one holds the NFT, which is consistent.
    //Due to the fact that we checked the received ledger's index, we cannot have missed the right issuing Tx nor the metadata one.
  }

  if (
    detected_hot_wallet_obj.certified &&
    detected_hot_wallet_obj.value === null
  ) {
    //if we got all the Tx for prior to the one referenced
    //by the CTI, then we must also have the issuing Tx, so the hot wallet. If not, it means that there were no Txs concerning
    //this currency, therefore the balance check we just performed earlier must have thrown an error.
    //In any case, here something went wrong.
    return { is_ok: false, value: null };
  }

  return { is_ok: true, value: detected_hot_wallet_obj };
}
function isNegativeNFTValue(_value) {
  //const NFT_VALUE = "-0.000000000000000000000000000000000000000000000000000000000000000000000000000000001";
  return _value === "-1000000000000000e-96";
}
function isPositiveNFTValue(_value) {
  //const NFT_VALUE = "-0.000000000000000000000000000000000000000000000000000000000000000000000000000000001";
  return _value === "1000000000000000e-96";
}
function isAnNFTCurrencyId(currency_id) {
  if (currency_id.length <= 3) {
    //check that what you got is not the 3 letter id
    return false;
  }
  if (currency_id.substring(0, 2) !== "02") {
    //check that what you got starts w/ something !== '02'
    return false;
  }
  return true;
}
function getNFTIdFromCurrencyId(currency_id) {
  var nft_id_hex_string = currency_id.substring(16, 40);
  nft_id_hex_string = nft_id_hex_string.replace(/^0+/, "");
  if (nft_id_hex_string.length % 2 !== 0) {
    nft_id_hex_string = "0" + nft_id_hex_string;
  }
  return hexToAscii(nft_id_hex_string);
}
function getNFTCTIFromCurrencyId(currency_id) {
  return hexToBigInt(currency_id.substring(2, 16));
}
async function getActualNFTOwner(issuer_address, nft_id, ripple_api_obj) {
  const _prefix = "getActualNFTOwner: ";

  const balances = await rippleApiGetBalances(ripple_api_obj, issuer_address);
  if (balances.length === 0) {
    //printWithPrefix("there's no balance in the inserted address", _prefix);
    throw new Error(
      "not an NFT: there are no balances in the inserted address"
    );
    //return {is_ok: false, value: null, cti: null};
  }

  var detected_cti = null;
  var actual_nft_owner = null;
  var _nft_id = null;
  var _nft_cti = null;
  for (let i = 0; i < balances.length; i++) {
    //for each balance of the issuer address
    if (!isAnNFTCurrencyId(balances[i].currency)) {
      //if it's not an NFT currency
      continue; //skip it
    }
    _nft_id = getNFTIdFromCurrencyId(balances[i].currency);
    if (_nft_id !== nft_id) {
      //if the last 12 bytes are different
      continue; //skip it
    }
    _nft_cti = getNFTCTIFromCurrencyId(balances[i].currency);
    if (detected_cti !== null) {
      //if the cti has already been found
      if (detected_cti !== _nft_cti) {
        //and if it's different from that then it's an error
        //printWithPrefix("ambiguity error: there's more than one currency with the same NFT id", _prefix);
        throw new Error(
          "ambiguity error: there's more than one currency with the same NFT id"
        );
        //return {is_ok: false, value: null, cti: null};
      }
    } else {
      //if it's the 1st cti you found (i.e., the 1st balance w/ the last 12 bytes interested), save it
      detected_cti = _nft_cti;
    }
    //now you are sure that this is the currency you are interested in

    if (balances[i].value === "0") {
      //if the balance is 0 then it's useless
      continue;
    }
    if (!isNegativeNFTValue(balances[i].value)) {
      //if the balance is not the NFT value then it's an error
      //printWithPrefix("there's more than 1000000000000000e-96 coins in circulation", _prefix);
      if (!isPositiveNFTValue(balances[i].value)) {
        throw new Error(
          "not an NFT: there's more than 1000000000000000e-96 coins in circulation"
        );
      }
      throw new Error("the inserted address is not the issuer for this NFT");
      //return {is_ok: false, value: null, cti: null};
    }
    if (actual_nft_owner !== null) {
      //if it's not the 1st time an amount is valid, then it's an error
      //printWithPrefix("there's more than one owner at the same time", _prefix);
      throw new Error(
        "not an NFT: there's more than one owner at the same time"
      );
      //return {is_ok: false, value: null, cti: null};
    }
    actual_nft_owner = balances[i].counterparty;
  }

  if (detected_cti === null) {
    //if detected_cti remained null it means that no currency with that name were found,
    throw Error("no currency with that name were found"); //so it's an error
  }
  return { is_ok: true, value: actual_nft_owner, cti: detected_cti };
}
async function isBlackHoled(issuer_address_settings) {
  if (
    issuer_address_settings.regularKey !== "rrrrrrrrrrrrrrrrrrrrBZbvji" ||
    !issuer_address_settings.disableMasterKey
  ) {
    //if the account has not blackholed
    return false;
  }
  return true;
}
async function isNFT(issuer_address, nft_id, ripple_api_obj) {
  const _prefix = "isNFT(): ";

  const issuer_address_settings = await rippleApiGetSettings(
    ripple_api_obj,
    issuer_address
  );
  if (!(await isBlackHoled(issuer_address_settings))) {
    //printWithPrefix("The account is not blackholed", _prefix);
    throw new Error(
      "not an NFT: the inserted issuer account is not blackholed"
    );
    //return false;
  }
  const actual_nft_owner_obj = await getActualNFTOwner(
    issuer_address,
    nft_id,
    ripple_api_obj
  );
  if (!actual_nft_owner_obj.is_ok) {
    //if something went wrong while searching the actual owner
    throw new Error("something went wrong while searching the actual owner");
    //return {is_ok: false, actual_nft_owner: null, detected_hot_wallet_obj: null, detected_cti: null, issuer_address_settings: null};
  }
  const detected_hot_wallet_obj_obj = await getHotWallet(
    issuer_address,
    nft_id,
    actual_nft_owner_obj.cti,
    ripple_api_obj
  );
  if (!detected_hot_wallet_obj_obj.is_ok) {
    //if something went wrong while searching the hot wallet
    throw new Error("something went wrong while searching the hot wallet");
    //return {is_ok: false, actual_nft_owner: null, detected_hot_wallet_obj: null, detected_cti: null, issuer_address_settings: null};
  }

  const actual_nft_owner = actual_nft_owner_obj.value;
  const detected_hot_wallet_obj = detected_hot_wallet_obj_obj.value;
  const detected_cti = actual_nft_owner_obj.cti;

  //if no one has 1e-96 in its account then there's no owner, but it's ok
  //this could happen if someone sends the NFT without having the counterparty to first open the trustline to it
  if (isUndefinedOrNull(actual_nft_owner)) {
    //printWithPrefix("There's no owner for this NFT!", _prefix);
  }

  return {
    is_ok: true,
    actual_nft_owner: actual_nft_owner,
    detected_hot_wallet_obj: detected_hot_wallet_obj,
    detected_cti: detected_cti,
    issuer_address_settings: issuer_address_settings,
  };
}

async function getNFTMinter(detected_hot_wallet_obj, network, ripple_api_obj) {
  const _prefix = "getNFTMinter(): ";

  if (isUndefinedOrNull(detected_hot_wallet_obj)) {
    printWithPrefix("detected_hot_wallet_obj is undefined or null", _prefix);
    //throw new Error("unable to retrieve the hot wallet");
    return null;
  }
  const detected_hot_wallet = detected_hot_wallet_obj.value;
  if (isUndefinedOrNull(detected_hot_wallet)) {
    printWithPrefix("detected_hot_wallet is undefined or null", _prefix);
    //throw new Error("unable to retrieve the hot wallet");
    return null;
  }

  const hot_wallet_settings = await rippleApiGetSettings(
    ripple_api_obj,
    detected_hot_wallet
  );
  const detected_hot_wallet_domain = hot_wallet_settings.domain;
  //printWithPrefix("detected_hot_wallet_domain = " + detected_hot_wallet_domain, _prefix);
  const is_hot_wallet_domain_certified = await verifyAccountDomain(
    detected_hot_wallet_domain,
    detected_hot_wallet,
    network
  );
  //const is_hot_wallet_domain_certified = await verifyAccountDomain("192.168.1.19:8080", detected_hot_wallet, network);
  //printWithPrefix("is_hot_wallet_domain_certified = " + is_hot_wallet_domain_certified, _prefix);

  const is_hot_wallet_certified = detected_hot_wallet_obj.certified;
  //printWithPrefix("is_hot_wallet_certified = " + is_hot_wallet_certified, _prefix);
  return {
    certified:
      is_hot_wallet_certified &&
      is_hot_wallet_domain_certified &&
      detected_hot_wallet_domain === "aesthetes.art",
    //certified: (is_hot_wallet_certified && is_hot_wallet_domain_certified),
    value: detected_hot_wallet_domain,
  };
}

export const getNFTMetadata = async function (issuer_address, nft_id, network) {
  const _prefix = "getNFTMetadata: ";
  var ripple_api_obj = getCorrectRippleApiObj(network);
  //logConnectionStatus(ripple_api_obj, 1);

  if (
    isUndefinedOrNull(ripple_api_obj.api) ||
    !ripple_api_obj.api.isConnected()
  ) {
    //if we're not connected to a rippled server (for this network)
    await connectToAServer(ripple_api_obj, network); //connect to one
  }
  const ripple_api = ripple_api_obj.api;
  if (!ripple_api.isValidAddress(issuer_address)) {
    //printWithPrefix("The inserted address is invalid", _prefix);
    throw new Error("The inserted address is invalid");
    //return null;
  }
  if (nft_id.length > 12) {
    //printWithPrefix("The currency name is too long", _prefix);
    throw new Error("The currency name is too long");
    //return null;
  }
  const is_nft = await isNFT(issuer_address, nft_id, ripple_api_obj);
  if (!is_nft.is_ok) {
    //printWithPrefix("The inserted data DOES NOT CORRESPOND to an NFT", _prefix);
    throw new Error("The inserted data DOES NOT CORRESPOND to an NFT");
    //return null;
  }
  //now we're sure that the currency selected by the user is in fact an NFT

  //check the NFT origin
  const detected_minter_obj = await getNFTMinter(
    is_nft.detected_hot_wallet_obj,
    network,
    ripple_api_obj
  );

  const metadata_cid = extractCIDFromHashUrl(
    is_nft.issuer_address_settings.domain
  );
  //printWithPrefix("metadata_cid: " + metadata_cid, _prefix);
  const metadata = await getMetadata(
    metadata_cid,
    is_nft.detected_cti,
    ripple_api_obj
  );
  //console.log(_prefix + "metadata = ", metadata);

  return {
    identifier: isUndefinedOrNull(metadata.name) ? nft_id : metadata.name,
    actual_nft_owner: is_nft.actual_nft_owner,
    detected_hot_wallet_obj: is_nft.detected_hot_wallet_obj,
    detected_minter_obj: detected_minter_obj,
    metadata_cid: metadata_cid,
    detected_cti: is_nft.detected_cti,
    metadata_tx_hash: metadata.metadata_tx_hash,
    name: metadata.name,
    description: metadata.description,
    author: metadata.author,
    content_cid: metadata.content_cid,
  };
};

export const getNFTImage = async function (content_cid) {
  const _prefix = "getNFTImage(): ";

  //if the CID is not null or undefined
  var image_object_url = null;
  var image_object_type = null;
  //printWithPrefix("fetching image from CID " + content_cid + "...", _prefix);
  await IPFSFetch(content_cid)
    .then(async (response) => {
      if (isUndefinedOrNull(response)) {
        throw new Error(
          "Fetching operation gave undefined or null as a response"
        );
      }

      // var reader = new FileReader();
      // reader.readAsDataURL(response.blob());
      // reader.onloadend = function () {
      //   var base64data = reader.result;
      //   console.log(base64data);
      // };
      return response.blob();
    })
    .then((image_blob) => {
      image_object_url = URL.createObjectURL(image_blob);
      image_object_type = image_blob.type;
    })
    .catch((error) => {
      //printWithPrefix("image retrieval for " + content_cid + " (maybe partially) failed", _prefix);
      printErrorWithPrefix(error, _prefix);
      throw error;
    });
  //printWithPrefix("returning image_object_url as " + image_object_url, _prefix);
  return { url: image_object_url, type: image_object_type };
};
