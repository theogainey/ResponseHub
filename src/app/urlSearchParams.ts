import { getAPIKeyAuthLocation, getAPIKeyAuthKeyValuePair, getSelectedAuthType, hasAuth } from "./auth";
import { printPreview } from "./preview";
import { getURL, setURL } from "./url";
import { selectElement, selectInputElementFromComponent } from "./utils";

const getURLSearchParamKey = (component:Element): string => {
  const  { value } = selectInputElementFromComponent(component, '.cmp-url-search-params__input--key');
  return value ?? ''
}  

const getURLSearchParamValue = (component:Element): string => {
  const  { value } = selectInputElementFromComponent(component, '.cmp-url-search-params__input--value');
  return value ?? ''
}  

const getURLSearchParamKeyValuePair = (component:Element):[string, string] => [getURLSearchParamKey(component), getURLSearchParamValue(component)]; 

const getURLSearchParamKeyValuePairWithActive  = (component:Element):[string, string, string] => [getURLSearchParamKey(component), getURLSearchParamValue(component), isActiveURLSearchParam(component).toString()]; 

const isValidURLSearchParam = ([key, _value]: string[]) =>  !!key;

const isActiveURLSearchParam = (component:Element): boolean => !!selectInputElementFromComponent(component, 'input[type=checkbox').checked;

const getURLSearchParamsForHistory = (): [string, string, string][] => {
  const urlSearchParamsInputs = document.querySelectorAll('.cmp-url-search-params__params-pair');
  const urlSearchParamsPairs = [];
  for (const value of urlSearchParamsInputs.values()) {
    urlSearchParamsPairs.push(getURLSearchParamKeyValuePairWithActive(value));
  }
  return urlSearchParamsPairs.filter(isValidURLSearchParam);
}

const getActiveURLSearchParams = ( includeAuth = false): URLSearchParams => {
  const urlSearchParamsInputs = document.querySelectorAll('.cmp-url-search-params__params-pair');
  const urlSearchParamsPairs = [];
  for (const value of urlSearchParamsInputs.values()) {
    if(!isActiveURLSearchParam(value)){
      continue;
    }
    urlSearchParamsPairs.push(getURLSearchParamKeyValuePair(value));
  }
  if(includeAuth && hasAuth() && getSelectedAuthType() ==='api-key' && getAPIKeyAuthLocation() === 'params'){
    urlSearchParamsPairs.push(getAPIKeyAuthKeyValuePair());
  }

  return new URLSearchParams(urlSearchParamsPairs.filter(isValidURLSearchParam));
}

const handleURLSearchParamInputCheckbox = (parentDiv: Element) => () =>{
  const inputs = parentDiv.querySelectorAll('.cmp-url-search-params__input');
  inputs.forEach((input)=> {
    input.classList.toggle('cmp-url-search-params__input--strike-through');
  })
}

const createNewURLSearchParamInput = (key?:string, value?: string, isActive?: string) => {
  const newURLSearchParamInputContainer = document.createElement('div');
  newURLSearchParamInputContainer.classList.add('obj-grid', 'cmp-url-search-params__params-pair');
  newURLSearchParamInputContainer.innerHTML = `
    <input type="checkbox" ${isActive ? `${isActive === "true" ? 'checked': ''}` : 'checked'}/>
    <div class="obj-grid__half util-margin-right">
      <label class="cmp-url-search-params__label">
        <span>URL Search Parameter Key</span>
        <input ${key ? `value="${key}"` : ''} class="cmp-url-search-params__input cmp-url-search-params__input--key" type="text" name="header" placeholder="URL Search Parameter Key"/>
      </label>
    </div>
    <div class="obj-grid__half">
      <label class="cmp-url-search-params__label">
        <span>Value</span>
        <input ${value ? `value="${value}"` : ''} class="cmp-url-search-params__input cmp-url-search-params__input--value" type="text" name="value" placeholder="value"/>
      </label>
    </div>  
  `;
  const newURLSearchParamInputCheckbox = newURLSearchParamInputContainer.querySelector('input[type="checkbox');
  if(isActive === "false"){
    handleURLSearchParamInputCheckbox(newURLSearchParamInputContainer)();
  }
  newURLSearchParamInputCheckbox?.addEventListener('change', handleURLSearchParamInputCheckbox(newURLSearchParamInputContainer));
  return newURLSearchParamInputContainer;
}

const addNewURLSearchParamInput = () => {
  const urlSearchParamsInputsContainer = document.querySelector('.cmp-url-search-params');
  const newURLSearchParamsInputElement = createNewURLSearchParamInput();
  urlSearchParamsInputsContainer?.append(newURLSearchParamsInputElement);
}

const doesHaveInputWithValue = (element: Element) => {
  const inputs = element.querySelectorAll('.cmp-url-search-params__input');
  if(inputs.length === 0) {
    return false;
  }
  for (const value of inputs.values()) {
    // @ts-ignore
    if(value.value) return true;
  }
  return false;
}

const handleNewURLSearchParamInput = () => {
  const urlSearchParamInputs = document.querySelectorAll('.cmp-url-search-params__params-pair');
  if(urlSearchParamInputs.length === 0){
    addNewURLSearchParamInput()
    return;
  }
  const lastURLSearchParamInput = urlSearchParamInputs[urlSearchParamInputs.length -1];
  if(doesHaveInputWithValue(lastURLSearchParamInput)) addNewURLSearchParamInput();
}

const removeURLSearchParamInput = (input:Element) => {
  const inputContainer = input.closest('.cmp-url-search-params__params-pair');
  inputContainer?.remove();
};

const getMatchingInputQuerySelector = (input: HTMLInputElement) => 
  input.classList.contains('cmp-url-search-params__input--key') 
  ? '.cmp-url-search-params__input--value'
  : '.cmp-url-search-params__input--key';

const shouldRemoveURLSearchParamInput = (input: HTMLInputElement) => {
  if(input.value){
    return false;
  }
  const inputContainer = input.closest('.cmp-url-search-params__params-pair') as Element;
  const matchingInput = selectInputElementFromComponent(inputContainer, getMatchingInputQuerySelector(input));
  return !matchingInput.value;
}
const removeURLSearchInputsHandler = (e: Event) => {
  // TODO: Probably a better way to type this
  const keyboardEvent = e as KeyboardEvent;
  const eventElement = e.target as HTMLInputElement;
  if(keyboardEvent.key === 'Backspace' && shouldRemoveURLSearchParamInput(eventElement)) {
    removeURLSearchParamInput(eventElement);
    handleNewURLSearchParamInput();
  }
}


const setURLSearchParams = (urlSearchParams: [string, string, string][]) => {
  const urlSearchParamsInputsContainer = selectElement('.cmp-url-search-params');
  urlSearchParamsInputsContainer.innerHTML = '';
  for (const pair of urlSearchParams) {
    const newURLSearchParamsInputElement = createNewURLSearchParamInput(...pair);
    urlSearchParamsInputsContainer?.append(newURLSearchParamsInputElement);
  }
  const newURLSearchParamsInputElement = createNewURLSearchParamInput();
  urlSearchParamsInputsContainer?.append(newURLSearchParamsInputElement);
}

const printURLSearchParamsToURL = () => {
  try{
    const activeSearURLSearchParams = getActiveURLSearchParams().toString();
    const currentURL = getURL();
    const searchParamIndex = currentURL.indexOf('?');
    if(!activeSearURLSearchParams && searchParamIndex !==1){
      setURL(currentURL.slice(0,searchParamIndex))  
      return;
    }
    if(searchParamIndex === -1){
      setURL(`${currentURL}?${activeSearURLSearchParams}`)
      return;
    }
    setURL(`${currentURL.slice(0,searchParamIndex)}?${activeSearURLSearchParams}`)  
  }catch(err){ };
}

const handleDirectURLSearchParams = () => {
  try{
    const currentURLSearchInput = [] as [string, string, string][];
    const currentURL = getURL();
    const searchParamIndex = currentURL.indexOf('?');
    if(searchParamIndex !== -1){
      const url = new URL(`http://placeholder.com${currentURL.slice(searchParamIndex)}`)
      const searchParams = new URLSearchParams(url.search);
      for (const [key, value] of searchParams.entries()) {
        currentURLSearchInput.push([key, value, 'true'])
      }  
    }
    setURLSearchParams(currentURLSearchInput.concat(getURLSearchParamsForHistory().filter(([_key, _value, active]) => active === 'false')));
  }catch(err){}
}


const addURLSearchParamsListeners = () =>{
  const urlSearchParamInputContainer = document.querySelector('.cmp-url-search-params');
  urlSearchParamInputContainer?.addEventListener('input', handleNewURLSearchParamInput); 
  urlSearchParamInputContainer?.addEventListener('input', printPreview); 
  urlSearchParamInputContainer?.addEventListener('input', printURLSearchParamsToURL)
  urlSearchParamInputContainer?.addEventListener('keydown', removeURLSearchInputsHandler);
  const initialURLSearchParamInput = urlSearchParamInputContainer?.querySelector('.cmp-url-search-params__params-pair') as Element;
  const initialURLSearchParamCheckbox = initialURLSearchParamInput?.querySelector('input[type="checkbox') as Element;
  initialURLSearchParamCheckbox.addEventListener('change', handleURLSearchParamInputCheckbox(initialURLSearchParamInput));
}

export { getActiveURLSearchParams,getURLSearchParamsForHistory, addURLSearchParamsListeners, setURLSearchParams, handleDirectURLSearchParams, printURLSearchParamsToURL };
