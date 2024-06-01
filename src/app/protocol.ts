import { selectElement } from "./utils";

const protocolStateCache = new Map();

const handleChangeToGraphQL = () =>{
  const urlMethodSelect = selectElement('#method-select');
  const urlMethodSelectLabel = selectElement('#method-select-label');
  const urlInput = selectElement('.cmp-url-input__url');
  protocolStateCache.set('method-select-label', urlMethodSelectLabel);
  protocolStateCache.set('method-select', urlMethodSelect);
  urlMethodSelect.remove();
  urlMethodSelectLabel.remove();
  urlInput.classList.add('cmp-url-input__url--graphql');
  console.log(urlInput);
}

const createNewMethodSelect = ( urlInputArea:HTMLElement ) => {
  const newURLMethodSelectLabel = document.createElement('label');
  newURLMethodSelectLabel.classList.add('util-visually-hidden');
  newURLMethodSelectLabel.setAttribute('id', 'method-select-label');
  newURLMethodSelectLabel.setAttribute('for', 'method-select');
  newURLMethodSelectLabel.innerHTML = `HTTP method`;
  const newURLMethodSelect= document.createElement('select');
  newURLMethodSelect.classList.add('cmp-url-input__method', 'cmp-url-input__method--GET');
  newURLMethodSelect.setAttribute('id', 'method-select');
  newURLMethodSelect.innerHTML = `
    <option value="GET" selected>GET</option>
    <option value="POST">POST</option>
    <option value="PUT">PUT</option>
    <option value="PATCH">PATCH</option>
    <option value="DELETE">DELETE</option>
    <option value="HEAD">HEAD</option>
    <option value="OPTIONS">OPTIONS</option>
  `;
  urlInputArea.prepend(newURLMethodSelect);
  urlInputArea.prepend(newURLMethodSelectLabel);
}

const handleChangeToHTTP = () => {
 const urlInputArea = selectElement('.cmp-url-input');
 const urlInput = selectElement('.cmp-url-input__url');
 urlInput.classList.remove('cmp-url-input__url--graphql');
 if( protocolStateCache.has('method-select') && protocolStateCache.has('method-select-label') ){
    urlInputArea.prepend(protocolStateCache.get('method-select'));
    urlInputArea.prepend(protocolStateCache.get('method-select-label'));
    return;
  }
  createNewMethodSelect(urlInputArea);
}
const handleProtocolSelectChange = (viewControlElement:HTMLElement ) => (e:Event) => {
  const newProtocol = (e.target as HTMLSelectElement).value; 
  viewControlElement.setAttribute('data-protocol', newProtocol);
  switch (newProtocol) {
    case 'GraphQL':
      handleChangeToGraphQL();
      break;
    case 'HTTP':
      handleChangeToHTTP();
      break;
    default:
      break;
  }
}
const addProtocolListeners = () => {
  const protocolSelect = selectElement('#protocol-select');
  const protocolViewControlElement = selectElement('#main');
  protocolSelect?.addEventListener('change', handleProtocolSelectChange(protocolViewControlElement));
}

export { addProtocolListeners };
  function selectElementFromComponent(urlInput: HTMLElement, arg1: string) {
    throw new Error("Function not implemented.");
  }

