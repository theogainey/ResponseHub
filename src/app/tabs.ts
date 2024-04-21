import { printPreview } from "./preview";
import { removeElementTabbable, setElementTabbable } from "./tabIndex";
import { selectElement } from "./utils";

const addTabChangeHandler = (layoutDiv: Element) => (tabSelector: string) =>(tab:Element) =>{
  const tabInput = tab.querySelector('input');
  tabInput?.addEventListener('change', () => {
    const tabs = document.querySelectorAll(tabSelector);
    tabs.forEach((e) => e.classList.remove('cmp-options-tabs__tab--active'));
    tab.classList.add('cmp-options-tabs__tab--active');
    setElementTabbable(tabInput.getAttribute('value') ?? '');
    removeElementTabbable(layoutDiv.getAttribute('data-view') ?? '');
    layoutDiv?.setAttribute('data-view', tabInput.getAttribute('value') ?? '');
    printPreview();
  });
}

const addTabListeners = () => {
  const requestOptionsLayoutDiv = selectElement('.obj-options-layout');
  const requestOptionsTabs = document.querySelectorAll('#request-options .cmp-options-tabs__tab');
  requestOptionsTabs.forEach(addTabChangeHandler(requestOptionsLayoutDiv)('#request-options .cmp-options-tabs__tab'));

  const responseLayoutDiv = selectElement('.cmp-response');
  const responseOptionsTabs = document.querySelectorAll('.cmp-response__details .cmp-options-tabs__tab');
  responseOptionsTabs.forEach(addTabChangeHandler(responseLayoutDiv)('.cmp-response__details .cmp-options-tabs__tab'));

  const requestBodyLayoutDiv = selectElement('.cmp-request-body__input-area');
  const requestBodyOptionsTabs = document.querySelectorAll('.cmp-request-body__tab');
  requestBodyOptionsTabs.forEach(addTabChangeHandler(requestBodyLayoutDiv)('.cmp-request-body__tab'));

  const authLayoutDiv = selectElement('.cmp-auth__input-area');
  const authOptionsTabs = document.querySelectorAll('.cmp-auth__tab');
  authOptionsTabs.forEach(addTabChangeHandler(authLayoutDiv)('.cmp-auth__tab'));

}

export { addTabListeners };
