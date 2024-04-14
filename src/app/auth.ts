import { printURLSearchParamsToURL } from "./urlSearchParams";
import { selectInputElement } from "./utils";

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
    const username = selectInputElement('#basic-auth-username').value;
    const password = selectInputElement('#basic-auth-password').value;
    return !!(username && password);
  }
  if(authType === 'bearer-token') {
    const token = selectInputElement('#bearer-token-auth-token').value;
    return !!token;
  }
  if(authType === 'api-key') {
    const key = selectInputElement('#api-token-key').value;
    const value = selectInputElement('#api-token-value').value;
    return !!(key && value);
  }
  return false;
}

const getBasicAuth = () => {
  const username = selectInputElement('#basic-auth-username').value;
  const password = selectInputElement('#basic-auth-password').value;
  return `Basic ${btoa(`${username}:${password}`)}`;
}

const getBearerTokenAuth = () => {
  const token = selectInputElement('#bearer-token-auth-token').value;
  return `Bearer ${token}`;
}

type APIKeyAuthLocation = 'headers' | 'params';
const getAPIKeyAuthLocation = (): APIKeyAuthLocation =>{
  const location = selectInputElement('#api-token-location').value;
  if(location === 'params'){
    return location;
  }
  return 'headers';
}

const getAPIKeyAuthKeyValuePair = ():[string, string] => {
  const key = selectInputElement('#api-token-key').value;
  const value = selectInputElement('#api-token-value').value;
  return [key, value];
}


const setAuth = ({ auth }:AuthHistoryEntry) => {
  const authInputs = document.querySelectorAll('.cmp-auth__input-area input[type="text"]');
  for (const input of authInputs.values()) {
    //@ts-ignore
    input.value = '';
  }
  if(auth === 'none'){
    selectInputElement('#default-auth-tab').click();
    return;
  }
  if(isAuthBasicAuth(auth)){
    selectInputElement('#basic-auth-tab').click();
    selectInputElement('#basic-auth-username').value = auth.username;
    selectInputElement('#basic-auth-password').value = auth.password;    
    return;
  }
  if(isAPIKeyAuth(auth)){
    selectInputElement('#api-token-auth-tab').click();
    selectInputElement('#api-token-key').value = auth.key;
    selectInputElement('#api-token-value').value = auth.value;
    selectInputElement('#api-token-location').value = auth.location;
  }
  if(isBearerTokenAuth(auth)){
    selectInputElement('#bearer-token-auth-tab').click();
    selectInputElement('#bearer-token-auth-token').value = auth.token;
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
      const username = selectInputElement('#basic-auth-username').value;
      const password = selectInputElement('#basic-auth-password').value;    
      return{
        auth: {
          authType: 'basic-auth',
          username: username,
          password: password,
        }
      };
    case 'bearer-token':
      const token = selectInputElement('#bearer-token-auth-token').value;
      return {
        auth: {
          authType: 'bearer-token',
          token: token,
        }
      };
    case 'api-key': 
      const key = selectInputElement('#api-token-key').value;
      const value =selectInputElement('#api-token-value').value;
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
  const APITokenLocationInput = selectInputElement('#api-token-location');
  APITokenLocationInput.addEventListener('change', printURLSearchParamsToURL);
};

export { addAuthListeners,  setAuth, getAPIKeyAuthLocation, getAPIKeyAuthKeyValuePair, getBasicAuth, hasAuth, getBearerTokenAuth, getSelectedAuthType, getAuthForHistory };
