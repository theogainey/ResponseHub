import { getHeaders } from './headers';
import { getURLSearchParams } from './urlSearchParams';
import { getURL } from './request';
import { toggleHidden } from './utils';
import hljs from 'highlight.js/lib/core';
import http from 'highlight.js/lib/languages/http';
hljs.registerLanguage('http', http);

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

const getHTTPMessageData = () => {
  const urlInputValue = getURL(); 
  const headers = getHeaders();
  const urlSearchParams = getURLSearchParams();

  return {
    host: getHost(urlInputValue),
    path: getPathName(urlInputValue),
    headers: stringifyHeaders(headers),
    searchParams: urlSearchParams.toString(),
  }
}

const formatHTTPMessage = (HTTPMessageData: { path: string; searchParams: string; host: string; headers: string; }) => `GET ${HTTPMessageData.path}${HTTPMessageData.searchParams ? `?${HTTPMessageData.searchParams}`: ''} HTTP/1.1\nHost: ${HTTPMessageData.host}\n${HTTPMessageData.headers}`;


const printPreview = () => {
  const previewCodeElement = document.querySelector('.cmp-preview pre code') as Element;
  // TODO ADD NOTE THAT THIS DOESN'T INCLUDE Headers Automatically included by the browser
  const formattedMessage = formatHTTPMessage(getHTTPMessageData());
  previewCodeElement.innerHTML =  hljs.highlight(
    formattedMessage,
    { language: 'http' }
  ).value;
}

const copyToPreviewClipBoard =  () => {
  const copyIcons = document.querySelectorAll('.cmp-preview .cmp-copy-button  .cmp-copy-button__icon');
  const copyButton = document.querySelector('.cmp-preview .cmp-copy-button');
  copyButton?.classList.toggle('cmp-copy-button--green');
  setTimeout(()=>{
    copyButton?.classList.toggle('cmp-copy-button--green');
  }, 2000)

  copyIcons.forEach(toggleHidden);
  navigator.clipboard.writeText(formatHTTPMessage(getHTTPMessageData()))
};

const addPrintPreviewListeners = () => {
  const previewCodeElement = document.querySelector('.cmp-preview pre code') as Element;
  const defaultMessage = "GET \ HTTP/1.1\nHost: ";
  previewCodeElement.innerHTML =  hljs.highlight(
    defaultMessage,
    { language: 'http' }
  ).value;
  const urlInput = document.querySelector('#url-input') as HTMLInputElement;
  urlInput.addEventListener('input', printPreview); 
  const copyButton = document.querySelector('.cmp-preview .cmp-copy-button');
  copyButton?.addEventListener('click', copyToPreviewClipBoard);
};

export { addPrintPreviewListeners, printPreview };
