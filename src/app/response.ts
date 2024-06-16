import { toggleHiddenWithTimeout, toggleHidden, selectInputElement, selectElement } from './utils';
import prettier from "prettier/standalone";
import htmlParser from "prettier/plugins/html";
import { getLanguage, highLightWithLineNumbers, highlight } from './hljs';
import { EditorView, responseSetup, html, json } from './codemirror';


const RESPONSE_STATE = {
  body: '',
  language: '',
};

const reHighlightCode = (language: string) => {
  formatCode(RESPONSE_STATE.body).then((code) => {
    const responseTextElement = selectElement('.cmp-response__text');
    responseTextElement.innerHTML =  highLightWithLineNumbers(code, language );
  // setResponseLanguage(language);
  });
}

const isJSONResponse = (response: Response) => {
  const contentType = response.headers.get('content-type') ?? ''; 
  return contentType.includes('application/json');
}

const setResponseLanguage = (language:string) => {
  const jsonButton = selectElement('#json-button');
  const jsonButtonInput = selectElement('#json-button input');
  const xmlButton = selectElement('#xml-button');
  const xmlButtonInput = selectElement('#xml-button input');

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

const copyToResponseToClipBoard = (data: string) => () => {
  const copyIcons = document.querySelectorAll('.cmp-response .cmp-copy-button .cmp-copy-button__icon');
  const copyButton = document.querySelector('.cmp-response .cmp-copy-button');
  copyButton?.classList.toggle('cmp-copy-button--checked');
  setTimeout(()=>{
    copyButton?.classList.toggle('cmp-copy-button--checked');
  }, 2000)
  copyIcons.forEach((e) => toggleHiddenWithTimeout(e));
  navigator.clipboard.writeText(data)
};

const setBodyTabActive = () => {
  const bodyTab = selectInputElement('#response-body-tab');
  bodyTab.checked = true;
  bodyTab.dispatchEvent(new Event('change'));
}

const showResponseFormattingButtons = (data:string) => {
  const copyButton = document.querySelector('.cmp-response .cmp-copy-button');
  // const responseLanguageDiv = document.querySelector('.cmp-response__languages');
  const responseDetailsDiv = document.querySelector('.cmp-response-details');
  [copyButton, responseDetailsDiv].forEach((e) => {
    e?.classList.remove('util-visually-hidden');
  });
  setBodyTabActive();
  copyButton?.addEventListener('click', copyToResponseToClipBoard(data));
}

const getStatusCodeClass =  (status: number) => { 
  switch (true) {
    // informational response color TBD
    case status < 200:
      return 'util-color-';
    case status < 300:
      return 'util-color-green';
    // redirect color TBD
    case status < 400:
      return 'util-color-'
    case status < 600:
      return 'util-color-red'  
    default:
      return 'util-color-red';
  }
}


const printStatusCode = (status: number) => {
  const statusCodeElement = selectElement('.cmp-response-details__status-code');
  statusCodeElement.innerHTML = `status ${status}`
  statusCodeElement.setAttribute('class', `cmp-response-details__status-code ${getStatusCodeClass(status)}`);
};

const formatHTML = (html: string) => prettier.format(html, { parser: "html", plugins: [htmlParser],});

const formatJSON = (json: string) => {
  const parsedJSON = JSON.parse(json);
  return JSON.stringify(parsedJSON, null, 2);
}

const formatCode = async (code: string) => {
  const language = getLanguage(code);
  if(language !== 'xml') {
    return formatJSON(code);
  }
  return formatHTML(code);
}

const printResponse = async (data:string) => {
  clearResponse();
  const responseTextElement = selectElement('.cmp-response__text');
  const formattedCode = await formatCode(data);
  const language = getLanguage(formattedCode)
  const languageExtension = language === 'json' ? json() : html();
  const view = new EditorView({
    doc: formattedCode,
    extensions: [responseSetup, languageExtension],
    parent: responseTextElement,
  });
  
  showResponseFormattingButtons(data);  
}

const printHeaders = (response: Response) => {
  const responseHeadersElement = selectElement('.cmp-response__headers pre code');
  let headers = '' 
  // @ts-expect-error
  for (const pair of response.headers.entries()) {
    headers += `${pair[0]}: ${pair[1]}\n`
  }
  const highlightedCode = highlight(headers);
  responseHeadersElement.innerHTML = highlightedCode;
}

const setBodyView = () => {
  const responseLayoutDiv = selectElement('.cmp-response');
  responseLayoutDiv?.setAttribute('data-view', 'body');
}

const handleResponse = async (response: Response) => {
  const sendButton = selectElement('#send-button div');
  toggleHidden(sendButton);
  setBodyView();
  printStatusCode(response.status);
  printHeaders(response);
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

const clearResponse = () => {
  const responseArea = selectElement('.cmp-response__text');
  responseArea.innerHTML = '';
}

export { handleResponse, reHighlightCode, clearResponse };
