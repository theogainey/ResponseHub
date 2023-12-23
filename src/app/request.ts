import { handleRequestError } from "./errors";
import { getFormData } from "./formData";
import { getHeaders } from "./headers";
import { handleResponse } from "./response";
import { getURLSearchParams } from "./urlSearchParams";
import { toggleHidden } from "./utils";

const defaultRequestOptions = {
  method: "GET",
};

const isValidURL = (url:string) =>{
  try {
    new URL(url);
    return true;
  } catch (_error) {
    return false;
  }
}

const getURL = () => {
  const { value } = document.querySelector('#url-input') as HTMLInputElement;
  return value;
}
const printResponseTime = (time: number) => {
  const timeElement = document.querySelector('.cmp-response-details__time') as Element;
  timeElement.innerHTML = `${time}ms`
};


const sendRequest = () => {
  const value  = getURL();
  // TO DO BUILD REQUEST AND VALIDATE WHILE USER IS TYPING IT IN 
  if(!isValidURL(value)){
    // TODO: Visual Error State
    console.log('invalid url');
    return;
  }
  const sendButton = document.querySelector('#send-button div') as Element;
  toggleHidden(sendButton);
  const requestURL = `${value}?${getURLSearchParams()}`;
    // @ts-ignore
  const requestMethod = document.querySelector('#method-select').value;
  const requestHeaders = getHeaders();
  const formData = getFormData();
  const requestOptions = requestMethod === 'POST' 
    ? Object.assign({}, defaultRequestOptions, { headers: requestHeaders, method: requestMethod, body: formData })
    : Object.assign({}, defaultRequestOptions, { headers: requestHeaders, method: requestMethod});
  const userRequest = new Request(requestURL, requestOptions);
  const startTime = Date.now();
  fetch(userRequest)
  .then((response)=> {
    const endTime = Date.now();
    printResponseTime(endTime - startTime);
    return response;
  })
  .then((response)=> handleResponse(response))
  .catch((_err)=>{
    handleRequestError();
  })
}

export { sendRequest, getURL };
