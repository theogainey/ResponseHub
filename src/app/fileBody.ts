import { selectInputElement } from "./utils";

// TODO: FILE BODY NEEDS WORK. 
// - MULTIPLE FILES?
// - MAYBE MORE
// - MAYBE INCLUDE FILE ON FORM DATA TAB

const getFileBody = () =>{
  const fileBody = new FormData();
  const fileInput = selectInputElement('.cmp-request-body__file-input');
  const files = fileInput.files as FileList
  fileBody.append('file', files[0]);
  return fileBody;
};

export { getFileBody };
