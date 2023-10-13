import { sendRequest} from "./request";

document.addEventListener("DOMContentLoaded", () => {
  const sendButton = document.getElementById('send-button');
  sendButton?.addEventListener('click', sendRequest);
});
