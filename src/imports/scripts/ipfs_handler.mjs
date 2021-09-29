//REQUIRES <script src="https://cdn.jsdelivr.net/npm/ipfs/dist/index.min.js"></script>

import { printErrorWithPrefix, printWithPrefix, isUndefinedOrNull, fetchWithTimeout
} from "./utils.mjs";

const ipfs_gateways = [
  "https://gateway.pinata.cloud/ipfs/",
  "https://ipfs.infura.io/ipfs/",
  "https://ipfs.io/ipfs/"
];
const ipfs_fetch_timeout = 4 * 1000;

const IPFSFetchRecursive = async function(file_path, gateway_index){
  if(gateway_index >= ipfs_gateways.length){
    return null;
  }
  
  const _prefix = "IPFSFetchRecursive(): #" + gateway_index + ": ";
  const _url = ipfs_gateways[gateway_index] + file_path;  
  var response = null;
  
  //printWithPrefix("fetching from " + ipfs_gateways[gateway_index] + "...", _prefix);
  await fetchWithTimeout(_url, { timeout: ipfs_fetch_timeout })
  .then((_response) => {
    if(!_response.ok){
      //printWithPrefix("fetch response is not ok", _prefix);
      throw new Error("fetch response is not ok");
    }
    
    //printWithPrefix("fetch of " + _url + " resolved", _prefix);
    //console.log("_response: ", _response);
    response = _response;
  })
  .catch((error) => {
    //printErrorWithPrefix(error, _prefix);
    response = IPFSFetchRecursive(file_path, gateway_index + 1);
  });
  
  //console.log(_prefix + "returning response: ", response);
  return response;
}
export const IPFSFetch = async function(file_path){
  return IPFSFetchRecursive(file_path, 0);
}
