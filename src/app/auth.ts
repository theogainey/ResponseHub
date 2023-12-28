type AuthType = 'basic-auth' | 'none';


const getSelectedAuthType = (): AuthType => {
  const authInputArea = document.querySelector('.cmp-auth__input-area');
  const currentAuthType = authInputArea?.getAttribute('data-view') ?? 'none';
  if(currentAuthType === 'basic-auth'){
    return currentAuthType;
  }
  return 'none';
}

const hasAuth = () => {
  const authType = getSelectedAuthType();
  if(authType === 'none') return false;
  // @ts-ignore
  const username = document.querySelector('#basic-auth-username').value;
  // @ts-ignore
  const password = document.querySelector('#basic-auth-password').value;
  return !!(username && password);
}

const getBasicAuth = () => {
  // @ts-ignore
  const username = document.querySelector('#basic-auth-username').value;
  // @ts-ignore
  const password = document.querySelector('#basic-auth-password').value;
  return `Basic ${btoa(`${username}:${password}`)}`;
}

export { getBasicAuth, hasAuth };
