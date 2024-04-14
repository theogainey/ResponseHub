import { selectElement } from "./utils";

const handleRequestError = () => {
  const sendButton = selectElement('#send-button div');
  sendButton.classList.add('util-visually-hidden');
  const responseLayoutDiv = selectElement('.cmp-response');
  responseLayoutDiv?.setAttribute('data-view', 'error');

}

export { handleRequestError };
