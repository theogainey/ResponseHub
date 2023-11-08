const getHeaderKey = (component:Element): string => {
  const  { value } = component.querySelector('.cmp-headers__input--header') as HTMLInputElement;
  return value ?? ''
}  

const getHeaderValue = (component:Element): string => {
  const  { value } = component.querySelector('.cmp-headers__input--value') as HTMLInputElement;
  return value ?? ''
}  

const getHeaderKeyValuePair = (component:Element):[string, string] => [getHeaderKey(component), getHeaderValue(component)]; 

const isValidHeader = ([key, value]: [string, string]) =>  !!key && !!value;

const getHeaders = (): Headers => {
  const headerInputComponents = document.querySelectorAll('.cmp-headers__header-pair');
  const headerKeyValuePairs = [];
  for (const value of headerInputComponents.values()) {
    headerKeyValuePairs.push(getHeaderKeyValuePair(value));
  }
  return new Headers(headerKeyValuePairs.filter(isValidHeader));
} 

export { getHeaders };
