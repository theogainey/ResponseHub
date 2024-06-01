
const addTabbable = (e: Element) => e.setAttribute('tabindex', '0');
const removeTabbable = (e: Element) => e.setAttribute('tabindex', '-1');

const getSelector  = ( layoutArea: string, remove = false):string => {
  switch (layoutArea) {
    case 'preview':
      return '.cmp-copy-button';
    case 'headers':
      return '.cmp-headers input';
    case 'auth':
      if(remove){
        return `${getSelector('basic-auth')}, ${getSelector('bearer-token')}, ${getSelector('api-key')}, ${getSelector('auth')}`
      }
      return '.cmp-auth__tabs input';
    case 'url-search-params':
      return '.cmp-url-search-params input';
    case 'body':
      if(remove){
        return `${getSelector('form-data')}, ${getSelector('x-www-form-urlencoded')}, ${getSelector('file')}, ${getSelector('raw')},${getSelector('body')}`
      }
      return '.cmp-request-body__tabs input';
    case 'basic-auth':
      return '.cmp-auth__basic-auth input';
    case 'bearer-token':
      return '.cmp-auth__bearer-token input';
    case 'api-key':
      return '.cmp-auth__api-key input, .cmp-auth__api-key select';
    case 'form-data':
      return '.cmp-request-body__form-data input';
    case 'x-www-form-urlencoded':
      return '.cmp-request-body__x-www-form-urlencoded input';
    case 'file':
      return '.cmp-request-body__file input';
    case 'raw':
      return '.cmp-request-body__text-area';
    default:
      return '';
  }

 }
const setElementTabbable = ( layoutArea: string) =>{
  const selector = getSelector(layoutArea);
  if(selector === '') return;
  const inputs = document.querySelectorAll(selector);
  inputs.forEach(addTabbable);
}

const removeElementTabbable = ( layoutArea: string) => {
  const selector = getSelector(layoutArea, true);
  if(selector === '') return;
  const inputs = document.querySelectorAll(selector);
  console.log(inputs);

  inputs.forEach(removeTabbable);
}

export { setElementTabbable, removeElementTabbable, addTabbable, removeTabbable };