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
  const urlInput = document.querySelector('#url-input') as HTMLInputElement;
  const requestURL = urlInput?.value ?? '';
  if(isValidURL(requestURL)){
    const userRequest = new Request(requestURL, defaultRequestOptions);
    fetch(userRequest).then(()=> console.log('sent'));
    return;
  }
  console.log('invalid url');
}

export { sendRequest };
