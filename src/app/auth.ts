import { printURLSearchParamsToURL } from "./urlSearchParams";

type AuthType = 'none' | 'basic-auth' | 'bearer-token' | 'api-key';


const getSelectedAuthType = (): AuthType => {
  const authInputArea = document.querySelector('.cmp-auth__input-area');
  const currentAuthType = authInputArea?.getAttribute('data-view') ?? 'none';
  if(currentAuthType === 'basic-auth' || currentAuthType === 'bearer-token' || currentAuthType === 'api-key'){
    return currentAuthType;
  }
  return 'none';
}

const hasAuth = ():boolean => {
  const authType = getSelectedAuthType();
  if(authType === 'none') return false;
  if(authType === 'basic-auth'){
    const username = (document.querySelector('#basic-auth-username') as HTMLInputElement ).value;
    const password = (document.querySelector('#basic-auth-password') as HTMLInputElement).value;
    return !!(username && password);
  }
  if(authType === 'bearer-token') {
    const token = (document.querySelector('#bearer-token-auth-token') as HTMLInputElement ).value;
    return !!token;
  }
  if(authType === 'api-key') {
    const key = (document.querySelector('#api-token-key') as HTMLInputElement ).value;
    const value = (document.querySelector('#api-token-value') as HTMLInputElement).value;
    return !!(key && value);
  }
  return false;
}

const getBasicAuth = () => {
  const username = (document.querySelector('#basic-auth-username') as HTMLInputElement ).value;
  const password = (document.querySelector('#basic-auth-password') as HTMLInputElement).value;
  return `Basic ${btoa(`${username}:${password}`)}`;
}

const getBearerTokenAuth = () => {
  const token = (document.querySelector('#bearer-token-auth-token') as HTMLInputElement ).value;
  return `Bearer ${token}`;
}

type APIKeyAuthLocation = 'headers' | 'params';
const getAPIKeyAuthLocation = (): APIKeyAuthLocation =>{
  const location = (document.querySelector('#api-token-location') as HTMLInputElement ).value;
  if(location === 'params'){
    return location;
  }
  return 'headers';
}

const getAPIKeyAuthKeyValuePair = ():[string, string] => {
  const key = (document.querySelector('#api-token-key') as HTMLInputElement ).value;
  const value = (document.querySelector('#api-token-value') as HTMLInputElement).value;
  return [key, value];
}


const setAuth = () => {
  const authInputs = document.querySelectorAll('.cmp-auth__input-area input[type="text"]');
  for (const input of authInputs.values()) {
    //@ts-ignore
    input.value = '';
  }
  //<input class="util-visually-hidden" checked type="radio" value="none" name="auth-tab" />
  (document.querySelector('#default-auth-tab') as HTMLInputElement).click();
}

const addAuthListeners = () => {
  const APITokenLocationInput = document.querySelector('#api-token-location') as HTMLInputElement;
  APITokenLocationInput.addEventListener('change', printURLSearchParamsToURL);
};

export { addAuthListeners,  setAuth, getAPIKeyAuthLocation, getAPIKeyAuthKeyValuePair, getBasicAuth, hasAuth, getBearerTokenAuth, getSelectedAuthType };
