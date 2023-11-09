import hljs from 'highlight.js/lib/core';
import xml from 'highlight.js/lib/languages/xml';
import javascript from 'highlight.js/lib/languages/javascript';

hljs.registerLanguage('xml', xml);
hljs.registerLanguage('javascript', javascript);

const isJSONResponse = (response: Response) => {
  const contentType = response.headers.get('content-type') ?? ''; 
  return contentType.includes('application/json');
}

const printResponse = (data:string) => {
  const responseCodeElement = document.querySelector('.cmp-response') as Element;
  const highlightedCode = hljs.highlight(
    data,
    { language: 'xml' }
  ).value
  
  responseCodeElement.innerHTML = `<pre><code class="cmp-response__text">${highlightedCode}</code></pre>`;
}

const handleResponse = async (response: Response) => {
  if (isJSONResponse(response)) {
    const data = JSON.stringify(await response.json());
    printResponse(data);
  } else {
    // TODO think about how you should handle none JSON data
    printResponse( await response.text());
  }  
}

export { handleResponse };
