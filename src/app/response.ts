const isJSONResponse = (response: Response) => {
  const contentType = response.headers.get('content-type') ?? ''; 
  return contentType.includes('application/json');
}

const printResponse = (data:string) => {
  const responseArea = document.getElementById('response-area') as HTMLDivElement;
  responseArea.innerText = data;
}

const handleResponse = async (response: Response) => {
  if (isJSONResponse(response)) {
    const data = JSON.stringify(await response.json());
    printResponse(data);
  } else {
    // TODO think about how you should handle none JSON data
    printResponse( await response.text());
  }  
}

export { handleResponse };
