import { EditorView, tags, HighlightStyle } from "./vendor";
  
const settings = {
  background: '#fff',
  foreground: '#5c6166',
  caret: '#7c3aed',
  selection: '#036dd626',
  lineHighlight: '#8a91991a',
  gutterBackground: '#fff',
  gutterForeground: '#000000',
}
const ResponseHubTheme = (mode:string) => EditorView.theme(
  {
    '&': {
      backgroundColor: settings.background,
      color: settings.foreground,
      height: mode === 'response' ? 'auto' : '12rem',
      fontFamily: `'Noto Sans Mono', monospace`,
    },
    '.cm-scroller':{
      fontFamily: `'Noto Sans Mono', monospace`,
    },
    '&.cm-focused': {
      outline: 'none',
    },
    '.cm-content': {
      caretColor: settings.caret,
    },
    '.cm-cursor, .cm-dropCursor': {
      borderLeftColor: settings.caret,
    },
    '&.cm-focused .cm-selectionBackgroundm .cm-selectionBackground, .cm-content ::selection':
      {
        backgroundColor: settings.selection,
      },
    '.cm-activeLine': {
      backgroundColor: settings.lineHighlight,
    },
    '.cm-gutters': {
      backgroundColor: settings.gutterBackground,
      color: settings.gutterForeground,
      borderRight: 'none',
    },
    '.cm-activeLineGutter': {
      backgroundColor: settings.lineHighlight,
    },
  },
  {
    dark: false,
  },
);

const styles = [
  {
    tag: tags.comment,
    color: '#787b8099',
  },
  {
    tag: tags.variableName,
    color: '#004199',
  },
  {
    tag: tags.string,
    color: '#c42f39',
  },
  {
    tag: tags.number,
    color: '#006e52',
  },
  {
    tag: tags.bool,
    color: '#4b02ff',
  },
  {
    tag: tags.null,
    color: '#4b02ff',
  },
  {
    tag: tags.keyword,
    color: '#006e52',
  },
  {
    tag: tags.operator,
    color: 'black',
  },
  {
    tag: tags.className,
    color: 'black',
  },
  {
    tag: tags.definition(tags.typeName),
    color: 'black',
  },
  {
    tag: tags.typeName,
    color: 'black',
  },
  {
    tag: [tags.angleBracket, tags.brace, tags.squareBracket],
    color: 'black',
  },
  {
    tag: tags.tagName,
    color: '#006e52',
  },
  {
    tag: tags.attributeName,
    color: '#004199',
  },
  {
    tag: tags.content,
    color: 'black',
  },
  {
    tag: tags.propertyName,
    color: '#a327c4'
  },
  {
    tag: tags.documentMeta,
    color: '#a327c4',
  }

];

const myHighlightStyle = HighlightStyle.define(styles);

export { myHighlightStyle, ResponseHubTheme };
