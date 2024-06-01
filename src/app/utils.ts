const selectElement = (selector: string) => {
  return document.querySelector(selector) as HTMLElement;
}

const selectElementFromComponent = (component:Element, selector: string) => {
  return component.querySelector(selector) as HTMLElement;
}

const selectInputElement = (selector: string) => {
  return document.querySelector(selector) as HTMLInputElement;
}

const selectInputElementFromComponent = (component:Element, selector: string) => {
  return component.querySelector(selector) as HTMLInputElement;
}

const toggleHidden = (...elements: Array<Element | null>) => {
  elements.forEach((e) => {
    e?.classList.toggle('util-visually-hidden');
  });
}

const toggleHiddenWithTimeout = (...elements: Array<Element | null>) => {
  elements.forEach((e) => {
    e?.classList.toggle('util-visually-hidden');
    setTimeout(()=>{
      e?.classList.toggle('util-visually-hidden');
    }, 2000)
  });
}

export { toggleHidden, toggleHiddenWithTimeout, selectInputElement, selectInputElementFromComponent, selectElement };
