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
export { getURLSearchParams };
