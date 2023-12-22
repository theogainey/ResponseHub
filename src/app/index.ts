import { sendRequest} from "./request";
import { reHighlightCode } from "./response";
import { addTabListeners } from "./tabs";
import { addPrintPreviewListeners } from './preview';
import { addHeaderListeners } from "./headers";
import { addURLSearchParamsListeners } from "./urlSearchParams";
import { addURLListeners } from "./url";

document.addEventListener("DOMContentLoaded", () => {
  const sendButton = document.getElementById('send-button');
  sendButton?.addEventListener('click', sendRequest);
  const jsonButton = document.querySelector('#json-button');
  const xmlButton = document.querySelector('#xml-button');
  jsonButton?.addEventListener('click', () => reHighlightCode('json'));
  xmlButton?.addEventListener('click', () => reHighlightCode('xml'));
  addTabListeners();
  addPrintPreviewListeners();
  addHeaderListeners();
  addURLSearchParamsListeners();
  addURLListeners();
});
