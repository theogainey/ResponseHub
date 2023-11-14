import { printPreview } from "./preview";

const getURLSearchParamKey = (component:Element): string => {
  const  { value } = component.querySelector('.cmp-url-search-params__input--key') as HTMLInputElement;
  return value ?? ''
}  

const getURLSearchParamValue = (component:Element): string => {
  const  { value } = component.querySelector('.cmp-url-search-params__input--value') as HTMLInputElement;
  return value ?? ''
}  

const getURLSearchParamKeyValuePair = (component:Element):[string, string] => [getURLSearchParamKey(component), getURLSearchParamValue(component)]; 

const isValidURLSearchParam = ([key, _value]: [string, string]) =>  !!key;


const getURLSearchParams = (): URLSearchParams => {
  const urlSearchParamsInputs = document.querySelectorAll('.cmp-url-search-params__params-pair');
  const urlSearchParamsPairs = [];
  for (const value of urlSearchParamsInputs.values()) {
    urlSearchParamsPairs.push(getURLSearchParamKeyValuePair(value));
  }
  return new URLSearchParams(urlSearchParamsPairs.filter(isValidURLSearchParam));
}

const addURLSearchParamsListeners = () =>{
  const URLSearchParamsKeyInput = document.querySelector('.cmp-url-search-params__input--key');
  const URLSearchParamsValueInput = document.querySelector('.cmp-url-search-params__input--value');
  URLSearchParamsKeyInput?.addEventListener('input', printPreview); 
  URLSearchParamsValueInput?.addEventListener('input', printPreview); 
}

export { getURLSearchParams, addURLSearchParamsListeners };
