import { getBasicAuth, getBearerTokenAuth, getSelectedAuthType, hasAuth } from "./auth";
import { printPreview } from "./preview";

// TODO: A USERS NEEDS TO BE ABLE TURN HEADERS ON AND OFF WITHOUT DELETING THEM
// TOD: USER FEEDBACK FOR INVALID HEADERS

const getHeaderKey = (component:Element): string => {
  const  { value } = component.querySelector('.cmp-headers__input--header') as HTMLInputElement;
  return value ?? ''
}  

const getHeaderValue = (component:Element): string => {
  const  { value } = component.querySelector('.cmp-headers__input--value') as HTMLInputElement;
  return value ?? ''
}  

const getHeaderKeyValuePair = (component:Element):[string, string] => [getHeaderKey(component), getHeaderValue(component)]; 
const getHeaderKeyValuePairWithActive = (component:Element):[string, string, string] =>  [getHeaderKey(component), getHeaderValue(component), isActiveHeader(component).toString()];

const isValidHeader = ([key, value]: string[]) =>  !!key && !!value;

const isActiveHeader = (component:Element): boolean => !!(component.querySelector('input[type=checkbox') as HTMLInputElement).checked;

const getHeadersForHistory = ():[string, string, string][] => {
  const headerInputComponents = document.querySelectorAll('.cmp-headers__header-pair');
  const headerKeyValuePairs = [];
  for (const value of headerInputComponents.values()) {
    headerKeyValuePairs.push(getHeaderKeyValuePairWithActive(value));
  }
  const headers = headerKeyValuePairs.filter(isValidHeader);
  if(hasAuth()){
    headers.push(['Authorization', getBasicAuth(), "true"]);
  }
  return headers;
} 

const getActiveHeaders  = (): Headers => {
  const headerInputComponents = document.querySelectorAll('.cmp-headers__header-pair');
  const headerKeyValuePairs = [];
  for (const value of headerInputComponents.values()) {
    if(!isActiveHeader(value)){
      continue;
    }
    headerKeyValuePairs.push(getHeaderKeyValuePair(value));
  }
  const headers = new Headers(headerKeyValuePairs.filter(isValidHeader));
  if(!hasAuth()){
    return headers;
  }
  switch (getSelectedAuthType()) {
    case 'basic-auth':
      headers.append('Authorization', getBasicAuth());
      break;
    case 'bearer-token':
      headers.append('Authorization', getBearerTokenAuth());
      break;
    default:
      break;
  }
  return headers;
} 

const handleHeaderInputCheckbox = (parentDiv: Element) => () =>{
  const inputs = parentDiv.querySelectorAll('.cmp-headers__input');
  inputs.forEach((input)=> {
    input.classList.toggle('cmp-headers__input--strike-through');
  })
}

const createNewHeaderInput = (key?:string, value?: string, isActive?: string) => {
  const newHeaderInputContainer = document.createElement('div');
  newHeaderInputContainer.classList.add('cmp-headers__header-pair');
  newHeaderInputContainer.innerHTML = `
    <input type="checkbox" ${isActive ? `${isActive === "true" ? 'checked': ''}` : 'checked'}/>
    <div class="obj-grid">
      <div class="obj-grid__half util-margin-right">
        <label class="cmp-headers__label">
          <span>Header</span>
          <input ${key ? `value="${key}"` : ''} class="cmp-headers__input cmp-headers__input--header" type="text" name="header" placeholder="Header"/>
        </label>
      </div>
      <div class="obj-grid__half">
        <label class="cmp-headers__label">
          <span>Value</span>
          <input ${value ? `value="${value}"` : ''}  class="cmp-headers__input cmp-headers__input--value" type="text" name="value" placeholder="Value"/>
        </label>
      </div> 
    </div>
  `;
  const newHeaderInputCheckbox = newHeaderInputContainer.querySelector('input[type="checkbox');
  if(isActive === "false"){
    handleHeaderInputCheckbox(newHeaderInputContainer)();
  }
  newHeaderInputCheckbox?.addEventListener('change', handleHeaderInputCheckbox(newHeaderInputContainer));
  return newHeaderInputContainer;
}

const addNewHeaderInput = () => {
  const headerInputsContainer = document.querySelector('.cmp-headers');
  const newHeaderInputElement = createNewHeaderInput();
  headerInputsContainer?.append(newHeaderInputElement);
}

const doesHaveInputWithValue = (element: Element) => {
  const inputs = element.querySelectorAll('.cmp-headers__input');
  if(inputs.length === 0) {
    return false;
  }
  for (const value of inputs.values()) {
    // @ts-ignore
    if(value.value) return true;
  }
  return false;
}

const handleNewHeaderInput = () => {
  const headerInputs = document.querySelectorAll('.cmp-headers__header-pair');
  if(headerInputs.length === 0){
    addNewHeaderInput()
    return;
  }
  const lastHeaderInput = headerInputs[headerInputs.length -1];
  if(doesHaveInputWithValue(lastHeaderInput)) addNewHeaderInput();
}

const removeHeaderInput = (input:Element) => {
  const inputContainer = input.closest('.cmp-headers__header-pair');
  inputContainer?.remove();
};

const getMatchingInputQuerySelector = (input: HTMLInputElement) => 
  input.classList.contains('cmp-headers__input--header') 
  ? '.cmp-headers__input--value'
  : '.cmp-headers__input--header';

const shouldRemoveHeaderInput = (input: HTMLInputElement) => {
  if(input.value){
    return false;
  }
  const inputContainer = input.closest('.cmp-headers__header-pair');
  const matchingInput = inputContainer?.querySelector(getMatchingInputQuerySelector(input)) as HTMLInputElement;
  return !matchingInput.value;
}
const removeHeaderInputsHandler = (e: Event) => {
  // TODO: Probably a better way to type this
  const keyboardEvent = e as KeyboardEvent;
  const eventElement = e.target as HTMLInputElement;
  if(keyboardEvent.key === 'Backspace' && shouldRemoveHeaderInput(eventElement)) {
    removeHeaderInput(eventElement);
    handleNewHeaderInput();
  }
}

const addHeaderListeners = () => {
  const headerInputContainer = document.querySelector('.cmp-headers');
  headerInputContainer?.addEventListener('input', handleNewHeaderInput); 
  headerInputContainer?.addEventListener('input', printPreview); 
  headerInputContainer?.addEventListener('keydown', removeHeaderInputsHandler);
  const initialHeaderInput = headerInputContainer?.querySelector('.cmp-headers__header-pair') as Element;
  const initialHeaderInputCheckbox = initialHeaderInput?.querySelector('input[type="checkbox') as Element;
  initialHeaderInputCheckbox.addEventListener('change', handleHeaderInputCheckbox(initialHeaderInput));
}

const setHeaders = (headers: [string, string, string][]) => {
  const headerInputsContainer = document.querySelector('.cmp-headers') as Element;
  headerInputsContainer.innerHTML = '';
  for (const pair of headers) {
    const newHeaderInputElement = createNewHeaderInput(...pair);
    headerInputsContainer?.append(newHeaderInputElement);
  }
  const newHeaderInputElement = createNewHeaderInput();
  headerInputsContainer?.append(newHeaderInputElement);
}

export { getHeadersForHistory, getActiveHeaders, addHeaderListeners, setHeaders };
