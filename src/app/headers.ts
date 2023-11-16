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

const isValidHeader = ([key, value]: [string, string]) =>  !!key && !!value;

const getHeaders = (): Headers => {
  const headerInputComponents = document.querySelectorAll('.cmp-headers__header-pair');
  const headerKeyValuePairs = [];
  for (const value of headerInputComponents.values()) {
    headerKeyValuePairs.push(getHeaderKeyValuePair(value));
  }
  return new Headers(headerKeyValuePairs.filter(isValidHeader));
} 

const createNewHeaderInput = () => {
  const newHeaderInputContainer = document.createElement('div');
  newHeaderInputContainer.classList.add('obj-grid', 'cmp-headers__header-pair');
  newHeaderInputContainer.innerHTML = `
    <div class="obj-grid__half util-margin-right">
      <label class="cmp-headers__label">
        <span>Header</span>
        <input class="cmp-headers__input cmp-headers__input--header" type="text" name="header" placeholder="header"/>
      </label>
    </div>
    <div class="obj-grid__half">
      <label class="cmp-headers__label">
        <span>Value</span>
        <input class="cmp-headers__input cmp-headers__input--value" type="text" name="value" placeholder="value"/>
      </label>
    </div> 
  `;
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

const addHeaderListeners = () =>{
  const headerInputContainer = document.querySelector('.cmp-headers');
  headerInputContainer?.addEventListener('input', handleNewHeaderInput); 
  headerInputContainer?.addEventListener('input', printPreview); 
  headerInputContainer?.addEventListener('keydown', removeHeaderInputsHandler);
}

export { getHeaders, addHeaderListeners };
