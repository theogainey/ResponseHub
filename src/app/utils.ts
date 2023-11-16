const toggleHidden = (e: Element) => {
  e.classList.toggle('util-visually-hidden');
  setTimeout(()=>{
    e.classList.toggle('util-visually-hidden');
  }, 2000)
}

export { toggleHidden };
