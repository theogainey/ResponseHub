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

export { toggleHidden, toggleHiddenWithTimeout };
