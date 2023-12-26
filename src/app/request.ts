import { getRawBody, getSelectedBodyDataType } from "./body";
import { handleRequestError } from "./errors";
import { getFormData } from "./formData";
import { getFormURLEncodedData } from "./formURLEncoded";
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


const getRequestBody = (bodyType: string) => {
  switch (bodyType) {
    case 'form-data':
      const formData = getFormData();
      return { body: formData}  
    case 'x-www-form-urlencoded':
      const formURLEncodedData = getFormURLEncodedData();
      return { body: formURLEncodedData};
    case 'raw':
      return { body: getRawBody() };
    default:
      return {}
  }
}

const getPUTRequest = (url: string) => {
  const requestHeaders = getHeaders();
  const currentBodyType = getSelectedBodyDataType();
  if(currentBodyType === 'x-www-form-urlencoded'){
    requestHeaders.append('Content-Type', 'application/x-www-form-urlencoded');
  }
  return new Request(url, Object.assign({}, defaultRequestOptions, { headers: requestHeaders, method: 'PUT'}, getRequestBody(currentBodyType)));
}


const getPOSTRequest = (url: string) => {
  const requestHeaders = getHeaders();
  const currentBodyType = getSelectedBodyDataType();
  if(currentBodyType === 'x-www-form-urlencoded'){
    requestHeaders.append('Content-Type', 'application/x-www-form-urlencoded');
  }
  return new Request(url, Object.assign({}, defaultRequestOptions, { headers: requestHeaders, method: 'POST'}, getRequestBody(currentBodyType)));
}

const getGETRequest = (url: string) => {
  const requestHeaders = getHeaders();
  return new Request(url, Object.assign({}, defaultRequestOptions, { headers: requestHeaders, method: 'GET'}))
}

const getRequest = (url: string) => {
  const requestURL = `${url}?${getURLSearchParams()}`;
  // @ts-ignore
  const requestMethod = document.querySelector('#method-select').value;
  switch (requestMethod) {
    case 'GET':
      return getGETRequest(requestURL);
    case 'POST':
      return getPOSTRequest(requestURL);
    case 'PUT':
      return getPUTRequest(requestURL);
    default:
      return new Request(requestURL);
  }
};

const sendRequest = () => {
  const url  = getURL();
  // TO DO BUILD REQUEST AND VALIDATE WHILE USER IS TYPING IT IN 
  if(!isValidURL(url)){
    // TODO: Visual Error State
    console.log('invalid url');
    return;
  }
  const sendButton = document.querySelector('#send-button div') as Element;
  toggleHidden(sendButton);
  const userRequest = getRequest(url);
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
