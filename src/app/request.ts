import { getHeaders } from "./headers";
import { handleResponse } from "./response";
import { getURLSearchParams } from "./urlSearchParams";

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

const sendRequest = () => {
  const  { value } = document.querySelector('#url-input') as HTMLInputElement;
  const proxyURL = 'http://localhost:3000';
  
  // TO DO BUILD REQUEST AND VALIDATE WHILE USER IS TYPING IT IN 
  if(!isValidURL(value)){
    // TODO: Visual Error State
    console.log('invalid url');
    return;
  }
  const requestURL = `${proxyURL}/?url=${encodeURIComponent(value)}?${getURLSearchParams()}`;
  const requestHeaders = getHeaders();
  const requestOptions = Object.assign({}, defaultRequestOptions, { headers: requestHeaders})
  const userRequest = new Request(requestURL, requestOptions);
  fetch(userRequest).then((response)=> handleResponse(response));

}

export { sendRequest };
