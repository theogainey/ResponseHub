import { printPreview } from "./preview";
import { selectInputElementFromComponent } from "./utils";

const getFormURLEncodedDataKey = (component:Element): string => {
  const  { value } = selectInputElementFromComponent(component, '.cmp-request-body__input--key');
  return value ?? ''
}  

const getFormURLEncodedDataValue = (component:Element): string => {
  const  { value } = selectInputElementFromComponent(component, '.cmp-request-body__input--value');
  return value ?? ''
}  

const getFormURLEncodedDataKeyValuePair = (component:Element):[string, string] => [getFormURLEncodedDataKey(component), getFormURLEncodedDataValue(component)]; 

const isValidFormData = ([key, value]: [string, string]) =>  !!key && !!value;

const getFormURLEncodedData = () => {
  const formURLEncodedInputs = document.querySelectorAll('.cmp-x-www-form-urlencoded__input-pair');
  const formURLEncodedKeyValuePairs = [];
  for (const value of formURLEncodedInputs.values()) {
    formURLEncodedKeyValuePairs.push(getFormURLEncodedDataKeyValuePair(value));
  }
  return new URLSearchParams(formURLEncodedKeyValuePairs.filter(isValidFormData)).toString();
}

const doesHaveInputWithValue = (element: Element) => {
  const inputs = element.querySelectorAll('.cmp-x-www-form-urlencoded__input-pair .cmp-request-body__input');
  if(inputs.length === 0) {
    return false;
  }
  for (const value of inputs.values()) {
    // @ts-ignore
    if(value.value) return true;
  }
  return false;
}

const createFormURLEncodedInput = () => {
  const newFormURLEncodedContainer = document.createElement('div');
  newFormURLEncodedContainer.classList.add('obj-grid', 'cmp-x-www-form-urlencoded__input-pair');
  newFormURLEncodedContainer.innerHTML = `
    <div class="obj-grid__half util-margin-right">
      <label class="cmp-request-body__label">
        <span>Key</span>
        <input class="cmp-request-body__input cmp-request-body__input--key" type="text" name="x-www-form-urlencoded-key" placeholder="Key"/>
      </label>
    </div>
    <div class="obj-grid__half">
      <label class="cmp-request-body__label">
        <span>Value</span>
        <input class="cmp-request-body__input cmp-request-body__input--value" type="text" name="x-www-form-urlencoded-value" placeholder="Value"/>
      </label>
    </div>      
  `;
  return newFormURLEncodedContainer;
}

const addFormURLEncodedInput = () => {
  const formURLEncodedInputsContainer = document.querySelector('.cmp-request-body__x-www-form-urlencoded');
  const newFormURLEncodedInputElement = createFormURLEncodedInput();
  formURLEncodedInputsContainer?.append(newFormURLEncodedInputElement);
}

const handleNewFormURLEncodedInput = () => {
  const formURLEncodedInputs = document.querySelectorAll('.cmp-x-www-form-urlencoded__input-pair');
  if(formURLEncodedInputs.length === 0) {
    addFormURLEncodedInput();
    return;
  }
  const lastFormURLEncodedInput = formURLEncodedInputs[formURLEncodedInputs.length -1];
  if(doesHaveInputWithValue(lastFormURLEncodedInput)) addFormURLEncodedInput();

}

const getMatchingInputQuerySelector = (input: HTMLInputElement) => 
  input.classList.contains('cmp-request-body__input--key') 
  ? '.cmp-request-body__input--value'
  : '.cmp-request-body__input--key';

const shouldRemoveFormURLEncodedInput = (input: HTMLInputElement) => {
  if(input.value){
    return false;
  }
  const inputContainer = input.closest('.cmp-x-www-form-urlencoded__input-pair') as Element;
  const matchingInput = selectInputElementFromComponent(inputContainer, (getMatchingInputQuerySelector(input)));
  return !matchingInput.value;
}

const removeFormURLEncodedInput = (input:Element) => {
  const inputContainer = input.closest('.cmp-x-www-form-urlencoded__input-pair');
  inputContainer?.remove();
};

const removeFormURLEncodedInputsHandler = (e: Event) => {
  // TODO: Probably a better way to type this
  const keyboardEvent = e as KeyboardEvent;
  const eventElement = e.target as HTMLInputElement;
  if(keyboardEvent.key === 'Backspace' && shouldRemoveFormURLEncodedInput(eventElement)) {
    removeFormURLEncodedInput(eventElement);
    handleNewFormURLEncodedInput();
  }
}


const addFormURLEncodedListeners = () =>{
  const formURLEncodedInputContainer = document.querySelector('.cmp-request-body__x-www-form-urlencoded');
  formURLEncodedInputContainer?.addEventListener('input', handleNewFormURLEncodedInput); 
  formURLEncodedInputContainer?.addEventListener('input', printPreview); 
  formURLEncodedInputContainer?.addEventListener('keydown', removeFormURLEncodedInputsHandler);
}

export { getFormURLEncodedData,  addFormURLEncodedListeners };
