type AuthType = 'none' | 'basic-auth' | 'bearer-token';


const getSelectedAuthType = (): AuthType => {
  const authInputArea = document.querySelector('.cmp-auth__input-area');
  const currentAuthType = authInputArea?.getAttribute('data-view') ?? 'none';
  if(currentAuthType === 'basic-auth' || currentAuthType === 'bearer-token'){
    return currentAuthType;
  }
  return 'none';
}

const hasAuth = () => {
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

export { getBasicAuth, hasAuth, getBearerTokenAuth, getSelectedAuthType };
