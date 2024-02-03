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

const createNewURLSearchParamInput = (key?:string, value?: string) => {
  const newURLSearchParamInputContainer = document.createElement('div');
  newURLSearchParamInputContainer.classList.add('obj-grid', 'cmp-url-search-params__params-pair');
  newURLSearchParamInputContainer.innerHTML = `
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
  const inputContainer = input.closest('.cmp-url-search-params__params-pair');
  const matchingInput = inputContainer?.querySelector(getMatchingInputQuerySelector(input)) as HTMLInputElement;
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

const formatURLSearchParamsForHistory = (urlSearchParams: URLSearchParams) => {
  const formattedURLSearchParams = [];
  for(const pair of urlSearchParams.entries()){
    formattedURLSearchParams.push(pair);
  }
  return formattedURLSearchParams;
};

const setURLSearchParams = (urlSearchParams: [string, string][]) => {
  const urlSearchParamsInputsContainer = document.querySelector('.cmp-url-search-params') as Element;
  urlSearchParamsInputsContainer.innerHTML = '';
  for (const pair of urlSearchParams) {
    const newURLSearchParamsInputElement = createNewURLSearchParamInput(pair[0], pair[1]);
    urlSearchParamsInputsContainer?.append(newURLSearchParamsInputElement);
  }
  const newURLSearchParamsInputElement = createNewURLSearchParamInput();
  urlSearchParamsInputsContainer?.append(newURLSearchParamsInputElement);
}

const addURLSearchParamsListeners = () =>{
  const urlSearchParamInputContainer = document.querySelector('.cmp-url-search-params');
  urlSearchParamInputContainer?.addEventListener('input', handleNewURLSearchParamInput); 
  urlSearchParamInputContainer?.addEventListener('input', printPreview); 
  urlSearchParamInputContainer?.addEventListener('keydown', removeURLSearchInputsHandler);
}

export { getURLSearchParams, addURLSearchParamsListeners, formatURLSearchParamsForHistory, setURLSearchParams };
