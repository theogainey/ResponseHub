import { printPreview } from "./preview";

const isTabSelectedHidden = (HTTPMethod: string) => {
  const requestOptionsLayoutDiv = document.querySelector('.obj-options-layout') as Element;
  const currentSelected = requestOptionsLayoutDiv?.getAttribute('data-view');
  return currentSelected === 'body' && HTTPMethod === 'GET';
}

const selectDefaultTab = () => {
  const previewTab = document.querySelector('#preview-tab input') as HTMLInputElement;
  previewTab.checked = true;
  previewTab.dispatchEvent(new Event('change'));
};

const addURLListeners = () => {
  const methodSelect = document.querySelector('.cmp-url-input--method') as HTMLSelectElement;
  const optionsTabs = document.querySelector('.cmp-options-tabs');
  const bodyTabs = document.querySelector('.cmp-request-body__tabs');
  methodSelect.addEventListener('change', () => {
    optionsTabs?.setAttribute('data-method', methodSelect.value);
    bodyTabs?.setAttribute('data-method', methodSelect.value);  
    if(isTabSelectedHidden(methodSelect.value)){
      selectDefaultTab();
    }  
  });
  methodSelect.addEventListener('change', printPreview);
}

export { addURLListeners };
