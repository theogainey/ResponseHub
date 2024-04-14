import { printURLSearchParamsToURL } from "./urlSearchParams";

type AuthType = 'none' | 'basic-auth' | 'bearer-token' | 'api-key';

interface AuthHistory {
  authType: AuthType;
}

interface BasicAuthHistory extends AuthHistory {
  authType: 'basic-auth';
  username: string;
  password: string;
}

interface BearerTokenAuthHistory extends AuthHistory {
  authType: 'bearer-token';
  token: string;
}

interface APIKeyAuthHistory extends AuthHistory {
  authType: 'api-key';
  key: string;
  value: string;
  location: 'headers' | 'params';
}

export type AuthHistoryEntry = {
  auth: 'none' | APIKeyAuthHistory | BearerTokenAuthHistory | BasicAuthHistory;
}

function isAuthBasicAuth (auth: any): auth is BasicAuthHistory {
  return auth !== 'none' && auth.authType === 'basic-auth';
} 

function isAPIKeyAuth (auth: any): auth is APIKeyAuthHistory {
  return auth !== 'none' && auth.authType === 'api-key';
} 

function isBearerTokenAuth (auth: any): auth is BearerTokenAuthHistory {
  return auth !== 'none' && auth.authType === 'bearer-token';
} 


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


const setAuth = ({ auth }:AuthHistoryEntry) => {
  const authInputs = document.querySelectorAll('.cmp-auth__input-area input[type="text"]');
  for (const input of authInputs.values()) {
    //@ts-ignore
    input.value = '';
  }
  if(auth === 'none'){
    (document.querySelector('#default-auth-tab') as HTMLInputElement).click();
    return;
  }
  if(isAuthBasicAuth(auth)){
    (document.querySelector('#basic-auth-tab') as HTMLInputElement).click();
    (document.querySelector('#basic-auth-username') as HTMLInputElement ).value = auth.username;
    (document.querySelector('#basic-auth-password') as HTMLInputElement).value = auth.password;    
    return;
  }
  if(isAPIKeyAuth(auth)){
    (document.querySelector('#api-token-auth-tab') as HTMLInputElement).click();
    (document.querySelector('#api-token-key') as HTMLInputElement ).value = auth.key;
    (document.querySelector('#api-token-value') as HTMLInputElement).value = auth.value;
    (document.querySelector('#api-token-location') as HTMLInputElement ).value = auth.location;
  }
  if(isBearerTokenAuth(auth)){
    (document.querySelector('#bearer-token-auth-tab') as HTMLInputElement).click();
    (document.querySelector('#bearer-token-auth-token') as HTMLInputElement ).value = auth.token;
  }
}

const getAuthForHistory = ():AuthHistoryEntry => {
  if(!hasAuth()){
    return {
      auth: 'none'
    }  
  }
  switch (getSelectedAuthType()) {
    case 'basic-auth':
      const username = (document.querySelector('#basic-auth-username') as HTMLInputElement ).value;
      const password = (document.querySelector('#basic-auth-password') as HTMLInputElement).value;    
      return{
        auth: {
          authType: 'basic-auth',
          username: username,
          password: password,
        }
      };
    case 'bearer-token':
      const token = (document.querySelector('#bearer-token-auth-token') as HTMLInputElement ).value;
      return {
        auth: {
          authType: 'bearer-token',
          token: token,
        }
      };
    case 'api-key': 
      const key = (document.querySelector('#api-token-key') as HTMLInputElement ).value;
      const value = (document.querySelector('#api-token-value') as HTMLInputElement).value;
      const location = getAPIKeyAuthLocation();
      return {
        auth: {
          authType: 'api-key',
          key: key,
          value: value,
          location: location,
        }
      }
    default:
      return {
        auth: 'none'
      }
  }
}

const addAuthListeners = () => {
  const APITokenLocationInput = document.querySelector('#api-token-location') as HTMLInputElement;
  APITokenLocationInput.addEventListener('change', printURLSearchParamsToURL);
};

export { addAuthListeners,  setAuth, getAPIKeyAuthLocation, getAPIKeyAuthKeyValuePair, getBasicAuth, hasAuth, getBearerTokenAuth, getSelectedAuthType, getAuthForHistory };
