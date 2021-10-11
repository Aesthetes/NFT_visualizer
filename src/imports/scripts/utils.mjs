// import BigInt from "big-integer";

/* global BigInt */

export const getRadioButtonValue = function (_radio_buttons_name) {
  const _radio_buttons = document.getElementsByName(_radio_buttons_name);
  for (let i = 0; i < _radio_buttons.length; i++) {
    if (_radio_buttons[i].checked === true) {
      return _radio_buttons[i].value;
    }
  }
  return null;
};

export const getTextInputValue = function (_text_input_id) {
  const _text_input = document.getElementById(_text_input_id);
  return _text_input.value;
};

export const setInnerHTML = function (_element_id, HTML_to_insert) {
  const _element = document.getElementById(_element_id);
  _element.innerHTML = HTML_to_insert;
};

export const showImageSrc = function (_element_id, _src_url) {
  const nft_image = document.getElementById(_element_id);
  nft_image.src = _src_url;
  nft_image.hidden = false;
};

export const hideImage = function (_element_id) {
  const nft_image = document.getElementById(_element_id);
  nft_image.src = "";
  nft_image.hidden = true;
};

export const getLinkHTML = function (_url) {
  return '<a href="' + _url + '">' + _url + "</a>";
};

export const attachEvent = function (
  _element_id,
  _event,
  _event_handling_function
) {
  const visualize_button = document.getElementById(_element_id);
  visualize_button.addEventListener(_event, _event_handling_function);
};

export const printWithPrefix = function (to_print, _prefix) {
  // console.log(_prefix + to_print);
};

export const printErrorWithPrefix = function (error, _prefix) {
  if (error.code) {
    printWithPrefix("error.code: " + error.code, _prefix);
  }
  if (error.message) {
    printWithPrefix("error.message: " + error.message, _prefix);
  }
  if (error.data) {
    console.log(_prefix + "error.data: ", error.data);
  }
};

export const isUndefinedOrNull = function (_value) {
  return _value === undefined || _value === null;
};

export const bytesToHex = function (_bytes) {
  return Array.from(_bytes, (byte) => byte.toString(16).padStart(2, "0")).join(
    ""
  );
};
export const stringToUTF8Bytes = function (_string) {
  return new TextEncoder().encode(_string);
};

export const hexToAscii = function (hex_str) {
  var str = "";
  for (let i = 0; i < hex_str.length; i += 2) {
    str += String.fromCharCode(parseInt(hex_str.substr(i, 2), 16));
  }
  return str;
};
export const hexToInt = function (hex_str) {
  return parseInt(hex_str, 16);
};
export const hexToBigInt = function (hex_str) {
  return BigInt("0x" + hex_str);
};
export const intToHexString = function (int_to_convert) {
  return int_to_convert.toString(16).toUpperCase();
};
export const stringToHexString = function (string_to_convert) {
  return bytesToHex(stringToUTF8Bytes(string_to_convert)).toUpperCase();
};

export const getFirst4BitsFromHexString = function (hex_str) {
  const first_4_bits = hex_str.substring(0, 1);
  return hexToInt(first_4_bits);
};

export const convertToHttp = function (url_to_convert) {
  if (isUndefinedOrNull(url_to_convert)) {
    return null;
  }
  const splitted_url = url_to_convert.split("://");
  if (splitted_url.length < 2) {
    // not a string starting with a protocol
    return null;
  }
  const protocol = splitted_url[0];
  if (protocol === "http" || protocol === "https") {
    //if the protocol is already http or https then it's okay
    return url_to_convert;
  }
  if (protocol === "ipfs") {
    //if the protocol is ipfs then it has to be redirected through a gateway
    const ipfs_gateway_url = "https://ipfs.io/ipfs/";
    return ipfs_gateway_url + splitted_url[1];
  }

  return null;
};
export const isValidHttpUrl = function (string) {
  var url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";
};

export const fetchWithTimeout = async function (resource, options = {}) {
  const { timeout = 8000 } = options;

  const controller = new AbortController();
  const id = setTimeout(() => {
    //console.log("fetch of the resource " + resource + " aborted");
    controller.abort();
  }, timeout);

  const response = await fetch(resource, {
    ...options,
    signal: controller.signal,
    //mode: "no-cors"
  })
    .then((_response) => {
      clearTimeout(id);
      return _response;
    })
    .catch((error) => {
      clearTimeout(id);
      throw error;
    });

  return response;
};

export const extractCIDFromHashUrl = function (_domain) {
  if (!_domain.startsWith("hash:")) {
    return null;
  }
  const _domain_splitted = _domain.split(":");
  if (_domain_splitted.length !== 2) {
    return null;
  }
  return _domain_splitted[1];
};
