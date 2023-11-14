
const addTabChangeHandler = (optionsLayoutDiv: Element) => (tab:Element) =>{
  const tabInput = tab.querySelector('input');
  tabInput?.addEventListener('change', () => {
    const tabs = document.querySelectorAll('.cmp-options-tabs__tab');
    tabs.forEach((e) => e.classList.remove('cmp-options-tabs__tab--active'))
    tab.classList.add('cmp-options-tabs__tab--active')
    optionsLayoutDiv?.setAttribute('data-view', tabInput.getAttribute('value') ?? '')
  });
}
const addTabListeners = () => {
  const optionsLayoutDiv = document.querySelector('.obj-options-layout') as Element;
  const tabs = document.querySelectorAll('.cmp-options-tabs__tab');
  tabs.forEach(addTabChangeHandler(optionsLayoutDiv))
}

export { addTabListeners };
