
const hasAuth = () => {
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
  console.log(username)
  console.log(password)
  return `Basic ${btoa(`${username}:${password}`)}`;
}

export { getBasicAuth, hasAuth };
