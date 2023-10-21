import { handleResponse } from "./response";

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
  
  if(isValidURL(value)){
    const requestURL = `${proxyURL}/?url=${encodeURIComponent(value)}`;
    const userRequest = new Request(requestURL, defaultRequestOptions);
    fetch(userRequest).then((response)=> handleResponse(response));
    return;
  }
  console.log('invalid url');
}

export { sendRequest };
