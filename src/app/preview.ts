import { getHeaders } from './headers';
import { getURLSearchParams } from './urlSearchParams';
import { getURL } from './request';
import { toggleHiddenWithTimeout } from './utils';
import { highlight } from './hljs';
import { getFormData } from './formData';

const getPathName = (urlString: string) => {
  try {
    const url = new URL(urlString);
    return url.pathname;
  } catch (_error) {
    return urlString;
  }
}

const getHost = (urlString: string) => {
  try {
    const url = new URL(urlString);
    return url.host;
  } catch (_error) {
    return urlString;
  }
}

const stringifyHeaders = (headers:Headers) => {
  let message = '';
  for (const [key, value] of headers.entries()) {
    message += `${key}: ${value}\n`;
  }
  return message;
}

const stringifyFormData = (formData:FormData) => {
  let message = '\n--boundary\n';
  for (const [key, value] of formData.entries()) {
    message += `Content-Disposition: form-data; name="${key}"\n\n${value}\n--boundary\n`;
  }
  return message;
}


type HTTPMessageData = { 
  path: string;
  searchParams: string;
  host: string;
  headers: string;
  method: string;
  body?: string;
}

const getHTTPMessageData = (): HTTPMessageData => {
  const urlInputValue = getURL(); 
  const headers = getHeaders();
  const urlSearchParams = getURLSearchParams();
  // @ts-ignore
  const method = document.querySelector('#method-select').value;
  const HTTPMessageData =  {
    host: getHost(urlInputValue),
    path: getPathName(urlInputValue),
    headers: stringifyHeaders(headers),
    searchParams: urlSearchParams.toString(),
    method: method,
  }
  // if can have a body 
  if(method === 'POST') {
    return Object.assign({}, HTTPMessageData, { body: getBody() })
  }
  return HTTPMessageData;
}

const hasFormData = (formData: FormData) => !formData.entries().next().done;

const getBody = () => {
  const bodyInputTabs = document.querySelector('.cmp-request-body__input-area')
  const currentBodyType =  bodyInputTabs?.getAttribute('data-view') ?? 'form-data';
  if(currentBodyType === 'form-data'){
    const formData = getFormData();
    return hasFormData(formData) ? stringifyFormData(formData) : '';
  }
  return '';
}

const formatHTTPMessage = ({ path, searchParams, host, headers, method, body }:HTTPMessageData) => `${method} ${path}${searchParams ? `?${searchParams}`: ''} HTTP/1.1\nHost: ${host}\n${headers}${body ? body : ''}`;


const printPreview = () => {
  const previewCodeElement = document.querySelector('.cmp-preview pre code') as Element;
  // TODO ADD NOTE THAT THIS DOESN'T INCLUDE Headers Automatically included by the browser
  const formattedMessage = formatHTTPMessage(getHTTPMessageData());
  previewCodeElement.innerHTML = highlight(formattedMessage, 'http');
}

const copyToPreviewClipBoard =  () => {
  const copyIcons = document.querySelectorAll('.cmp-preview .cmp-copy-button  .cmp-copy-button__icon');
  const copyButton = document.querySelector('.cmp-preview .cmp-copy-button');
  copyButton?.classList.toggle('cmp-copy-button--checked');
  setTimeout(()=>{
    copyButton?.classList.toggle('cmp-copy-button--checked');
  }, 2000)
  copyIcons.forEach((icon) => toggleHiddenWithTimeout(icon));
  navigator.clipboard.writeText(formatHTTPMessage(getHTTPMessageData()))
};

const addPrintPreviewListeners = () => {
  const previewCodeElement = document.querySelector('.cmp-preview pre code') as Element;
  const defaultMessage = "GET \ HTTP/1.1\nHost: ";
  previewCodeElement.innerHTML =  highlight(defaultMessage, 'http');
  const urlInput = document.querySelector('#url-input') as HTMLInputElement;
  urlInput.addEventListener('input', printPreview); 
  const copyButton = document.querySelector('.cmp-preview .cmp-copy-button');
  copyButton?.addEventListener('click', copyToPreviewClipBoard);
};

export { addPrintPreviewListeners, printPreview };
