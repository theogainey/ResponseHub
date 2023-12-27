
type BodyDataType = 'form-data' | 'x-www-form-urlencoded' | 'raw' | 'none';

const getSelectedBodyDataType = (): BodyDataType => {
  const bodyInputTabs = document.querySelector('.cmp-request-body__input-area');
  const currentBodyType = bodyInputTabs?.getAttribute('data-view') ?? 'form-data';
  if (currentBodyType === 'form-data' || currentBodyType === 'x-www-form-urlencoded' || currentBodyType === 'raw'){
    return currentBodyType;
  } 
  return 'none';
}

const getRawBody = () => {
  const rawBodyInput = document.querySelector('.cmp-request-body__text-area') as HTMLTextAreaElement;
  return rawBodyInput.value;
}

const requestCanHaveBody = (method: string) => method !== 'GET' && method !== 'HEAD';


export { getSelectedBodyDataType, getRawBody, requestCanHaveBody };
