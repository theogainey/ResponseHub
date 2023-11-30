
const addTabChangeHandler = (layoutDiv: Element) => (tabSelector: string) =>(tab:Element) =>{
  const tabInput = tab.querySelector('input');
  tabInput?.addEventListener('change', () => {
    const tabs = document.querySelectorAll(tabSelector);
    tabs.forEach((e) => e.classList.remove('cmp-options-tabs__tab--active'))
    tab.classList.add('cmp-options-tabs__tab--active')
    layoutDiv?.setAttribute('data-view', tabInput.getAttribute('value') ?? '')
  });
}

const addTabListeners = () => {
  const requestOptionsLayoutDiv = document.querySelector('.obj-options-layout') as Element;
  const requestOptionsTabs = document.querySelectorAll('#request-options .cmp-options-tabs__tab');
  requestOptionsTabs.forEach(addTabChangeHandler(requestOptionsLayoutDiv)('#request-options .cmp-options-tabs__tab'));

  const responseLayoutDiv = document.querySelector('.cmp-response') as Element;
  const responseOptionsTabs = document.querySelectorAll('.cmp-response__details .cmp-options-tabs__tab');
  responseOptionsTabs.forEach(addTabChangeHandler(responseLayoutDiv)('.cmp-response__details .cmp-options-tabs__tab'));

}

export { addTabListeners };