import { printPreview } from "./preview";

const addTabChangeHandler = (layoutDiv: Element) => (tabSelector: string) =>(tab:Element) =>{
  const tabInput = tab.querySelector('input');
  tabInput?.addEventListener('change', () => {
    const tabs = document.querySelectorAll(tabSelector);
    tabs.forEach((e) => e.classList.remove('cmp-options-tabs__tab--active'))
    tab.classList.add('cmp-options-tabs__tab--active')
    layoutDiv?.setAttribute('data-view', tabInput.getAttribute('value') ?? '');
    printPreview();
  });
}

const addTabListeners = () => {
  const requestOptionsLayoutDiv = document.querySelector('.obj-options-layout') as Element;
  const requestOptionsTabs = document.querySelectorAll('#request-options .cmp-options-tabs__tab');
  requestOptionsTabs.forEach(addTabChangeHandler(requestOptionsLayoutDiv)('#request-options .cmp-options-tabs__tab'));

  const responseLayoutDiv = document.querySelector('.cmp-response') as Element;
  const responseOptionsTabs = document.querySelectorAll('.cmp-response__details .cmp-options-tabs__tab');
  responseOptionsTabs.forEach(addTabChangeHandler(responseLayoutDiv)('.cmp-response__details .cmp-options-tabs__tab'));

  const requestBodyLayoutDiv = document.querySelector('.cmp-request-body__input-area') as Element;
  const requestBodyOptionsTabs = document.querySelectorAll('.cmp-request-body__tab');
  requestBodyOptionsTabs.forEach(addTabChangeHandler(requestBodyLayoutDiv)('.cmp-request-body__tab'));

  const authLayoutDiv = document.querySelector('.cmp-auth__input-area') as Element;
  const authOptionsTabs = document.querySelectorAll('.cmp-auth__tab');
  authOptionsTabs.forEach(addTabChangeHandler(authLayoutDiv)('.cmp-auth__tab'));

}

export { addTabListeners };
