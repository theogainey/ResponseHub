
const handleRequestError = () => {
  const sendButton = document.querySelector('#send-button div') as Element;
  sendButton.classList.add('util-visually-hidden');
  const responseLayoutDiv = document.querySelector('.cmp-response') as Element;
  responseLayoutDiv?.setAttribute('data-view', 'error');

}

export { handleRequestError };
