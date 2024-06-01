import { addTabbable, removeElementTabbable, removeTabbable, setElementTabbable } from "./tabIndex";
import { selectElement } from "./utils";

const protocolStateCache = new Map();

const HTTPOnlyTabs = [
  {layoutArea:'preview', inputSelector: 'input[value="preview"]'}, 
  {layoutArea:'url-search-params', inputSelector: 'input[value="url-search-params"]'},
  {layoutArea:'body', inputSelector: 'input[value="body"]'},
];

const GraphQLOnlyTabs =  [
  {layoutArea:'query', inputSelector: 'input[value="query"]'},
];

const removeTabIndexesByGroups = ( tabGroups: Array<any> ) =>{
  tabGroups.forEach(({layoutArea, inputSelector})=> {
    const tab = selectElement(inputSelector);
    removeTabbable(tab);
    removeElementTabbable(layoutArea);
  })
}

const addTabIndexesByGroups = ( tabGroups: Array<any> ) =>{
  tabGroups.forEach(({layoutArea, inputSelector})=> {
    const tab = selectElement(inputSelector);
    addTabbable(tab);
    setElementTabbable(layoutArea);
  });
}

const setTabIndexesForHTTP = () => {
  removeTabIndexesByGroups(GraphQLOnlyTabs);
  addTabIndexesByGroups(HTTPOnlyTabs);
}

const setTabIndexesForGraphQL = () =>{
  removeTabIndexesByGroups(HTTPOnlyTabs);
  addTabIndexesByGroups(GraphQLOnlyTabs);
}

const handleChangeToGraphQL = () => {
  // remove option tabs
  const urlMethodSelect = selectElement('#method-select');
  const urlMethodSelectLabel = selectElement('#method-select-label');
  const urlInput = selectElement('.cmp-url-input__url');
  protocolStateCache.set('method-select-label', urlMethodSelectLabel);
  protocolStateCache.set('method-select', urlMethodSelect);
  urlMethodSelect.remove();
  urlMethodSelectLabel.remove();
  urlInput.classList.add('cmp-url-input__url--graphql');
  const requestOptionList = selectElement('.cmp-options-tabs');
  requestOptionList.setAttribute('data-method', 'GraphQL');
  // set query tab to active  
  const queryTab = selectElement('input[value="query"]');
  queryTab.click();
  setTabIndexesForGraphQL();
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
 const previewTab = selectElement('input[value="preview"');
 const urlInputArea = selectElement('.cmp-url-input');
 const urlInput = selectElement('.cmp-url-input__url');
 const requestOptionList = selectElement('.cmp-options-tabs');
 urlInput.classList.remove('cmp-url-input__url--graphql');
 if( protocolStateCache.has('method-select') && protocolStateCache.has('method-select-label') ){
    const urlMethodSelect = protocolStateCache.get('method-select');
    urlInputArea.prepend(urlMethodSelect);
    urlInputArea.prepend(protocolStateCache.get('method-select-label'));
    requestOptionList.setAttribute('data-method', urlMethodSelect.value);
    // set preview tab to active  
    previewTab.click();
    setTabIndexesForHTTP();
    return;
  }
  createNewMethodSelect(urlInputArea);
  requestOptionList.setAttribute('data-method', 'GET');
  // click preview tab to set correct tab indexes
  previewTab.click();
  setTabIndexesForHTTP();

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
