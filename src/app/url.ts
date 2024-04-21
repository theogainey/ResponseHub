import { requestCanHaveBody } from "./body";
import { printPreview } from "./preview";
import { addTabbable, removeTabbable } from "./tabIndex";
import { handleDirectURLSearchParams } from "./urlSearchParams";
import { selectInputElement, selectElement } from "./utils";

const isTabSelectedHidden = (HTTPMethod: string) => {
  const requestOptionsLayoutDiv = selectElement('.obj-options-layout');
  const currentSelected = requestOptionsLayoutDiv?.getAttribute('data-view');
  return currentSelected === 'body' && !requestCanHaveBody(HTTPMethod);
}

const selectDefaultTab = () => {
  const previewTab = selectInputElement('#preview-tab input');
  previewTab.checked = true;
  previewTab.dispatchEvent(new Event('change'));
};

const setURL = (url: string) => {
  const URLInput = selectInputElement('#url-input');
  URLInput.value = url;
}

const getURL = () => {
  const { value } = selectInputElement('#url-input');
  return value;
}

const setMethod = (method: string) => {
  const MethodInput = selectInputElement('#method-select');
  MethodInput.value = method;
  const classes = MethodInput.classList.values();
  for (const value of classes) {
    if( value !== 'cmp-url-input__method'){
      MethodInput.classList.remove(value);
    } 
  }
  switch (MethodInput.value.toUpperCase()) {
    case 'GET':
      MethodInput.classList.add('cmp-url-input__method--GET');
      break;
    case 'POST':
      MethodInput.classList.add('cmp-url-input__method--POST');
      break;
    case 'PUT':
      MethodInput.classList.add('cmp-url-input__method--PUT');
      break;
    case 'PATCH':
      MethodInput.classList.add('cmp-url-input__method--PATCH');
      break;
    case 'OPTIONS':
      MethodInput.classList.add('cmp-url-input__method--OPTIONS');
      break;
    case 'DELETE':
      MethodInput.classList.add('cmp-url-input__method--DELETE');
      break;
    case 'HEAD':
      MethodInput.classList.add('cmp-url-input__method--HEAD');
      break;
  }
}

const isValidURL = (url:string) => url.startsWith('http://') || url.startsWith('https://');

const handleURLInputValidation = ()=>{
  const URLInput = selectInputElement('#url-input');
  const errorMessageSpan = selectElement('.cmp-url-input__error-message');
  if(!isValidURL(URLInput.value) && URLInput.value !== ''){
    errorMessageSpan.classList.remove('util-display-none');
    return
  }
  errorMessageSpan.classList.add('util-display-none');
}


const addURLListeners = () => {
  const URLInput = selectInputElement('#url-input');
  const methodSelect = document.querySelector('.cmp-url-input__method') as HTMLSelectElement;
  const previewElement = selectElement('.cmp-preview');
  const optionsTabs = document.querySelector('.cmp-options-tabs');
  const bodyTabs = document.querySelector('.cmp-request-body__tabs');
  methodSelect.addEventListener('change', () => {
    optionsTabs?.setAttribute('data-method', methodSelect.value);
    bodyTabs?.setAttribute('data-method', methodSelect.value);
    const bodyOptionTabInput = selectElement('.cmp-options-tabs__tab input[value="body"]');
    requestCanHaveBody(methodSelect.value) ? addTabbable(bodyOptionTabInput) : removeTabbable(bodyOptionTabInput); 
    if(isTabSelectedHidden(methodSelect.value)){
      selectDefaultTab();
    }  
  });
  methodSelect.addEventListener('change', printPreview);
  methodSelect.addEventListener('change', () => {
    previewElement.classList.remove('cmp-preview--GET', 'cmp-preview--POST', 'cmp-preview--PUT', 'cmp-preview--PATCH', 'cmp-preview--DELETE', 'cmp-preview--HEAD', 'cmp-preview--OPTIONS');
    previewElement.classList.add(`cmp-preview--${methodSelect.value}`);
    methodSelect.classList.remove('cmp-url-input__method--GET', 'cmp-url-input__method--POST', 'cmp-url-input__method--PUT', 'cmp-url-input__method--PATCH', 'cmp-url-input__method--DELETE', 'cmp-url-input__method--HEAD', 'cmp-url-input__method--OPTIONS');
    methodSelect.classList.add(`cmp-url-input__method--${methodSelect.value}`)
  });
  URLInput.addEventListener('input', handleURLInputValidation);
  URLInput.addEventListener('input', handleDirectURLSearchParams);
}

export { addURLListeners, setURL, getURL, setMethod, handleURLInputValidation };
