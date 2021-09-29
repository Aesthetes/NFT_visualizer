import { printErrorWithPrefix, printWithPrefix, isUndefinedOrNull
} from "./utils.mjs";

function extractObjectsFromTOML(field_name, toml_text){
  //TODO check metadata for expiration
  if(isUndefinedOrNull(toml_text)){
    return null;
  }
  
  var matching_object = false;
  var extracted_objects = [];
  var extracting_object = null;
  
  const array_of_lines = toml_text.match(/[^\r\n]+/g);
  for(let i = 0; i < array_of_lines.length; i++){
    let actual_line = array_of_lines[i];
    
    let _obj_name_regex = /^\[+(?<objName>\w+)\]+$/g;
    let matches = _obj_name_regex.exec(actual_line);
    if(matches != null && matches.length == 2){ //if the line defines an object name
      matching_object = (matches[1] == field_name);
      
      if(extracting_object != null){ //if an object was being extracted
        extracted_objects.push(extracting_object);
        extracting_object = null;
      }
      
      continue;
    }
    
    if(matching_object){ //if you are reading the fields of an object
      if(extracting_object == null){ //if the object is not already being extracted
        extracting_object = {}; //create the new object
      }
      
      let _obj_field_regex = /^(?<fieldName>[^#"=]+) = (?<fieldContent>[^#"=]+|\"[^#"=]+\")$/g;
      matches = _obj_field_regex.exec(actual_line);
      if(matches != null && matches.length == 3){ //if the line defines an object name
        extracting_object[matches[1]] = matches[2].replaceAll("\"", "");
      }
    }
  }
  
  if(extracting_object != null){ //if an object was being extracted
    extracted_objects.push(extracting_object);
    extracting_object = null;
  }
  
  return extracted_objects;
}

export const extractAccountsFromTOML = function(toml_text){
  return extractObjectsFromTOML("ACCOUNTS", toml_text);
}
