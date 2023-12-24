import { printPreview } from "./preview";

const getFormDataKey = (component:Element): string => {
  const  { value } = component.querySelector('.cmp-request-body__input--key') as HTMLInputElement;
  return value ?? ''
}  

const getFormDataValue = (component:Element): string => {
  const  { value } = component.querySelector('.cmp-request-body__input--value') as HTMLInputElement;
  return value ?? ''
}  

const getFormDataKeyValuePair = (component:Element):[string, string] => [getFormDataKey(component), getFormDataValue(component)]; 

const isValidFormData = ([key, value]: [string, string]) =>  !!key && !!value;

const getFormData = (): FormData => {
  const formDataInputComponents = document.querySelectorAll('.cmp-form-data__input-pair');
  const formDataKeyValuePairs = [];
  for (const value of formDataInputComponents.values()) {
    formDataKeyValuePairs.push(getFormDataKeyValuePair(value));
  }
  const formData = new FormData();
  formDataKeyValuePairs.filter(isValidFormData).forEach(([key, value]) => formData.append(key, value));
  return formData;
} 

const doesHaveInputWithValue = (element: Element) => {
  const inputs = element.querySelectorAll('.cmp-request-body__form-data .cmp-request-body__input');
  if(inputs.length === 0) {
    return false;
  }
  for (const value of inputs.values()) {
    // @ts-ignore
    if(value.value) return true;
  }
  return false;
}


const createFormDataInput = () => {
  const newFormDataContainer = document.createElement('div');
  newFormDataContainer.classList.add('obj-grid', 'cmp-form-data__input-pair');
  newFormDataContainer.innerHTML = `
    <div class="obj-grid__half util-margin-right">
      <label class="cmp-request-body__label">
        <span>Key</span>
        <input class="cmp-request-body__input cmp-request-body__input--key" type="text" name="form-data-key" placeholder="Key"/>
      </label>
    </div>
    <div class="obj-grid__half">
      <label class="cmp-request-body__label">
        <span>Value</span>
        <input class="cmp-request-body__input cmp-request-body__input--value" type="text" name="form-data-value" placeholder="Value"/>
      </label>
    </div>    
  `;
  return newFormDataContainer;
}

const addFormDataInput = () => {
  const formDataInputsContainer = document.querySelector('.cmp-request-body__form-data');
  const newFormDataInputElement = createFormDataInput();
  formDataInputsContainer?.append(newFormDataInputElement);
}

const hasFormData = () => {
  const formDataInputs = document.querySelectorAll('.cmp-request-body__form-data .cmp-form-data__input-pair');
  for (const formDataInput of formDataInputs.values()) {
     console.log(formDataInput);
  }

}
const handleNewFormDataInput = () => {
  const formDataInputs = document.querySelectorAll('.cmp-request-body__form-data .cmp-form-data__input-pair');
  if(formDataInputs.length === 0) {
    addFormDataInput();
    return;
  }
  const lastFormDataInput = formDataInputs[formDataInputs.length -1];
  if(doesHaveInputWithValue(lastFormDataInput)) addFormDataInput();
}

const getMatchingInputQuerySelector = (input: HTMLInputElement) => 
  input.classList.contains('cmp-request-body__input--key') 
  ? '.cmp-request-body__input--value'
  : '.cmp-request-body__input--key';

const shouldRemoveFormDataInput = (input: HTMLInputElement) => {
  if(input.value){
    return false;
  }
  const inputContainer = input.closest('.cmp-form-data__input-pair');
  const matchingInput = inputContainer?.querySelector(getMatchingInputQuerySelector(input)) as HTMLInputElement;
  return !matchingInput.value;
}

const removeFormDataInput = (input:Element) => {
  const inputContainer = input.closest('.cmp-form-data__input-pair');
  inputContainer?.remove();
};

const removeFormDataInputsHandler = (e: Event) => {
  // TODO: Probably a better way to type this
  const keyboardEvent = e as KeyboardEvent;
  const eventElement = e.target as HTMLInputElement;
  if(keyboardEvent.key === 'Backspace' && shouldRemoveFormDataInput(eventElement)) {
    removeFormDataInput(eventElement);
    handleNewFormDataInput();
  }
}


const addFormDataListeners = () =>{
  const formDataInputContainer = document.querySelector('.cmp-request-body__form-data');
  formDataInputContainer?.addEventListener('input', handleNewFormDataInput); 
  formDataInputContainer?.addEventListener('input', printPreview); 
  formDataInputContainer?.addEventListener('keydown', removeFormDataInputsHandler);
}

export { getFormData, addFormDataListeners };
