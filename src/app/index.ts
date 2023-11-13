import { sendRequest} from "./request";
import { reHighlightCode } from "./response";

document.addEventListener("DOMContentLoaded", () => {
  const sendButton = document.getElementById('send-button');
  sendButton?.addEventListener('click', sendRequest);
  const jsonButton = document.querySelector('#json-button');
  const xmlButton = document.querySelector('#xml-button');
  jsonButton?.addEventListener('click', () => reHighlightCode('json'));
  xmlButton?.addEventListener('click', () => reHighlightCode('xml'));

});
