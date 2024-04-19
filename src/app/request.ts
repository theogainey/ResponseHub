import { getAuthForHistory } from "./auth";
import { getRawBody, getSelectedBodyDataType, requestCanHaveBody } from "./body";
import { handleRequestError } from "./errors";
import { getFormData } from "./formData";
import { getFormURLEncodedData } from "./formURLEncoded";
import { getHeadersForHistory, getActiveHeaders } from "./headers";
import { addRequestToHistory } from "./requestHistory";
import { handleResponse } from "./response";
import { getURL } from "./url";
import { getURLSearchParamsForHistory, getActiveURLSearchParams } from "./urlSearchParams";
import { selectElement, toggleHidden } from "./utils";

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

const printResponseTime = (time: number) => {
  const timeElement = selectElement('.cmp-response-details__time');
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

const getRequestWithBody = (url: string, method: string) => {
  const requestHeaders = getActiveHeaders();
  const currentBodyType = getSelectedBodyDataType();
  if(currentBodyType === 'x-www-form-urlencoded'){
    requestHeaders.append('Content-Type', 'application/x-www-form-urlencoded');
  }
  return new Request(url, Object.assign({}, defaultRequestOptions, { headers: requestHeaders, method: method}, getRequestBody(currentBodyType)));
}

const getRequestWithoutBody = (url: string, method: string) => {
  const requestHeaders = getActiveHeaders();
  return new Request(url, Object.assign({}, defaultRequestOptions, { headers: requestHeaders, method: method}))
}

const getRequest = (url: string, method: string) => {
  const requestURL = `${url}?${getActiveURLSearchParams(true)}`;
  return requestCanHaveBody(method) ? getRequestWithBody(requestURL, method) :  getRequestWithoutBody(requestURL, method);
};

const sendRequest = () => {
  // @ts-ignore
  const requestMethod = document.querySelector('#method-select').value;
  const url  = getURL();
  // TO DO BUILD REQUEST AND VALIDATE WHILE USER IS TYPING IT IN 
  if(!isValidURL(url)){
    // TODO: Visual Error State
    console.log('invalid url');
    return;
  }
  const sendButton = selectElement('#send-button div');
  toggleHidden(sendButton);
  const userRequest = getRequest(url, requestMethod);
  const startTime = Date.now();
  fetch(userRequest)
  .then((response)=> {
    const endTime = Date.now();
    printResponseTime(endTime - startTime);
    return response;
  })
  .then((response)=> {
    handleResponse(response);
    addRequestToHistory({url: url, method: requestMethod, headers: getHeadersForHistory(), urlSearchParams: getURLSearchParamsForHistory(), auth: getAuthForHistory() ,timeStamp: Date.now()});
  })
  .catch((_err)=>{
    handleRequestError();
  })
}

export { sendRequest, getURL };
