// @ts-nocheck
import { lineNumbers, highlightActiveLineGutter, highlightSpecialChars, drawSelection, dropCursor, rectangularSelection, crosshairCursor, highlightActiveLine, keymap, EditorView } from '@codemirror/view';
import { EditorState, StateEffect, StateField } from '@codemirror/state';
import { LRLanguage, foldNodeProp, indentNodeProp, foldGutter, indentOnInput, syntaxHighlighting, defaultHighlightStyle, bracketMatching, foldKeymap, LanguageSupport, foldInside, delimitedIndent, HighlightStyle } from '@codemirror/language';
import { history, defaultKeymap, historyKeymap } from '@codemirror/commands';
import { highlightSelectionMatches, searchKeymap } from '@codemirror/search';
import { closeBrackets, autocompletion, closeBracketsKeymap, completionKeymap } from '@codemirror/autocomplete';
import { lintKeymap, linter } from '@codemirror/lint';
import { LRParser } from '@lezer/lr';
import { styleTags, tags } from '@lezer/highlight';
import { getTokenAtPosition, getTypeInfo, getAutocompleteSuggestions, getDiagnostics } from 'graphql-language-service';
import { validateSchema } from 'graphql';
import { html } from "@codemirror/lang-html";
import { json } from '@codemirror/lang-json';

// (The superfluous function calls around the list of extensions work
// around current limitations in tree-shaking software.)
/**
This is an extension value that just pulls together a number of
extensions that you might want in a basic editor. It is meant as a
convenient helper to quickly set up CodeMirror without installing
and importing a lot of separate packages.

Specifically, it includes...

 - [the default command bindings](https://codemirror.net/6/docs/ref/#commands.defaultKeymap)
 - [line numbers](https://codemirror.net/6/docs/ref/#view.lineNumbers)
 - [special character highlighting](https://codemirror.net/6/docs/ref/#view.highlightSpecialChars)
 - [the undo history](https://codemirror.net/6/docs/ref/#commands.history)
 - [a fold gutter](https://codemirror.net/6/docs/ref/#language.foldGutter)
 - [custom selection drawing](https://codemirror.net/6/docs/ref/#view.drawSelection)
 - [drop cursor](https://codemirror.net/6/docs/ref/#view.dropCursor)
 - [multiple selections](https://codemirror.net/6/docs/ref/#state.EditorState^allowMultipleSelections)
 - [reindentation on input](https://codemirror.net/6/docs/ref/#language.indentOnInput)
 - [the default highlight style](https://codemirror.net/6/docs/ref/#language.defaultHighlightStyle) (as fallback)
 - [bracket matching](https://codemirror.net/6/docs/ref/#language.bracketMatching)
 - [bracket closing](https://codemirror.net/6/docs/ref/#autocomplete.closeBrackets)
 - [autocompletion](https://codemirror.net/6/docs/ref/#autocomplete.autocompletion)
 - [rectangular selection](https://codemirror.net/6/docs/ref/#view.rectangularSelection) and [crosshair cursor](https://codemirror.net/6/docs/ref/#view.crosshairCursor)
 - [active line highlighting](https://codemirror.net/6/docs/ref/#view.highlightActiveLine)
 - [active line gutter highlighting](https://codemirror.net/6/docs/ref/#view.highlightActiveLineGutter)
 - [selection match highlighting](https://codemirror.net/6/docs/ref/#search.highlightSelectionMatches)
 - [search](https://codemirror.net/6/docs/ref/#search.searchKeymap)
 - [linting](https://codemirror.net/6/docs/ref/#lint.lintKeymap)

(You'll probably want to add some language package to your setup
too.)

This extension does not allow customization. The idea is that,
once you decide you want to configure your editor more precisely,
you take this package's source (which is just a bunch of imports
and an array literal), copy it into your own code, and adjust it
as desired.
*/
const basicSetup = /*@__PURE__*/(() => [
    lineNumbers(),
    highlightActiveLineGutter(),
    highlightSpecialChars(),
    history(),
    foldGutter(),
    drawSelection(),
    dropCursor(),
    EditorState.allowMultipleSelections.of(true),
    indentOnInput(),
    syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
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

/**
A minimal set of extensions to create a functional editor. Only
includes [the default keymap](https://codemirror.net/6/docs/ref/#commands.defaultKeymap), [undo
history](https://codemirror.net/6/docs/ref/#commands.history), [special character
highlighting](https://codemirror.net/6/docs/ref/#view.highlightSpecialChars), [custom selection
drawing](https://codemirror.net/6/docs/ref/#view.drawSelection), and [default highlight
style](https://codemirror.net/6/docs/ref/#language.defaultHighlightStyle).
*/
const minimalSetup = /*@__PURE__*/(() => [
    highlightSpecialChars(),
    history(),
    drawSelection(),
    syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
    keymap.of([
        ...defaultKeymap,
        ...historyKeymap,
    ])
])();

// BELOW CODE IS FROM cm6-graphql 

// This file was generated by lezer-generator. You probably shouldn't edit it.
const spec_name = {__proto__:null,query:241, mutation:243, subscription:245, on:86, fragment:92, schema:102, scalar:114, type:120, implements:126, interface:140, union:146, enum:154, input:164, directive:172, repeatable:176, extend:192};
const parser = /*@__PURE__*/LRParser.deserialize({
  version: 14,
  states: "LWOYQPOOO!WQPO'#C}O!`QPO'#C_OOQO'#C_'#C_O!iQPO'#DYOOQO'#Ev'#EvOOQO'#D_'#D_O!nQPO'#D^O#_QPO'#D^O!iQPO'#DhO!iQPO'#DrO!iQPO'#DuO!iQPO'#DyO!iQPO'#EOOOQO'#Dd'#DdO#fQPO'#ESOOQO'#D]'#D]O!vQPO'#E^OOQO'#Ea'#EaOOQO'#E]'#E]OOQO'#FT'#FTOOQO'#Eu'#EuOOQO'#Eh'#EhQYQPOOOOQO'#C`'#C`OOQO'#DZ'#DZOOQO'#D`'#D`OOQO'#Di'#DiOOQO'#Ds'#DsOOQO'#Dv'#DvOOQO'#Dz'#DzOOQO'#EP'#EPOOQO'#ET'#ETOOQO'#E_'#E_O#kQPO'#CaO$VQPO'#DQO$[QPO'#DPO$sQPO'#DPO$xQPO'#DSO%WQPO'#DOOOQO'#En'#EnO%fQPO,59iOOQO'#Ca'#CaO%qQPO'#CxOOQO'#El'#ElO'hQPO'#CwO)[QPO'#CdOOQO,58y,58yO)aQPO,58yO)fQPO,58yO)nQPO,58yOOQO'#DT'#DTO)yQPO,59tO{QPO'#FUOOQO'#Db'#DbOOQO,59x,59xO*OQPO,59xO!nQPO,59xO!iQPO,5:PO!iQPO,5:SO!iQPO,5:^O!iQPO,5:aO!iQPO,5:eO!iQPO,5:jO*TQPO,5:nOOQO'#Df'#DfO*YQPO,5:SO+aQPO,5:^O,hQPO,5:aO-oQPO,5:eO.sQPO,5:jO/wQPO,5:nO!nQPO,5:xO!iQPO,5:|O!iQPO,5:}O!iQPO,5;OO!iQPO,5;PO!iQPO,5;QO!iQPO,5;ROOQO-E8f-E8fOOQO,59l,59lO0VQPO'#CzOOQO,59k,59kO0[QPO,59kO0mQPO,59kOOQO'#DR'#DRO0tQPO,59kO1OQPO,59nO!iQPO'#DVOOQO,59p,59pO)aQPO,59pO)fQPO,59pOOQO'#DW'#DWOOQO,59j,59jOOQO-E8l-E8lOOQO1G/T1G/TOOQO,59d,59dOOQO-E8j-E8jO1aQPO'#CeOOQO'#Ei'#EiO1fQPO,59OOOQO1G.e1G.eO)aQPO1G.eO)fQPO1G.eO)fQPO1G/`O1nQPO'#DcO1sQPO,5;pOOQO1G/d1G/dO*OQPO1G/dO1xQPO1G/kO4QQPO1G/nO5]QPO1G/xO6hQPO1G/{O7pQPO1G0PO8xQPO1G0UO/wQPO1G0YO9PQPO1G/nO9WQPO'#DkO9`QPO'#FWOOQO'#Dn'#DnOOQO1G/n1G/nO9hQPO1G/nOOQO'#Dl'#DlO:iQPO1G/xOOQO1G/x1G/xO:pQPO1G/xO;qQPO1G/{O;xQPO'#DxO5dQPO1G/{O<QQQO'#FYOOQO'#D|'#D|OOQO1G0P1G0PO6oQPO1G0PO9`QPO'#FZOOQO'#ER'#EROOQO1G0U1G0UO7wQPO1G0UO<YQPO'#DqO!iQPO'#DqOOQO'#Ep'#EpO<_QPO'#DpO<pQSO1G0YO)yQPO1G0YO>QQPO1G0YOOQO'#EV'#EVOOQO1G0d1G0dO>YQPO1G0dO!qQPO1G0hO?ZQPO1G0iO?ZQPO1G0jO?fQPO1G0kO?nQPO1G0lO?vQPO1G0mOOQO'#C|'#C|O@OQPO'#C{OOQO'#Em'#EmO@TQPO,59fOOQO1G/V1G/VO@]QPO1G/VO@nQPO1G/VOOQO1G/Y1G/YOOQO'#Cg'#CgOOQO,59q,59qOOQO1G/[1G/[O)aQPO1G/[O@uQPO,59POOQO-E8g-E8gOOQO1G.j1G.jOOQO7+$P7+$PO)aQPO7+$POOQO7+$z7+$zO)aQPO7+$zO!iQPO,59}OOQO1G1[1G1[OOQO7+%O7+%OOOQO7+%V7+%VOBOQPO7+%YOOQO7+%Y7+%YO@}QPO7+%YOCZQPO7+%dOOQO7+%d7+%dOBYQPO7+%dODfQPO7+%gODmQPO7+%gOOQO7+%k7+%kODtQPO7+%kOOQO7+%p7+%pOEuQPO7+%pO<pQSO7+%tO)yQPO7+%tO>QQPO7+%tO!iQPO,5:VOOQO,5:V,5:VOFvQPO'#DoO!iQPO'#DoOOQO'#Eo'#EoOGRQPO,5;rO!iQPO,5:dOOQO,5:d,5:dOG^QQO'#D}OGlQQO'#D}OOQO'#Eq'#EqOGqQQO,5;tOG|QPO,5;uO@uQPO,5:]OHXQPO,5:]OOQO-E8n-E8nOOQO'#EZ'#EZOOQO'#E['#E[OOQO'#EY'#EYOH^QPO7+%tOOQO'#EX'#EXO<sQSO'#EXOOQO7+&O7+&OOOQO7+&S7+&SOJcQPO7+&TOOQO7+&T7+&TOIbQPO7+&TOKnQPO7+&UOOQO7+&U7+&UOJmQPO7+&UOLyQPO7+&VOMQQPO7+&VOOQO7+&W7+&WOMXQPO7+&WOOQO7+&X7+&XONYQPO7+&XO! ZQQO,59gOOQO-E8k-E8kOOQO1G/Q1G/QOOQO7+$q7+$qO! xQPO7+$qOOQO7+$v7+$vO@uQPO'#CjO!!ZQPO'#E|OOQO'#E|'#E|O!#UQPO1G.kOOQO<<Gk<<GkOOQO<<Hf<<HfOOQO1G/i1G/iOOQO<<Ht<<HtO!#gQPO<<HtOOQO<<IO<<IOO!$hQPO<<IOO!%iQPO<<IROOQO<<IV<<IVOOQO<<I[<<I[O!&mQPO<<I`O<pQSO<<I`O)yQPO<<I`OOQO1G/q1G/qO@uQPO,5:ZO!'qQPO,5:ZO!'vQPO,5:ZOOQO-E8m-E8mOOQO1G1^1G1^OOQO1G0O1G0OO!(RQQO'#CxO!(dQQO'#CwOOQO,5:i,5:iO!(rQQO,5:iOOQO-E8o-E8oOOQO1G1`1G1`OOQO1G1a1G1aO!)QQPO1G/wO@uQPO1G/wO<sQSO,5:sOOQO,5:s,5:sOOQO<<Io<<IoO!)lQPO<<IoOOQO<<Ip<<IpO!*mQPO<<IpO!+nQPO<<IqOOQO<<Ir<<IrOOQO<<Is<<IsO!,rQQO'#CsO!,yQPO'#CvOOQO'#FP'#FPO!-RQPO1G/ROOQO<<H]<<H]O!-^QPO,59UOOQO,59V,59VO! ZQQO'#ClOOQO7+$V7+$VO!-cQPO7+$VO!-nQPO7+$VOOQOAN>`AN>`OOQOAN>jAN>jO!-|QPOAN>zO<pQSOAN>zO!/QQPO1G/uO@uQPO1G/uO!/`QPO1G/uOOQO1G0T1G0TOOQO7+%c7+%cO!/eQPO7+%cO!/|QPO7+%cOOQO1G0_1G0_OOQOAN?ZAN?ZOOQOAN?[AN?[O!0TQQO'#EjO!0xQQO,59_OOQO,59_,59_O!1PQPO'#FROOQO'#Ek'#EkO!1UQPO,59bOOQO,59b,59bOOQO7+$m7+$mOOQO1G.p1G.pOOQO,59W,59WOOQO<<Gq<<GqO!1^QPO<<GqO!1iQPOG24fOOQO7+%a7+%aO!2mQPO7+%aO@uQPO7+%aOOQO<<H}<<H}O!2{QPO<<H}OOQO,5;U,5;UOOQO-E8h-E8hOOQO1G.y1G.yO! ZQQO,5;mOOQO-E8i-E8iOOQO1G.|1G.|OOQOAN=]AN=]OOQO<<H{<<H{O!3dQPO<<H{OOQOAN>iAN>iO!3rQPO1G1XOOQOAN>gAN>gOOQO7+&s7+&s",
  stateData: "!4S~O#hOSPOS~OcUOiPO!OiO!TjO!^kO!hlO!kmO!onO!toO!xpO#SqO#lhO#mhO#nhO~O#krO#vvO~OV!OOiPOm{O#kzO~Oi!VOm{O~O!TjO!Z!cO!^kO!hlO!kmO!onO!toO~O!xpO~P!vOm!iO~OVuXhuXiuXmuX#kuX#oTX#tuX#vuX~O#o!rO~OV!sOiPOm{OhsX#ksX#tsX#vsX~O#k!wO~OiPOm{O{#OO#kzO~O#t#POhrX#krX#vrX~Oh#RO#krO#vvO~OV!sOilXmlXhlX#klX#tlX#vlXclX!OlX!TlX!^lX!hlX!klX!olX!tlX!xlX#SlX#flX#llX#mlX#nlX#rlXUlXYlX{lX!zlX#olX~Om{OikXhkX#kkX#tkX#vkXckX!OkX!TkX!^kX!hkX!kkX!okX!tkX!xkX#SkX#fkX#lkX#mkX#nkX#rkXUkXYkX{kX!zkX#okX~OY#UO~OiPO~OiPOm{O~OV!OOiPOm{O~O{#OO~Oi!VO~Om#gO~Oi#jOm{O!a#nOc![a!O![a!T![a!^![a!h![a!k![a!o![a!t![a!x![a#S![a#f![a#l![a#m![a#n![a~Oi#jOm{O!a#nOc!fa!O!fa!T!fa!^!fa!h!fa!k!fa!o!fa!t!fa!x!fa#S!fa#f!fa#l!fa#m!fa#n!fa~Om{O#r#sOc!iai!ia!O!ia!T!ia!^!ia!h!ia!k!ia!o!ia!t!ia!x!ia#S!ia#f!ia#l!ia#m!ia#n!ia~Oi#uOm{Oc!ma!O!ma!T!ma!^!ma!h!ma!k!ma!o!ma!t!ma!x!ma#S!ma#f!ma#l!ma#m!ma#n!ma~Oi#yOm{Oc!ra!O!ra!T!ra!^!ra!h!ra!k!ra!o!ra!t!ra!x!ra#S!ra#f!ra#l!ra#m!ra#n!ra~OcUO{#OO!z$UO#kzO~O#k$_O~OiPOhsa#ksa#tsa#vsa~Om{O~P0[OV!sOm{O~P0[Om{Ohva#kva#tva#vva~O#o$kO~OU$mOY#UO~O#o$rO~Oh$sO~Om{Oc!Xii!Xi!O!Xi!T!Xi!^!Xi!h!Xi!k!Xi!o!Xi!t!Xi!x!Xi#S!Xi#f!Xi#l!Xi#m!Xi#n!Xi~Oi#jOm{Oc![i!O![i!T![i!^![i!h![i!k![i!o![i!t![i!x![i#S![i#f![i#l![i#m![i#n![i~O!a#nO~P2|Oi#jOm{Oc!fi!O!fi!T!fi!^!fi!h!fi!k!fi!o!fi!t!fi!x!fi#S!fi#f!fi#l!fi#m!fi#n!fi~O!a#nO~P4XO#r#sOc!iii!ii!O!ii!T!ii!^!ii!h!ii!k!ii!o!ii!t!ii!x!ii#S!ii#f!ii#l!ii#m!ii#n!ii~Om{O~P5dOi#uOc!mi!O!mi!T!mi!^!mi!h!mi!k!mi!o!mi!t!mi!x!mi#S!mi#f!mi#l!mi#m!mi#n!mi~Om{O~P6oOi#yOc!ri!O!ri!T!ri!^!ri!h!ri!k!ri!o!ri!t!ri!x!ri#S!ri#f!ri#l!ri#m!ri#n!ri~Om{O~P7wO#y%VO~P2|O#kzO#y%VO~OcUO#kzO~Oi#jOc![i!O![i!T![i!^![i!h![i!k![i!o![i!t![i!x![i#S![i#f![i#l![i#m![i#n![i~O#y%VO~P4XOi#jOc!fi!O!fi!T!fi!^!fi!h!fi!k!fi!o!fi!t!fi!x!fi#S!fi#f!fi#l!fi#m!fi#n!fi~O#{%]O~P5gO#kzO#{%]O~OcUOf%_O~O#o%dO~OcUO#kzO{!dX!z!dX#o!dX~O#{%lO$O%gO$P%gO$Q%gO$R%gO$S%gO$T%gO$U%gO$V%gO$W%hO$X%hO$Y%hO$Z%hO$[%hO$]%hO$^%hO$_%hO$`%hO$a%hO$b%hO~O{#OO!z$UO~Oi!VOc#Qi!O#Qi!T#Qi!^#Qi!h#Qi!k#Qi!o#Qi!t#Qi!x#Qi#S#Qi#f#Qi#l#Qi#m#Qi#n#Qi~Oi#jOm{O!a#nO~Om{O#r#sO~Oi#uOm{O~Oi#yOm{O~O#o%{O~OU%}O#k$_O~OiPOhsi#ksi#tsi#vsi~Om{O~P@]O]&RO#kzO~Oi#jOc![q!O![q!T![q!^![q!h![q!k![q!o![q!t![q!x![q#S![q#f![q#l![q#m![q#n![q~Om{O#y%VO~P@}Oi#jOc!fq!O!fq!T!fq!^!fq!h!fq!k!fq!o!fq!t!fq!x!fq#S!fq#f!fq#l!fq#m!fq#n!fq~Om{O#y%VO~PBYOc!iqi!iq!O!iq!T!iq!^!iq!h!iq!k!iq!o!iq!t!iq!x!iq#S!iq#f!iq#l!iq#m!iq#n!iq~O#{%]O~PCeO#r#sO~PCeOi#uOc!mq!O!mq!T!mq!^!mq!h!mq!k!mq!o!mq!t!mq!x!mq#S!mq#f!mq#l!mq#m!mq#n!mq~Oi#yOc!rq!O!rq!T!rq!^!rq!h!rq!k!rq!o!rq!t!rq!x!rq#S!rq#f!rq#l!rq#m!rq#n!rq~OcUO#kzO#o&eO~OcUOh&iO#kzO~Om&kOc!qXf!qXh!qX~Of&nO~OcUOf%_Oh&pO~OcUOh&qO#kzO~O#o&sO~O#{&tOc!vqi!vq!O!vq!T!vq!^!vq!h!vq!k!vq!o!vq!t!vq!x!vq#S!vq#f!vq#l!vq#m!vq#n!vq~Oi#jOc#Vq!O#Vq!T#Vq!^#Vq!h#Vq!k#Vq!o#Vq!t#Vq!x#Vq#S#Vq#f#Vq#l#Vq#m#Vq#n#Vq~Om{O#y%VO~PIbOi#jOc#Wq!O#Wq!T#Wq!^#Wq!h#Wq!k#Wq!o#Wq!t#Wq!x#Wq#S#Wq#f#Wq#l#Wq#m#Wq#n#Wq~Om{O#y%VO~PJmOc#Xqi#Xq!O#Xq!T#Xq!^#Xq!h#Xq!k#Xq!o#Xq!t#Xq!x#Xq#S#Xq#f#Xq#l#Xq#m#Xq#n#Xq~O#{%]O~PKxO#r#sO~PKxOi#uOc#Yq!O#Yq!T#Yq!^#Yq!h#Yq!k#Yq!o#Yq!t#Yq!x#Yq#S#Yq#f#Yq#l#Yq#m#Yq#n#Yq~Oi#yOc#Zq!O#Zq!T#Zq!^#Zq!h#Zq!k#Zq!o#Zq!t#Zq!x#Zq#S#Zq#f#Zq#l#Zq#m#Zq#n#Zq~OY'PO]&}Oa'POb'POc'POd'POe'POf'POi'OO~OiPOhsq#ksq#tsq#vsq~O#q'TOU#pXY#pXm#pX#r#pX#t#pXc#pX{#pX!z#pX#k#pX[#pXh#pX#o#pX~Om{O#r'UO#t'VOUXiYXi~Oi#jOc![y!O![y!T![y!^![y!h![y!k![y!o![y!t![y!x![y#S![y#f![y#l![y#m![y#n![y~Oi#jOc!fy!O!fy!T!fy!^!fy!h!fy!k!fy!o!fy!t!fy!x!fy#S!fy#f!fy#l!fy#m!fy#n!fy~O#{%]Oc!iyi!iy!O!iy!T!iy!^!iy!h!iy!k!iy!o!iy!t!iy!x!iy#S!iy#f!iy#l!iy#m!iy#n!iy~O#{&tOc!vyi!vy!O!vy!T!vy!^!vy!h!vy!k!vy!o!vy!t!vy!x!vy#S!vy#f!vy#l!vy#m!vy#n!vy~O#o'_O~OcUO#kzO#o'_O~OV!sOclXflXhlXmlX~Om&kOckXfkXhkX~Om&kOc!qaf!qah!qa~Om{O#r'UOc!ei{!ei!z!ei#k!eih!ei#o!ei~Oi#jOc#Vy!O#Vy!T#Vy!^#Vy!h#Vy!k#Vy!o#Vy!t#Vy!x#Vy#S#Vy#f#Vy#l#Vy#m#Vy#n#Vy~Oi#jOc#Wy!O#Wy!T#Wy!^#Wy!h#Wy!k#Wy!o#Wy!t#Wy!x#Wy#S#Wy#f#Wy#l#Wy#m#Wy#n#Wy~O#{%]Oc#Xyi#Xy!O#Xy!T#Xy!^#Xy!h#Xy!k#Xy!o#Xy!t#Xy!x#Xy#S#Xy#f#Xy#l#Xy#m#Xy#n#Xy~O['jO~P! ZOh'nO#kzO~O#t'oOUoi#koi~O['pO~O#t'rOUXqYXq~Om{O#t'rOUXqYXq~O#{&tOc!v!Ri!v!R!O!v!R!T!v!R!^!v!R!h!v!R!k!v!R!o!v!R!t!v!R!x!v!R#S!v!R#f!v!R#l!v!R#m!v!R#n!v!R~Om{Oc!cih!ci#k!ci~O#o'wO~Om{Oc!eq{!eq!z!eq#k!eqh!eq#o!eq~O#r'UO~P!/eO#t'zOY#^X[#^X]#^Xa#^Xb#^Xc#^Xd#^Xe#^Xf#^Xi#^X~O['|O~P! ZO#o'}O~Oh(PO#kzO~O#t(QOUXyYXy~O#{&tOc!v!Zi!v!Z!O!v!Z!T!v!Z!^!v!Z!h!v!Z!k!v!Z!o!v!Z!t!v!Z!x!v!Z#S!v!Z#f!v!Z#l!v!Z#m!v!Z#n!v!Z~Om{Oc!cqh!cq#k!cq~Om{Oc!ey{!ey!z!ey#k!eyh!ey#o!ey~Om{Oc!cyh!cy#k!cy~O#t(WOh#ui#k#ui~Odefe~",
  goto: ":k$OPPP$P$T$[PP&d&jP&nPP'Z'd'mPPPPPP'vPP'v'}*|P,T,_,c,g-k-o-s-w-o.O-o.U.[P$P.oP.s.w.{/bP/l/|.w0P0TP0P0ZP0e0wP1P2T2X2e0P2nP0P2xP3S0P3dP3n4O0P4SP4^.w4nP4uP5P5]5i5i.s5q5uP5q5y5y5y5y5y5y5}6T6Z6a6g7r7x8O8U8cPPP8i8mPPPPP8qPP9WP9eP8m9iP9qP:Z:cTTOgSQOgR#]!VSsPyQ!SQS!TSvQ!dXQ!eYQ!fZQ!g[Q!h]Q#a![Q#b!]Q#c!^Q#d!_Q#e!`Q#f!a^#}!i#g#y$Q%X%c&gQ$X!kQ$Y!lQ$Z!mQ$[!nQ$]!oQ$^!pj$g!z#i#s$k$r%V%]%d&R&e&s'_'wS%X#j%[Q%e$OQ&g%YT'k'O'mQ!RQR#Z!ST#V!O#WQ$h!zQ%W#iQ%^#s^&S$k%d&R&e&s'_'wQ&X$rQ&d%VR&j%]_&S$k%d&R&e&s'_'w_&T$k%d&R&e&s'_'wQ'X&UQ'c&rR'y'dZ'P%{&}'U'i'}Q!QQQ!YVQ!utQ!|vS#Y!R!SQ#`!ZQ#m!dQ#q!eQ#t!fQ#x!gQ#|!hQ$W!jS$d!v!xQ$f!yQ$j!}Q$o#ZQ$q#[Q$u#aS$x#b#hS${#c#oQ$}#dQ%P#eQ%R#fQ%n$XQ%q$YQ%t$ZQ%v$[Q%x$]Q%z$^Q&P$eQ&Z$vQ&]$yQ&m%_Q&w%oQ&y%rQ'W&UQ'a&nQ'b&rQ's'XQ'u'^S'x'c'dQ(R'vQ(T'yR(V(S#Z|QVtv}!R!S!Z!d!e!f!g!h!j!v!x!y!}#Z#[#a#b#c#d#e#f#h#o$X$Y$Z$[$]$^$e$v$y%_%o%r&U&l&n&r'X'^'c'd'v'y(SQ!vtS#S{&kR$e!xT$a!s$bT$`!s$bSROgQ!PQQ!ttQ!{vU#X!Q!R!SU$c!u!v!xS$i!|!}S$n#Y#ZQ$p#[S&O$d$eQ&Q$jQ&V$oQ&W$qR'R&PTxPyTwPyTuPyStPyR!xuQ!USR!yvQ!}vR#[!US!zv!UQ$R!iU%S#g$S$TS&b%T%UR']&cTSOgTdOgT`OgSWOg^$O!i#g#y$Q%X%c&gS%Y#j%[T%`#u%bSVOgQ!ZWR!jaQ!XVS#_!Y!ZQ$V!jQ$t#`R%m$WR#^!VT^OgQ![WR!kaSXOgQ!]WR!laQ#h!dQ#o!eQ$v#bQ$y#cQ%o$YR%r$Z]#i!d!e#b#c$Y$ZQ#l!dQ#p!eU$w#b#h#mU$z#c#o#qQ%p$YQ%s$ZS&Y$v$xS&[$y${S&v%o%qS&x%r%tQ'Y&ZQ'Z&]Q'f&wR'g&yT%Z#j%[Q$T!iQ%U#gQ&f%XR'`&g_$P!i#g#y$Q%X%c&gSYOgQ!^WR!maSZOgQ!_WR!naQ#r!fS$|#d#tQ%u$[Q&^$}R&z%vS[OgQ!`WR!oaQ#w!gS%O#e#xQ%w$]Q&_%PR&{%xT%a#u%bS]OgQ!aWR!paQ#{!hS%Q#f#|Q%y$^Q&`%RR&|%zS_OgR!bWQ$S!iS%T#g$TR&c%UQ%j$RQ&a%SQ'[&bR't']W%k$R%S&b']Q&u%lR'e&t]%i$R%S%l&b&t']TcOgTaOgTbOgQgOR!qgQ#W!OR$l#WQ'i&}R'{'iQ'm'OR(O'm#Q}QVtv!R!S!Z!d!e!f!g!h!j!v!x!y!}#Z#[#a#b#c#d#e#f#h#o$X$Y$Z$[$]$^$e$v$y%o%r&U&r'X'^'c'd'v'y(SS#T}&lT&l%_&nQ$b!sR%|$bQyPR#QyQ%[#jR&h%[W$Q!i#g%X&gQ%c#yT%f$Q%cQ%b#uR&o%bTfOgTeOgQ&U$kQ&r%dQ'S&RQ'^&eQ'd&sQ'v'_R(S'wQ'Q%{S'h&}'iQ'q'UR(U'}T'l'O'm]!WV!Y!Z!j#`$W}#k!d!e#b#c#h#m#o#q$Y$Z$v$x$y${%o%q%r%t&Z&]&w&y]#v!g#e#x$]%P%x]#z!h#f#|$^%R%z",
  nodeNames: "⚠ Comment Document OperationDefinition OperationType Name ) ( VariableDefinitions VariableDefinition Variable NamedType ] [ ListType NonNullType DefaultValue IntValue FloatValue StringValue BooleanValue NullValue EnumValue ListValue } { ObjectValue Directives Directive DirectiveName Arguments Argument ArgumentAttributeName SelectionSet Selection Field Alias FieldName FragmentSpread FragmentName InlineFragment TypeCondition OnKeyword on FragmentDefinition FragmentKeyword fragment TypeSystemDefinition SchemaDefinition Description SchemaKeyword schema RootTypeDefinition RootOperationTypeDefinition TypeDefinition ScalarTypeDefinition ScalarKeyword scalar ObjectTypeDefinition TypeKeyword type ImplementsInterfaces ImplementsKeyword implements FieldsDefinition FieldDefinition ArgumentsDefinition InputValueDefinition InterfaceTypeDefinition InterfaceKeyword interface UnionTypeDefinition UnionKeyword union UnionMemberTypes EnumTypeDefinition EnumKeyword enum EnumValuesDefinition EnumValueDefinition InputObjectTypeDefinition InputKeyword input InputFieldsDefinition DirectiveDefinition DirectiveKeyword directive RepeatableKeyword repeatable DirectiveLocations DirectiveLocation ExecutableDirectiveLocation TypeSystemDirectiveLocation TypeSystemExtension SchemaExtension ExtendKeyword extend TypeExtension ScalarTypeExtension ObjectTypeExtension InterfaceTypeExtension UnionTypeExtension EnumTypeExtension InputObjectTypeExtension",
  maxTerm: 156,
  nodeProps: [
    ["openedBy", 6,"(",12,"[",24,"{"],
    ["closedBy", 7,")",13,"]",25,"}"]
  ],
  skippedNodes: [0,1],
  repeatNodeCount: 10,
  tokenData: "#Ci~R!XX^$npq$nqr%crs%hst4ptu4{vw5jxy5oyz5t|}5y}!O6O!O!P7g!Q![6U![!]7x!_!`7}!b!c8S!c!d8q!d!g9[!g!hCZ!h!iHd!i!k9[!k!l!/v!l!o9[!o!p!Id!p!q9[!q!r!Mm!r!s9[!s!t#!u!t!u9[!u!v#%d!v!w9[!w!x#0n!x!y#3]!y!}9[!}#O#=[#P#Q#=a#R#S9[#T#Y9[#Y#Z#=f#Z#b9[#b#c#@Q#c#h9[#h#i#BU#i#o9[#o#p#CY#p#q#C_#q#r#Cd#y#z$n$f$g$n#BY#BZ$n$IS$I_$n$I|$JO$n$JT$JU$n$KV$KW$n&FU&FV$n~$sY#h~X^$npq$n#y#z$n$f$g$n#BY#BZ$n$IS$I_$n$I|$JO$n$JT$JU$n$KV$KW$n&FU&FV$n~%hO#q~~%kVOY&QZ]&Q^r&Qrs(as#O&Q#O#P&o#P~&Q~&TVOY&QZ]&Q^r&Qrs&js#O&Q#O#P&o#P~&Q~&oOc~~&rXrs&Q!P!Q&Q#O#P&Q#U#V&Q#Y#Z&Q#b#c&Q#f#g&Q#h#i&Q#i#j'_~'bR!Q!['k!c!i'k#T#Z'k~'nR!Q!['w!c!i'w#T#Z'w~'zR!Q![(T!c!i(T#T#Z(T~(WR!Q![&Q!c!i&Q#T#Z&Q~(fPc~rs(i~(lXOY(iYZ(iZ](i]^)X^r(irs)_s#O(i#O#P)w#P~(i~)[PYZ(i~)bROr(irs)ks~(i~)nROr(irs&js~(i~)zXrs*g!P!Q(i#O#P(i#U#V(i#Y#Z(i#b#c(i#f#g(i#h#i(i#i#j3n~*jXOY(iYZ(iZ](i]^)X^r(irs+Vs#O(i#O#P)w#P~(i~+YROr(irs+cs~(i~+fXOY(iYZ(iZ](i]^(i^r(irs,Rs#O(i#O#P,a#P~(i~,WRc~Or(irs)ks~(i~,dfOY(iYZ(iZ](i]^)X^r(irs-xs!P(i!P!Q(i!Q#O(i#O#P,a#P#U(i#U#V(i#V#Y(i#Y#Z(i#Z#b(i#b#c(i#c#f(i#f#g(i#g#h(i#h#i(i#i#j/f#j~(i~-{XOY(iYZ(iZ](i]^(i^r(irs.hs#O(i#O#P,a#P~(i~.kROr(irs.ts~(i~.yXc~OY(iYZ(iZ](i]^(i^r(irs,Rs#O(i#O#P,a#P~(i~/i_OY(iYZ(iZ](i]^)X^r(irs)_s!Q(i!Q![0h![!c(i!c!i0h!i#O(i#O#P)w#P#T(i#T#Z0h#Z~(i~0k_OY(iYZ(iZ](i]^)X^r(irs)_s!Q(i!Q![1j![!c(i!c!i1j!i#O(i#O#P)w#P#T(i#T#Z1j#Z~(i~1m_OY(iYZ(iZ](i]^)X^r(irs)_s!Q(i!Q![2l![!c(i!c!i2l!i#O(i#O#P)w#P#T(i#T#Z2l#Z~(i~2o_OY(iYZ(iZ](i]^)X^r(irs)_s!Q(i!Q![(i![!c(i!c!i(i!i#O(i#O#P)w#P#T(i#T#Z(i#Z~(i~3qR!Q![3z!c!i3z#T#Z3z~3}R!Q![4W!c!i4W#T#Z4W~4ZR!Q![4d!c!i4d#T#Z4d~4gR!Q![(i!c!i(i#T#Z(i~4uQP~OY4pZ~4p~5OR!c!}5X#R#S5X#T#o5X~5^SY~!Q![5X!c!}5X#R#S5X#T#o5X~5oO#y~~5tOV~~5yOU~~6OO#t~~6RP!Q![6U~6ZSa~!O!P6g!Q![6U!g!h6{#X#Y6{~6jP!Q![6m~6rRb~!Q![6m!g!h6{#X#Y6{~7OR{|7X}!O7X!Q![7_~7[P!Q![7_~7dPb~!Q![7_~7jP!O!P7m~7pP!O!P7s~7xO#v~~7}O#o~~8SO#r~~8VR!c!}8`#R#S8`#T#o8`~8eSm~!Q![8`!c!}8`#R#S8`#T#o8`V8xU#kPfQ!Q![9[!c!t9[!t!u9o!u!}9[#R#S9[#T#o9[R9cS#kPfQ!Q![9[!c!}9[#R#S9[#T#o9[V9vU#kPfQ!Q![9[!c!i9[!i!j:Y!j!}9[#R#S9[#T#o9[V:aU#kPfQ!Q![9[!c!w9[!w!x:s!x!}9[#R#S9[#T#o9[V:zU#kPfQ!Q![9[!c!o9[!o!p;^!p!}9[#R#S9[#T#o9[V;eU#kPfQ!Q![9[!c!g9[!g!h;w!h!}9[#R#S9[#T#o9[V<OU#kPfQ!Q![9[!c!p9[!p!q<b!q!}9[#R#S9[#T#o9[V<iU#kPfQ!Q![9[!c!v9[!v!w<{!w!}9[#R#S9[#T#o9[V=SS#kPfQ!Q![9[!c!}9[#R#S=`#T#o9[V=gU#kPfQ!Q![9[!c!f9[!f!g=y!g!}9[#R#S9[#T#o9[V>QU#kPfQ!Q![9[!c!g9[!g!h>d!h!}9[#R#S9[#T#o9[V>kU#kPfQ!Q![9[!c!h9[!h!i>}!i!}9[#R#S9[#T#o9[V?UU#kPfQ!Q![9[!c!k9[!k!l?h!l!}9[#R#S9[#T#o9[V?oU#kPfQ!Q![9[!c!p9[!p!q@R!q!}9[#R#S9[#T#o9[V@YU#kPfQ!Q![9[!c!k9[!k!l@l!l!}9[#R#S9[#T#o9[V@sU#kPfQ!Q![9[!c!v9[!v!wAV!w!}9[#R#S9[#T#o9[VA^U#kPfQ!Q![9[!c!k9[!k!lAp!l!}9[#R#S9[#T#o9[VAwU#kPfQ!Q![9[!c!q9[!q!rBZ!r!}9[#R#S9[#T#o9[VBbU#kPfQ!Q![9[!c!p9[!p!qBt!q!}9[#R#S9[#T#o9[VB}S$[S#kPfQ!Q![9[!c!}9[#R#S9[#T#o9[VCbU#kPfQ!Q![9[!c!p9[!p!qCt!q!}9[#R#S9[#T#o9[VC{U#kPfQ!Q![9[!c!w9[!w!xD_!x!}9[#R#S9[#T#o9[VDfU#kPfQ!Q![9[!c!o9[!o!pDx!p!}9[#R#S9[#T#o9[VERS$_S#kPfQ!Q![9[!c!}9[#R#SE_#T#o9[VEfU#kPfQ!Q![9[!c!x9[!x!yEx!y!}9[#R#S9[#T#o9[VFPT#kPfQ!Q![9[!c!dF`!d!}9[#R#S9[#T#o9[VFgU#kPfQ!Q![9[!c!n9[!n!oFy!o!}9[#R#S9[#T#o9[VGQU#kPfQ!Q![9[!c!w9[!w!xGd!x!}9[#R#S9[#T#o9[VGkU#kPfQ!Q![9[!c!g9[!g!hG}!h!}9[#R#S9[#T#o9[VHWS$`S#kPfQ!Q![9[!c!}9[#R#S9[#T#o9[VHkW#kPfQ!Q![9[!c!k9[!k!lIT!l!t9[!t!u!#S!u!}9[#R#S9[#T#o9[VI[U#kPfQ!Q![9[!c!g9[!g!hIn!h!}9[#R#S9[#T#o9[VIuU#kPfQ!Q![9[!c!n9[!n!oJX!o!}9[#R#S9[#T#o9[VJ`U#kPfQ!Q![9[!c!f9[!f!gJr!g!}9[#R#S9[#T#o9[VJ{S$RS#kPfQ!Q![9[!c!}9[#R#SKX#T#o9[VK`U#kPfQ!Q![9[!c!f9[!f!gKr!g!}9[#R#S9[#T#o9[VKyU#kPfQ!Q![9[!c!g9[!g!hL]!h!}9[#R#S9[#T#o9[VLdU#kPfQ!Q![9[!c!h9[!h!iLv!i!}9[#R#S9[#T#o9[VL}U#kPfQ!Q![9[!c!k9[!k!lMa!l!}9[#R#S9[#T#o9[VMhU#kPfQ!Q![9[!c!p9[!p!qMz!q!}9[#R#S9[#T#o9[VNRU#kPfQ!Q![9[!c!k9[!k!lNe!l!}9[#R#S9[#T#o9[VNlU#kPfQ!Q![9[!c!v9[!v!w! O!w!}9[#R#S9[#T#o9[V! VU#kPfQ!Q![9[!c!k9[!k!l! i!l!}9[#R#S9[#T#o9[V! pU#kPfQ!Q![9[!c!q9[!q!r!!S!r!}9[#R#S9[#T#o9[V!!ZU#kPfQ!Q![9[!c!p9[!p!q!!m!q!}9[#R#S9[#T#o9[V!!vS$ZS#kPfQ!Q![9[!c!}9[#R#S9[#T#o9[V!#ZT#kPfQ!Q![9[!c!d!#j!d!}9[#R#S9[#T#o9[V!#qU#kPfQ!Q![9[!c!i9[!i!j!$T!j!}9[#R#S9[#T#o9[V!$[U#kPfQ!Q![9[!c!o9[!o!p!$n!p!}9[#R#S9[#T#o9[V!$uU#kPfQ!Q![9[!c!g9[!g!h!%X!h!}9[#R#S9[#T#o9[V!%`U#kPfQ!Q![9[!c!p9[!p!q!%r!q!}9[#R#S9[#T#o9[V!%yU#kPfQ!Q![9[!c!v9[!v!w!&]!w!}9[#R#S9[#T#o9[V!&dS#kPfQ!Q![9[!c!}9[#R#S!&p#T#o9[V!&wW#kPfQ!Q![9[!c!f9[!f!g!'a!g!u9[!u!v!,q!v!}9[#R#S9[#T#o9[V!'hU#kPfQ!Q![9[!c!g9[!g!h!'z!h!}9[#R#S9[#T#o9[V!(RU#kPfQ!Q![9[!c!h9[!h!i!(e!i!}9[#R#S9[#T#o9[V!(lU#kPfQ!Q![9[!c!k9[!k!l!)O!l!}9[#R#S9[#T#o9[V!)VU#kPfQ!Q![9[!c!p9[!p!q!)i!q!}9[#R#S9[#T#o9[V!)pU#kPfQ!Q![9[!c!k9[!k!l!*S!l!}9[#R#S9[#T#o9[V!*ZU#kPfQ!Q![9[!c!v9[!v!w!*m!w!}9[#R#S9[#T#o9[V!*tU#kPfQ!Q![9[!c!k9[!k!l!+W!l!}9[#R#S9[#T#o9[V!+_U#kPfQ!Q![9[!c!q9[!q!r!+q!r!}9[#R#S9[#T#o9[V!+xU#kPfQ!Q![9[!c!p9[!p!q!,[!q!}9[#R#S9[#T#o9[V!,eS$SS#kPfQ!Q![9[!c!}9[#R#S9[#T#o9[V!,xU#kPfQ!Q![9[!c!r9[!r!s!-[!s!}9[#R#S9[#T#o9[V!-cU#kPfQ!Q![9[!c!t9[!t!u!-u!u!}9[#R#S9[#T#o9[V!-|U#kPfQ!Q![9[!c!g9[!g!h!.`!h!}9[#R#S9[#T#o9[V!.gT#kPfQ!Q![9[!c!d!.v!d!}9[#R#S9[#T#o9[V!.}U#kPfQ!Q![9[!c!f9[!f!g!/a!g!}9[#R#S9[#T#o9[V!/jS$TS#kPfQ!Q![9[!c!}9[#R#S9[#T#o9[V!/}U#kPfQ!Q![9[!c!p9[!p!q!0a!q!}9[#R#S9[#T#o9[V!0hY#kPfQ!Q![9[!c!n9[!n!o!1W!o!r9[!r!s!7|!s!v9[!v!w!Et!w!}9[#R#S9[#T#o9[V!1_U#kPfQ!Q![9[!c!k9[!k!l!1q!l!}9[#R#S9[#T#o9[V!1xU#kPfQ!Q![9[!c!p9[!p!q!2[!q!}9[#R#S9[#T#o9[V!2cU#kPfQ!Q![9[!c!g9[!g!h!2u!h!}9[#R#S9[#T#o9[V!2|S#kPfQ!Q![9[!c!}9[#R#S!3Y#T#o9[V!3aU#kPfQ!Q![9[!c!h9[!h!i!3s!i!}9[#R#S9[#T#o9[V!3zU#kPfQ!Q![9[!c!t9[!t!u!4^!u!}9[#R#S9[#T#o9[V!4eT#kPfQ!Q![9[!c!d!4t!d!}9[#R#S9[#T#o9[V!4{U#kPfQ!Q![9[!c!i9[!i!j!5_!j!}9[#R#S9[#T#o9[V!5fU#kPfQ!Q![9[!c!o9[!o!p!5x!p!}9[#R#S9[#T#o9[V!6PU#kPfQ!Q![9[!c!g9[!g!h!6c!h!}9[#R#S9[#T#o9[V!6jU#kPfQ!Q![9[!c!p9[!p!q!6|!q!}9[#R#S9[#T#o9[V!7TU#kPfQ!Q![9[!c!v9[!v!w!7g!w!}9[#R#S9[#T#o9[V!7pS$US#kPfQ!Q![9[!c!}9[#R#S9[#T#o9[V!8TU#kPfQ!Q![9[!c!w9[!w!x!8g!x!}9[#R#S9[#T#o9[V!8nU#kPfQ!Q![9[!c!v9[!v!w!9Q!w!}9[#R#S9[#T#o9[V!9XS#kPfQ!Q![9[!c!}9[#R#S!9e#T#o9[V!9lW#kPfQ!Q![9[!c!h9[!h!i!:U!i!q9[!q!r!Bl!r!}9[#R#S9[#T#o9[V!:]U#kPfQ!Q![9[!c!k9[!k!l!:o!l!}9[#R#S9[#T#o9[V!:vU#kPfQ!Q![9[!c!g9[!g!h!;Y!h!}9[#R#S9[#T#o9[V!;aU#kPfQ!Q![9[!c!n9[!n!o!;s!o!}9[#R#S9[#T#o9[V!;zU#kPfQ!Q![9[!c!f9[!f!g!<^!g!}9[#R#S9[#T#o9[V!<eS#kPfQ!Q![9[!c!}9[#R#S!<q#T#o9[V!<xU#kPfQ!Q![9[!c!f9[!f!g!=[!g!}9[#R#S9[#T#o9[V!=cU#kPfQ!Q![9[!c!g9[!g!h!=u!h!}9[#R#S9[#T#o9[V!=|U#kPfQ!Q![9[!c!h9[!h!i!>`!i!}9[#R#S9[#T#o9[V!>gU#kPfQ!Q![9[!c!k9[!k!l!>y!l!}9[#R#S9[#T#o9[V!?QU#kPfQ!Q![9[!c!p9[!p!q!?d!q!}9[#R#S9[#T#o9[V!?kU#kPfQ!Q![9[!c!k9[!k!l!?}!l!}9[#R#S9[#T#o9[V!@UU#kPfQ!Q![9[!c!v9[!v!w!@h!w!}9[#R#S9[#T#o9[V!@oU#kPfQ!Q![9[!c!k9[!k!l!AR!l!}9[#R#S9[#T#o9[V!AYU#kPfQ!Q![9[!c!q9[!q!r!Al!r!}9[#R#S9[#T#o9[V!AsU#kPfQ!Q![9[!c!p9[!p!q!BV!q!}9[#R#S9[#T#o9[V!B`S$bS#kPfQ!Q![9[!c!}9[#R#S9[#T#o9[V!BsU#kPfQ!Q![9[!c!d9[!d!e!CV!e!}9[#R#S9[#T#o9[V!C^U#kPfQ!Q![9[!c!l9[!l!m!Cp!m!}9[#R#S9[#T#o9[V!CwU#kPfQ!Q![9[!c!g9[!g!h!DZ!h!}9[#R#S9[#T#o9[V!DbU#kPfQ!Q![9[!c!e9[!e!f!Dt!f!}9[#R#S9[#T#o9[V!D{U#kPfQ!Q![9[!c!v9[!v!w!E_!w!}9[#R#S9[#T#o9[V!EhS$aS#kPfQ!Q![9[!c!}9[#R#S9[#T#o9[V!E{U#kPfQ!Q![9[!c!g9[!g!h!F_!h!}9[#R#S9[#T#o9[V!FfU#kPfQ!Q![9[!c!t9[!t!u!Fx!u!}9[#R#S9[#T#o9[V!GPU#kPfQ!Q![9[!c!h9[!h!i!Gc!i!}9[#R#S9[#T#o9[V!GjT#kPfQ!Q![9[!c!d!Gy!d!}9[#R#S9[#T#o9[V!HQU#kPfQ!Q![9[!c!e9[!e!f!Hd!f!}9[#R#S9[#T#o9[V!HkU#kPfQ!Q![9[!c!g9[!g!h!H}!h!}9[#R#S9[#T#o9[V!IWS$]S#kPfQ!Q![9[!c!}9[#R#S9[#T#o9[V!IkU#kPfQ!Q![9[!c!w9[!w!x!I}!x!}9[#R#S9[#T#o9[V!JUU#kPfQ!Q![9[!c!v9[!v!w!Jh!w!}9[#R#S9[#T#o9[V!JoT#kPfQ!Q![9[!c!d!KO!d!}9[#R#S9[#T#o9[V!KVU#kPfQ!Q![9[!c!v9[!v!w!Ki!w!}9[#R#S9[#T#o9[V!KpU#kPfQ!Q![9[!c!k9[!k!l!LS!l!}9[#R#S9[#T#o9[V!LZU#kPfQ!Q![9[!c!q9[!q!r!Lm!r!}9[#R#S9[#T#o9[V!LtU#kPfQ!Q![9[!c!p9[!p!q!MW!q!}9[#R#S9[#T#o9[V!MaS$PS#kPfQ!Q![9[!c!}9[#R#S9[#T#o9[V!MtU#kPfQ!Q![9[!c!d9[!d!e!NW!e!}9[#R#S9[#T#o9[V!N_U#kPfQ!Q![9[!c!l9[!l!m!Nq!m!}9[#R#S9[#T#o9[V!NxU#kPfQ!Q![9[!c!g9[!g!h# [!h!}9[#R#S9[#T#o9[V# cU#kPfQ!Q![9[!c!e9[!e!f# u!f!}9[#R#S9[#T#o9[V# |U#kPfQ!Q![9[!c!v9[!v!w#!`!w!}9[#R#S9[#T#o9[V#!iS$YS#kPfQ!Q![9[!c!}9[#R#S9[#T#o9[V#!|U#kPfQ!Q![9[!c!w9[!w!x##`!x!}9[#R#S9[#T#o9[V##gU#kPfQ!Q![9[!c!g9[!g!h##y!h!}9[#R#S9[#T#o9[V#$QU#kPfQ!Q![9[!c!t9[!t!u#$d!u!}9[#R#S9[#T#o9[V#$kU#kPfQ!Q![9[!c!{9[!{!|#$}!|!}9[#R#S9[#T#o9[V#%WS$OS#kPfQ!Q![9[!c!}9[#R#S9[#T#o9[V#%kW#kPfQ!Q![9[!c!e9[!e!f#&T!f!w9[!w!x#*s!x!}9[#R#S9[#T#o9[V#&[V#kPfQ!Q![9[!c!d#&q!d!j9[!j!k#(r!k!}9[#R#S9[#T#o9[V#&xU#kPfQ!Q![9[!c!n9[!n!o#'[!o!}9[#R#S9[#T#o9[V#'cT#kPfQ!Q![9[!c!d#'r!d!}9[#R#S9[#T#o9[V#'yU#kPfQ!Q![9[!c!t9[!t!u#(]!u!}9[#R#S9[#T#o9[V#(fS$XS#kPfQ!Q![9[!c!}9[#R#S9[#T#o9[V#(yU#kPfQ!Q![9[!c!g9[!g!h#)]!h!}9[#R#S9[#T#o9[V#)dU#kPfQ!Q![9[!c!o9[!o!p#)v!p!}9[#R#S9[#T#o9[V#)}T#kPfQ!Q![9[!c!d#*^!d!}9[#R#S9[#T#o9[V#*gS$WS#kPfQ!Q![9[!c!}9[#R#S9[#T#o9[V#*zU#kPfQ!Q![9[!c!d9[!d!e#+^!e!}9[#R#S9[#T#o9[V#+eU#kPfQ!Q![9[!c!u9[!u!v#+w!v!}9[#R#S9[#T#o9[V#,OU#kPfQ!Q![9[!c!e9[!e!f#,b!f!}9[#R#S9[#T#o9[V#,iU#kPfQ!Q![9[!c!t9[!t!u#,{!u!}9[#R#S9[#T#o9[V#-SU#kPfQ!Q![9[!c!k9[!k!l#-f!l!}9[#R#S9[#T#o9[V#-mU#kPfQ!Q![9[!c!r9[!r!s#.P!s!}9[#R#S9[#T#o9[V#.WU#kPfQ!Q![9[!c!v9[!v!w#.j!w!}9[#R#S9[#T#o9[V#.qU#kPfQ!Q![9[!c!k9[!k!l#/T!l!}9[#R#S9[#T#o9[V#/[U#kPfQ!Q![9[!c!q9[!q!r#/n!r!}9[#R#S9[#T#o9[V#/uU#kPfQ!Q![9[!c!p9[!p!q#0X!q!}9[#R#S9[#T#o9[V#0bS$QS#kPfQ!Q![9[!c!}9[#R#S9[#T#o9[V#0uU#kPfQ!Q![9[!c!p9[!p!q#1X!q!}9[#R#S9[#T#o9[V#1`U#kPfQ!Q![9[!c!k9[!k!l#1r!l!}9[#R#S9[#T#o9[V#1yU#kPfQ!Q![9[!c!q9[!q!r#2]!r!}9[#R#S9[#T#o9[V#2dU#kPfQ!Q![9[!c!p9[!p!q#2v!q!}9[#R#S9[#T#o9[V#3PS$^S#kPfQ!Q![9[!c!}9[#R#S9[#T#o9[V#3dT#kPfQ!Q![9[!c!d#3s!d!}9[#R#S9[#T#o9[V#3zU#kPfQ!Q![9[!c!t9[!t!u#4^!u!}9[#R#S9[#T#o9[V#4eU#kPfQ!Q![9[!c!k9[!k!l#4w!l!}9[#R#S9[#T#o9[V#5OT#kPfQ!Q![9[!c!d#5_!d!}9[#R#S9[#T#o9[V#5fU#kPfQ!Q![9[!c!d9[!d!e#5x!e!}9[#R#S9[#T#o9[V#6PU#kPfQ!Q![9[!c!n9[!n!o#6c!o!}9[#R#S9[#T#o9[V#6jU#kPfQ!Q![9[!c!g9[!g!h#6|!h!}9[#R#S9[#T#o9[V#7TS#kPfQ!Q![9[!c!}9[#R#S#7a#T#o9[V#7hU#kPfQ!Q![9[!c!f9[!f!g#7z!g!}9[#R#S9[#T#o9[V#8RU#kPfQ!Q![9[!c!g9[!g!h#8e!h!}9[#R#S9[#T#o9[V#8lU#kPfQ!Q![9[!c!h9[!h!i#9O!i!}9[#R#S9[#T#o9[V#9VU#kPfQ!Q![9[!c!k9[!k!l#9i!l!}9[#R#S9[#T#o9[V#9pU#kPfQ!Q![9[!c!p9[!p!q#:S!q!}9[#R#S9[#T#o9[V#:ZU#kPfQ!Q![9[!c!k9[!k!l#:m!l!}9[#R#S9[#T#o9[V#:tU#kPfQ!Q![9[!c!v9[!v!w#;W!w!}9[#R#S9[#T#o9[V#;_U#kPfQ!Q![9[!c!k9[!k!l#;q!l!}9[#R#S9[#T#o9[V#;xU#kPfQ!Q![9[!c!q9[!q!r#<[!r!}9[#R#S9[#T#o9[V#<cU#kPfQ!Q![9[!c!p9[!p!q#<u!q!}9[#R#S9[#T#o9[V#=OS$VS#kPfQ!Q![9[!c!}9[#R#S9[#T#o9[~#=aO]~~#=fO[~R#=mT#kPfQ!Q![9[!c!}9[#R#S9[#T#U#=|#U#o9[R#>TU#kPfQ!Q![9[!c!}9[#R#S9[#T#`9[#`#a#>g#a#o9[R#>nU#kPfQ!Q![9[!c!}9[#R#S9[#T#g9[#g#h#?Q#h#o9[R#?XU#kPfQ!Q![9[!c!}9[#R#S9[#T#X9[#X#Y#?k#Y#o9[R#?tS#kPdQfQ!Q![9[!c!}9[#R#S9[#T#o9[R#@XU#kPfQ!Q![9[!c!}9[#R#S9[#T#i9[#i#j#@k#j#o9[R#@rU#kPfQ!Q![9[!c!}9[#R#S9[#T#`9[#`#a#AU#a#o9[R#A]U#kPfQ!Q![9[!c!}9[#R#S9[#T#`9[#`#a#Ao#a#o9[R#AxS#kPeQfQ!Q![9[!c!}9[#R#S9[#T#o9[R#B]U#kPfQ!Q![9[!c!}9[#R#S9[#T#f9[#f#g#Bo#g#o9[R#BvU#kPfQ!Q![9[!c!}9[#R#S9[#T#i9[#i#j#?Q#j#o9[~#C_Oi~~#CdO#{~~#CiOh~",
  tokenizers: [0, 1, 2],
  topRules: {"Document":[0,2]},
  specialized: [{term: 119, get: value => spec_name[value] || -1}],
  tokenPrec: 2989
});

const nodesWithBraces = 'RootTypeDefinition InputFieldsDefinition EnumValuesDefinition FieldsDefinition SelectionSet { }';
const keywords = 'scalar type interface union enum input implements fragment extend schema directive on repeatable';
const punctuations = '( ) { } : [ ]';
const graphqlLanguage = /*@__PURE__*/LRLanguage.define({
    parser: /*@__PURE__*/parser.configure({
        props: [
            /*@__PURE__*/styleTags({
                Variable: tags.variableName,
                BooleanValue: tags.bool,
                Description: tags.string,
                StringValue: tags.string,
                Comment: tags.lineComment,
                IntValue: tags.integer,
                FloatValue: tags.float,
                EnumValue: /*@__PURE__*/tags.special(tags.name),
                NullValue: tags.null,
                DirectiveName: tags.modifier,
                [keywords]: tags.keyword,
                OperationType: tags.definitionKeyword,
                FieldName: tags.propertyName,
                Field: tags.propertyName,
                ArgumentAttributeName: tags.attributeName,
                Name: tags.atom,
                '( )': tags.paren,
                '{ }': tags.brace,
                ',': tags.separator,
                [punctuations]: tags.punctuation,
            }),
            // https://codemirror.net/docs/ref/#language.indentNodeProp
            /*@__PURE__*/indentNodeProp.add({
                [nodesWithBraces]: /*@__PURE__*/delimitedIndent({ closing: '}', align: true }),
            }),
            /*@__PURE__*/foldNodeProp.add({
                [nodesWithBraces]: foldInside,
            }),
        ],
    }),
    languageData: {
        commentTokens: { line: '#' },
        indentOnInput: /^\s*(\{|\})$/,
    },
});

const defaultOpts = {
    showErrorOnInvalidSchema: true,
};

const stateExtensions = (schema, opts) => [
    schemaStateField.init(() => schema),
    optionsStateField.init(() => (Object.assign(Object.assign({}, defaultOpts), opts))),
];

const AUTOCOMPLETE_CHARS = /^[a-zA-Z0-9_@(]$/;
const completion = /*@__PURE__*/graphqlLanguage.data.of({
    autocomplete(ctx) {
        const schema = getSchema(ctx.state);
        const opts = getOpts(ctx.state);
        if (!schema) {
            return null;
        }
        const word = ctx.matchBefore(/\w*/);
        if (!word) {
            return null;
        }
        const lastWordChar = word.text.split('').pop();
        if (!AUTOCOMPLETE_CHARS.test(lastWordChar) && !ctx.explicit) {
            return null;
        }
        const val = ctx.state.doc.toString();
        const pos = offsetToPos(ctx.state.doc, ctx.pos);
        const results = getAutocompleteSuggestions(schema, val, pos, undefined, undefined, opts === null || opts === void 0 ? void 0 : opts.autocompleteOptions);
        if (results.length === 0) {
            return null;
        }
        return {
            from: word.from,
            options: results.map(item => {
                return {
                    label: item.label,
                    detail: item.detail || '',
                    info(completionData) {
                        if (opts === null || opts === void 0 ? void 0 : opts.onCompletionInfoRender) {
                            return opts.onCompletionInfoRender(item, ctx, completionData);
                        }
                        if (item.documentation ||
                            (item.isDeprecated && item.deprecationReason)) {
                            const el = document.createElement('div');
                            el.textContent =
                                item.documentation || item.deprecationReason || '';
                            return el;
                        }
                    },
                };
            }),
        };
    },
});

const SEVERITY = ['error', 'warning', 'info'];

const lint = /*@__PURE__*/linter(view => {
    const schema = getSchema(view.state);
    const options = getOpts(view.state);
    if (!schema) {
        return [];
    }
    const validationErrors = validateSchema(schema);
    if (validationErrors.length) {
        if (!(options === null || options === void 0 ? void 0 : options.showErrorOnInvalidSchema)) {
            return [];
        }
        const combinedError = validationErrors.map(error => {
            return error.message;
        });
        return [
            {
                from: 0,
                to: view.state.doc.length,
                severity: 'error',
                message: combinedError.join('\n'),
                actions: [], // TODO:
            },
        ];
    }
    const results = getDiagnostics(view.state.doc.toString(), schema);
    return results
        .map((item) => {
        if (!item.severity || !item.source) {
            return null;
        }
        const calculatedFrom = posToOffset(view.state.doc, new Position(item.range.start.line, item.range.start.character));
        const from = Math.max(0, Math.min(calculatedFrom, view.state.doc.length));
        const calculatedRo = posToOffset(view.state.doc, new Position(item.range.end.line, item.range.end.character - 1));
        const to = Math.min(Math.max(from + 1, calculatedRo), view.state.doc.length);
        return {
            from,
            to: from === to ? to + 1 : to,
            severity: SEVERITY[item.severity - 1],
            // source: item.source, // TODO:
            message: item.message,
            actions: [], // TODO:
        };
    })
        .filter((_) => Boolean(_));
}, {
    needsRefresh(vu) {
        return (vu.startState.field(schemaStateField) !==
            vu.state.field(schemaStateField) ||
            vu.startState.field(optionsStateField) !==
                vu.state.field(optionsStateField));
    },
});
const optionsEffect = /*@__PURE__*/StateEffect.define();

const optionsStateField = /*@__PURE__*/StateField.define({
    create() { },
    update(opts, tr) {
        for (const e of tr.effects) {
            if (e.is(optionsEffect)) {
                return e.value;
            }
        }
        return opts;
    },
});
const schemaEffect = /*@__PURE__*/StateEffect.define();

const schemaStateField = /*@__PURE__*/StateField.define({
    create() { },
    update(schema, tr) {
        for (const e of tr.effects) {
            if (e.is(schemaEffect)) {
                return e.value;
            }
        }
        return schema;
    },
});

class Position {
    constructor(line, character) {
        this.line = line;
        this.character = character;
    }
    setLine(line) {
        this.line = line;
    }
    setCharacter(character) {
        this.character = character;
    }
    lessThanOrEqualTo(position) {
        return (this.line < position.line ||
            (this.line === position.line && this.character <= position.character));
    }
}

function posToOffset(doc, pos) {
    return doc.line(pos.line + 1).from + pos.character;
}
function offsetToPos(doc, offset) {
    const line = doc.lineAt(offset);
    return new Position(line.number - 1, offset - line.from);
}

const getSchema = (state) => {
    return state.field(schemaStateField);
};

const getOpts = (state) => {
    return state.field(optionsStateField);
};

const isMac = () => /mac/i.test(navigator.platform);
const isMetaKeyPressed = (e) => isMac() ? e.metaKey : e.ctrlKey;

const jump = /*@__PURE__*/EditorView.domEventHandlers({
    click(evt, view) {
        var _a, _b, _c;
        const schema = getSchema(view.state);
        if (!schema) {
            return;
        }
        // TODO: Set class on cm-editor when mod key is pressed, to style cursor and tokens
        const currentPosition = view.state.selection.main.head;
        const pos = offsetToPos(view.state.doc, currentPosition);
        const token = getTokenAtPosition(view.state.doc.toString(), pos);
        const tInfo = getTypeInfo(schema, token.state);
        const opts = getOpts(view.state);
        if ((opts === null || opts === void 0 ? void 0 : opts.onShowInDocs) && isMetaKeyPressed(evt)) {
            opts.onShowInDocs((_a = tInfo.fieldDef) === null || _a === void 0 ? void 0 : _a.name, (_b = tInfo.type) === null || _b === void 0 ? void 0 : _b.toString(), (_c = tInfo.parentType) === null || _c === void 0 ? void 0 : _c.toString());
        }
    },
});
  
function graphqlLanguageSupport() {
    return new LanguageSupport(graphqlLanguage);
}

function graphql(schema?, opts?) {
    return [
        graphqlLanguageSupport(),
        completion,
        lint,
        jump,
        stateExtensions(schema, opts),
    ];
}

export { defaultHighlightStyle, html, json, EditorView, tags, HighlightStyle, lineNumbers, keymap, closeBracketsKeymap, defaultKeymap, searchKeymap, historyKeymap, foldKeymap, completionKeymap, lintKeymap, crosshairCursor, highlightActiveLine, highlightSelectionMatches,  indentOnInput, syntaxHighlighting, bracketMatching, closeBrackets, autocompletion, rectangularSelection, highlightActiveLineGutter, highlightSpecialChars, history, foldGutter, drawSelection, dropCursor, EditorState };
