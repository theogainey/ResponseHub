import hljs from 'highlight.js/lib/core';
import xml from 'highlight.js/lib/languages/xml';
import javascript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
import http from 'highlight.js/lib/languages/http';

hljs.registerLanguage('http', http);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('json', json);


const highlight = (code:string, language?: string) =>{
  if(language !== undefined){
   return hljs.highlight(
      code, 
      { language: language }
    ).value
  }
  return hljs.highlightAuto(code).value;
} 

const getLanguage = (code: string) => 
  hljs.highlightAuto(code).language ?? 'xml';

const hljsLineNumbersInstance = hljs.newInstance();
hljsLineNumbersInstance.registerLanguage('http', http);
hljsLineNumbersInstance.registerLanguage('xml', xml);
hljsLineNumbersInstance.registerLanguage('javascript', javascript);
hljsLineNumbersInstance.registerLanguage('json', json);

const lineNumberReducer = (linesWithNumbers: string, currentLine: string, index: number) => 
    linesWithNumbers.concat(`<span class="hljs-line-number">${index + 1}</span> ${currentLine} \n`);

const reduceToStringWithLine = (lines: string[]) => lines.reduce(lineNumberReducer, '');

hljsLineNumbersInstance.addPlugin({
  'after:highlight': (result) => {
    const splitToLine = result.value.split('\n');
    result.value = reduceToStringWithLine(splitToLine);
  }
});

const highLightWithLineNumbers = (code:string, language: string) => 
  hljsLineNumbersInstance.highlight(code, { language: language }).value;
 

export { highlight, highLightWithLineNumbers, getLanguage };
