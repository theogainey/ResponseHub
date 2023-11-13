import hljs from 'highlight.js/lib/core';
import xml from 'highlight.js/lib/languages/xml';
import javascript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';

hljs.registerLanguage('xml', xml);
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('json', json);

// TODO BETTER HANDLE APP STATE POSSIBLY MAKE THE RESPONSE AREA A WEB COMPONENT
const RESPONSE_STATE = {
  body: '',
  language: '',
};

const reHighlightCode = (language: string) => {
  const responseTextElement = document.querySelector('.cmp-response__text') as Element;
    responseTextElement.innerHTML =  hljs.highlight(
      RESPONSE_STATE.body,
      { language: language }
    ).value;
  setResponseLanguage(language);
}

const isJSONResponse = (response: Response) => {
  const contentType = response.headers.get('content-type') ?? ''; 
  return contentType.includes('application/json');
}

const setResponseLanguage = (language:string) => {
  const jsonButton = document.querySelector('#json-button') as Element;
  const jsonButtonInput = document.querySelector('#json-button input') as Element
  const xmlButton = document.querySelector('#xml-button') as Element;
  const xmlButtonInput = document.querySelector('#xml-button input') as Element

  switch (language) {
    case 'json':
      jsonButtonInput.setAttribute('checked', "");
      jsonButton.classList.add('cmp-response__languages-button--active');
      xmlButton.classList.remove('cmp-response__languages-button--active');
      RESPONSE_STATE.language = 'json';
      break;
    case 'xml':
      xmlButtonInput.setAttribute('checked', "");
      xmlButton.classList.add('cmp-response__languages-button--active');
      jsonButton.classList.remove('cmp-response__languages-button--active');
      RESPONSE_STATE.language = 'xml';
      break;
    default:
      xmlButtonInput.setAttribute('checked', "");
      xmlButton.classList.add('cmp-response__languages-button--active');
      jsonButton.classList.remove('cmp-response__languages-button--active');
      RESPONSE_STATE.language = 'xml';
      break;
  }
};

const printResponse = (data:string) => {
  const responseTextElement = document.querySelector('.cmp-response__text') as Element;
  const highlightedCode = hljs.highlightAuto(data);
  responseTextElement.innerHTML = highlightedCode.value;
  setResponseLanguage(highlightedCode.language ?? 'xml');
}

const handleResponse = async (response: Response) => {
  if (isJSONResponse(response)) {
    const data = JSON.stringify(await response.json());
    RESPONSE_STATE.body = data;
    printResponse(data);
  } else {
    const data = await response.text();
    RESPONSE_STATE.body = data;
    printResponse(data);
  }  
}

export { handleResponse, setResponseLanguage, reHighlightCode };
