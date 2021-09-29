//REQUIRES <script src="https://unpkg.com/ripple-lib@1.10.0/build/ripple-latest-min.js"></script>
import ripple from "ripple-lib";
import {
  printErrorWithPrefix,
  printWithPrefix,
  isUndefinedOrNull,
  fetchWithTimeout,
} from "./utils.mjs";
import { extractAccountsFromTOML } from "./toml_handler.mjs";

var ripple_api_testnet_obj = {
  api: null,
  network: "testnet",
  watchdog_timer: null,
};
var ripple_api_mainnet_obj = {
  api: null,
  network: "mainnet",
  watchdog_timer: null,
};

export const getCorrectRippleApiObj = function (network) {
  const _prefix = "getCorrectRippleApiObj: ";
  if (network == "testnet") {
    return ripple_api_testnet_obj;
  } else if (network == "mainnet") {
    return ripple_api_mainnet_obj;
  } else {
    //printWithPrefix("error, network is " + network, _prefix);
  }
};

function getServersUrls(ripple_network) {
  if (ripple_network === "testnet") {
    return ["wss://s.altnet.rippletest.net", "wss://testnet.xrpl-labs.com"];
  } else {
    //mainnet
    return [
      "wss://xrplcluster.com",
      "wss://xrpl.ws",
      "wss://s1.ripple.com",
      "wss://s2.ripple.com",
    ];
  }
}
async function connectToServer(ripple_api_obj, server_url) {
  const _prefix = "connectToAServer: " + ripple_api_obj.network + ": ";
  //printWithPrefix("connecting to " + server_url + "...", _prefix);

  ripple_api_obj.api = new ripple.RippleAPI({
    server: server_url,
  });
  try {
    await ripple_api_obj.api.connect();
  } catch (error) {
    //printErrorWithPrefix(error, _prefix);
  }

  return ripple_api_obj.api.isConnected();
}
export const connectToAServer = async function (
  ripple_api_obj,
  ripple_network
) {
  const _prefix = "connectToAServer: " + ripple_api_obj.network + ": ";
  const server_urls = getServersUrls(ripple_network);

  var is_connected = false;
  for (let i = 0; i < server_urls.length && !is_connected; i++) {
    is_connected = await connectToServer(ripple_api_obj, server_urls[i]);
  }

  if (!is_connected) {
    throw new functions.https.HttpsError(
      "unavailable",
      "unable to connect to a rippled server"
    );
  }

  setConnectionWatchdogTimer(ripple_api_obj);
};

const timeout_time = 2 * 60 * 1000;
async function tryDisconnect(ripple_api_obj) {
  var is_connected = ripple_api_obj.api.isConnected();
  if (!is_connected) {
    return;
  }

  await ripple_api_obj.api.disconnect();
  is_connected = ripple_api_obj.api.isConnected();
  if (is_connected) {
    await tryDisconnect(ripple_api_obj);
  } else {
    ripple_api_obj.api = null;
  }
}
function setConnectionWatchdogTimer(ripple_api_obj) {
  ripple_api_obj.watchdog_timer = setTimeout(
    tryDisconnect,
    timeout_time,
    ripple_api_obj
  );
}
function kickConnectionWatchdogTimer(ripple_api_obj) {
  clearTimeout(ripple_api_obj.watchdog_timer);
  setConnectionWatchdogTimer(ripple_api_obj);
}
export const rippleApiRequest = async function (
  ripple_api_obj,
  request_name,
  request_object
) {
  const to_return = await ripple_api_obj.api.request(
    request_name,
    request_object
  );
  kickConnectionWatchdogTimer(ripple_api_obj);
  return to_return;
};
export const rippleApiGetBalances = async function (ripple_api_obj, _address) {
  const to_return = await ripple_api_obj.api.getBalances(_address);
  kickConnectionWatchdogTimer(ripple_api_obj);
  return to_return;
};
export const rippleApiGetSettings = async function (ripple_api_obj, _address) {
  const to_return = await ripple_api_obj.api.getSettings(_address);
  kickConnectionWatchdogTimer(ripple_api_obj);
  return to_return;
};

export const logConnectionStatus = function (
  _ripple_api_obj,
  _progressive_number
) {
  if (isUndefinedOrNull(_ripple_api_obj)) {
    printWithPrefix("_ripple_api_obj is null", "logConnectionStatus: ");
    return;
  }

  const _prefix =
    "logConnectionStatus: #" +
    _progressive_number +
    ": " +
    _ripple_api_obj.network +
    ": ";
  const _ripple_api = _ripple_api_obj.api;
  printWithPrefix(
    "isUndefinedOrNull(ripple_api): " + isUndefinedOrNull(_ripple_api),
    _prefix
  );

  if (isUndefinedOrNull(_ripple_api)) {
    return;
  }
  printWithPrefix(
    "!ripple_api.isConnected(): " + !_ripple_api.isConnected(),
    _prefix
  );
};

/*
export const ctiIsSimple = function(_cti){
    return (_cti >> 56n) == 0;
}
//*/
export const ctiTxIndex = function (_cti) {
  return (BigInt(_cti) >> 32n) & 0xffffn;
};
export const ctiLedgerIndex = function (_cti) {
  return BigInt(_cti) & 0xffffffffn;
};
export const ctiLedgerHash = function (_cti) {
  return (BigInt(_cti) >> 52n) & 0xfn;
};
export const ctiTxHash = function (_cti) {
  return (BigInt(_cti) >> 48n) & 0xfn;
};

export const verifyAccountDomain = async function (
  _domain,
  _address,
  _network
) {
  const _prefix = "verifyAccountDomain(): ";
  if (isUndefinedOrNull(_domain) || _domain.length == 0) {
    return false;
  }

  //connect to https://{DOMAIN}/.well-known/xrp-ledger.toml
  const toml_file_url = "https://" + _domain + "/.well-known/xrp-ledger.toml";
  //const toml_file_url = "http://" + _domain + "/.well-known/xrp-ledger.toml";
  var is_verified = false;

  //printWithPrefix("fetching " + toml_file_url + "...", _prefix);
  await fetchWithTimeout(toml_file_url, { timeout: 4 * 1000 })
    .then((response) => {
      if (!response.ok) {
        //printWithPrefix("fetch response is not ok", _prefix);
        throw new Error("fetch response is not ok");
      }

      return response.text();
    })
    .then((response_text) => {
      //console.log("response_text: ", response_text);
      const extracted_accounts = extractAccountsFromTOML(response_text);
      if (
        isUndefinedOrNull(extracted_accounts) ||
        extracted_accounts.length == 0
      ) {
        return;
      }

      for (let i = 0; i < extracted_accounts.length; i++) {
        if (extracted_accounts[i].address == _address) {
          if (!isUndefinedOrNull(extracted_accounts[i].network)) {
            //if the network attribute is defined
            let extracted_account_address = extracted_accounts[i].network;
            if (
              (_network == "mainnet" && extracted_account_address == "main") ||
              (_network == "testnet" && extracted_account_address == "testnet")
            ) {
              //if the network is the same we are using
              is_verified = true;
              return;
            }
            //if the network is different
            continue; //then it's not verified
          }

          //If omitted, clients SHOULD assume that the account is claimed on the production XRP Ledger
          //and possibly other network chains.
          is_verified = true;
          return;
        }
      }
    })
    .catch((error) => {
      //printErrorWithPrefix(error, _prefix);
      //throw error;
    });

  return is_verified;
};
