import { lineNumbers, crosshairCursor, highlightActiveLine, highlightSelectionMatches,  indentOnInput, syntaxHighlighting, bracketMatching, closeBrackets, autocompletion, rectangularSelection, highlightActiveLineGutter, highlightSpecialChars, history, foldGutter, drawSelection, dropCursor, EditorState, keymap, closeBracketsKeymap, defaultKeymap, searchKeymap, historyKeymap, foldKeymap, completionKeymap, lintKeymap } from './vendor';
import { myHighlightStyle, ResponseHubTheme, } from './themes';
const GraphQLSetup = /*@__PURE__*/(() => [
  // lineNumbers(),
  highlightActiveLineGutter(),
  highlightSpecialChars(),
  history(),
  foldGutter(),
  drawSelection(),
  dropCursor(),
  EditorState.allowMultipleSelections.of(true),
  indentOnInput(),
  syntaxHighlighting(myHighlightStyle, { fallback: true }),
  bracketMatching(),
  closeBrackets(),
  autocompletion(),
  rectangularSelection(),
  crosshairCursor(),
  highlightActiveLine(),
  highlightSelectionMatches(),
  keymap.of([
      ...closeBracketsKeymap,
      ...defaultKeymap,
      ...searchKeymap,
      ...historyKeymap,
      ...foldKeymap,
      ...completionKeymap,
      ...lintKeymap
  ])
])();

const responseSetup = /*@__PURE__*/(() => [
  ResponseHubTheme('response'),
  lineNumbers(),
  highlightActiveLineGutter(),
  highlightSpecialChars(),
  history(),
  foldGutter(),
  drawSelection(),
  dropCursor(),
  EditorState.allowMultipleSelections.of(true),
  indentOnInput(),
  syntaxHighlighting(myHighlightStyle, { fallback: true }),
  bracketMatching(),
  closeBrackets(),
  autocompletion(),
  rectangularSelection(),
  crosshairCursor(),
  highlightActiveLine(),
  highlightSelectionMatches(),
  keymap.of([
      ...closeBracketsKeymap,
      ...defaultKeymap,
      ...searchKeymap,
      ...historyKeymap,
      ...foldKeymap,
      ...completionKeymap,
      ...lintKeymap
  ])
])();

export { responseSetup, GraphQLSetup };