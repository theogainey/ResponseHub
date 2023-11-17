"use strict";(()=>{var Pt=Object.create;var Ue=Object.defineProperty;var Ht=Object.getOwnPropertyDescriptor;var Ct=Object.getOwnPropertyNames;var Ut=Object.getPrototypeOf,Dt=Object.prototype.hasOwnProperty;var Bt=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports);var $t=(e,t,n,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(let g of Ct(t))!Dt.call(e,g)&&g!==n&&Ue(e,g,{get:()=>t[g],enumerable:!(r=Ht(t,g))||r.enumerable});return e};var qt=(e,t,n)=>(n=e!=null?Pt(Ut(e)):{},$t(t||!e||!e.__esModule?Ue(n,"default",{value:e,enumerable:!0}):n,e));var it=Bt((Es,at)=>{function We(e){return e instanceof Map?e.clear=e.delete=e.set=function(){throw new Error("map is read-only")}:e instanceof Set&&(e.add=e.clear=e.delete=function(){throw new Error("set is read-only")}),Object.freeze(e),Object.getOwnPropertyNames(e).forEach(t=>{let n=e[t],r=typeof n;(r==="object"||r==="function")&&!Object.isFrozen(n)&&We(n)}),e}var ue=class{constructor(t){t.data===void 0&&(t.data={}),this.data=t.data,this.isMatchIgnored=!1}ignoreMatch(){this.isMatchIgnored=!0}};function Ze(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function P(e,...t){let n=Object.create(null);for(let r in e)n[r]=e[r];return t.forEach(function(r){for(let g in r)n[g]=r[g]}),n}var Jt="</span>",qe=e=>!!e.scope,Qt=(e,{prefix:t})=>{if(e.startsWith("language:"))return e.replace("language:","language-");if(e.includes(".")){let n=e.split(".");return[`${t}${n.shift()}`,...n.map((r,g)=>`${r}${"_".repeat(g+1)}`)].join(" ")}return`${t}${e}`},Ne=class{constructor(t,n){this.buffer="",this.classPrefix=n.classPrefix,t.walk(this)}addText(t){this.buffer+=Ze(t)}openNode(t){if(!qe(t))return;let n=Qt(t.scope,{prefix:this.classPrefix});this.span(n)}closeNode(t){qe(t)&&(this.buffer+=Jt)}value(){return this.buffer}span(t){this.buffer+=`<span class="${t}">`}},Ge=(e={})=>{let t={children:[]};return Object.assign(t,e),t},Re=class e{constructor(){this.rootNode=Ge(),this.stack=[this.rootNode]}get top(){return this.stack[this.stack.length-1]}get root(){return this.rootNode}add(t){this.top.children.push(t)}openNode(t){let n=Ge({scope:t});this.add(n),this.stack.push(n)}closeNode(){if(this.stack.length>1)return this.stack.pop()}closeAllNodes(){for(;this.closeNode(););}toJSON(){return JSON.stringify(this.rootNode,null,4)}walk(t){return this.constructor._walk(t,this.rootNode)}static _walk(t,n){return typeof n=="string"?t.addText(n):n.children&&(t.openNode(n),n.children.forEach(r=>this._walk(t,r)),t.closeNode(n)),t}static _collapse(t){typeof t!="string"&&t.children&&(t.children.every(n=>typeof n=="string")?t.children=[t.children.join("")]:t.children.forEach(n=>{e._collapse(n)}))}},ve=class extends Re{constructor(t){super(),this.options=t}addText(t){t!==""&&this.add(t)}startScope(t){this.openNode(t)}endScope(){this.closeNode()}__addSublanguage(t,n){let r=t.root;n&&(r.scope=`language:${n}`),this.add(r)}toHTML(){return new Ne(this,this.options).value()}finalize(){return this.closeAllNodes(),!0}};function V(e){return e?typeof e=="string"?e:e.source:null}function Xe(e){return B("(?=",e,")")}function en(e){return B("(?:",e,")*")}function tn(e){return B("(?:",e,")?")}function B(...e){return e.map(n=>V(n)).join("")}function nn(e){let t=e[e.length-1];return typeof t=="object"&&t.constructor===Object?(e.splice(e.length-1,1),t):{}}function Ae(...e){return"("+(nn(e).capture?"":"?:")+e.map(r=>V(r)).join("|")+")"}function Ve(e){return new RegExp(e.toString()+"|").exec("").length-1}function sn(e,t){let n=e&&e.exec(t);return n&&n.index===0}var rn=/\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;function Te(e,{joinWith:t}){let n=0;return e.map(r=>{n+=1;let g=n,f=V(r),c="";for(;f.length>0;){let a=rn.exec(f);if(!a){c+=f;break}c+=f.substring(0,a.index),f=f.substring(a.index+a[0].length),a[0][0]==="\\"&&a[1]?c+="\\"+String(Number(a[1])+g):(c+=a[0],a[0]==="("&&n++)}return c}).map(r=>`(${r})`).join(t)}var an=/\b\B/,Ye="[a-zA-Z]\\w*",Le="[a-zA-Z_]\\w*",Je="\\b\\d+(\\.\\d+)?",Qe="(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)",et="\\b(0b[01]+)",cn="!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~",on=(e={})=>{let t=/^#![ ]*\//;return e.binary&&(e.begin=B(t,/.*\b/,e.binary,/\b.*/)),P({scope:"meta",begin:t,end:/$/,relevance:0,"on:begin":(n,r)=>{n.index!==0&&r.ignoreMatch()}},e)},Y={begin:"\\\\[\\s\\S]",relevance:0},ln={scope:"string",begin:"'",end:"'",illegal:"\\n",contains:[Y]},un={scope:"string",begin:'"',end:'"',illegal:"\\n",contains:[Y]},gn={begin:/\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/},de=function(e,t,n={}){let r=P({scope:"comment",begin:e,end:t,contains:[]},n);r.contains.push({scope:"doctag",begin:"[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",end:/(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,excludeBegin:!0,relevance:0});let g=Ae("I","a","is","so","us","to","at","if","in","it","on",/[A-Za-z]+['](d|ve|re|ll|t|s|n)/,/[A-Za-z]+[-][a-z]+/,/[A-Za-z][a-z]{2,}/);return r.contains.push({begin:B(/[ ]+/,"(",g,/[.]?[:]?([.][ ]|[ ])/,"){3}")}),r},dn=de("//","$"),pn=de("/\\*","\\*/"),hn=de("#","$"),fn={scope:"number",begin:Je,relevance:0},En={scope:"number",begin:Qe,relevance:0},bn={scope:"number",begin:et,relevance:0},mn={scope:"regexp",begin:/\/(?=[^/\n]*\/)/,end:/\/[gimuy]*/,contains:[Y,{begin:/\[/,end:/\]/,relevance:0,contains:[Y]}]},_n={scope:"title",begin:Ye,relevance:0},Sn={scope:"title",begin:Le,relevance:0},yn={begin:"\\.\\s*"+Le,relevance:0},Nn=function(e){return Object.assign(e,{"on:begin":(t,n)=>{n.data._beginMatch=t[1]},"on:end":(t,n)=>{n.data._beginMatch!==t[1]&&n.ignoreMatch()}})},le=Object.freeze({__proto__:null,APOS_STRING_MODE:ln,BACKSLASH_ESCAPE:Y,BINARY_NUMBER_MODE:bn,BINARY_NUMBER_RE:et,COMMENT:de,C_BLOCK_COMMENT_MODE:pn,C_LINE_COMMENT_MODE:dn,C_NUMBER_MODE:En,C_NUMBER_RE:Qe,END_SAME_AS_BEGIN:Nn,HASH_COMMENT_MODE:hn,IDENT_RE:Ye,MATCH_NOTHING_RE:an,METHOD_GUARD:yn,NUMBER_MODE:fn,NUMBER_RE:Je,PHRASAL_WORDS_MODE:gn,QUOTE_STRING_MODE:un,REGEXP_MODE:mn,RE_STARTERS_RE:cn,SHEBANG:on,TITLE_MODE:_n,UNDERSCORE_IDENT_RE:Le,UNDERSCORE_TITLE_MODE:Sn});function Rn(e,t){e.input[e.index-1]==="."&&t.ignoreMatch()}function vn(e,t){e.className!==void 0&&(e.scope=e.className,delete e.className)}function Mn(e,t){t&&e.beginKeywords&&(e.begin="\\b("+e.beginKeywords.split(" ").join("|")+")(?!\\.)(?=\\b|\\s)",e.__beforeBegin=Rn,e.keywords=e.keywords||e.beginKeywords,delete e.beginKeywords,e.relevance===void 0&&(e.relevance=0))}function An(e,t){Array.isArray(e.illegal)&&(e.illegal=Ae(...e.illegal))}function Tn(e,t){if(e.match){if(e.begin||e.end)throw new Error("begin & end are not supported with match");e.begin=e.match,delete e.match}}function Ln(e,t){e.relevance===void 0&&(e.relevance=1)}var wn=(e,t)=>{if(!e.beforeMatch)return;if(e.starts)throw new Error("beforeMatch cannot be used with starts");let n=Object.assign({},e);Object.keys(e).forEach(r=>{delete e[r]}),e.keywords=n.keywords,e.begin=B(n.beforeMatch,Xe(n.begin)),e.starts={relevance:0,contains:[Object.assign(n,{endsParent:!0})]},e.relevance=0,delete n.beforeMatch},xn=["of","and","for","in","not","or","if","then","parent","list","value"],On="keyword";function tt(e,t,n=On){let r=Object.create(null);return typeof e=="string"?g(n,e.split(" ")):Array.isArray(e)?g(n,e):Object.keys(e).forEach(function(f){Object.assign(r,tt(e[f],t,f))}),r;function g(f,c){t&&(c=c.map(a=>a.toLowerCase())),c.forEach(function(a){let u=a.split("|");r[u[0]]=[f,In(u[0],u[1])]})}}function In(e,t){return t?Number(t):kn(e)?0:1}function kn(e){return xn.includes(e.toLowerCase())}var je={},D=e=>{console.error(e)},ze=(e,...t)=>{console.log(`WARN: ${e}`,...t)},j=(e,t)=>{je[`${e}/${t}`]||(console.log(`Deprecated as of ${e}. ${t}`),je[`${e}/${t}`]=!0)},ge=new Error;function nt(e,t,{key:n}){let r=0,g=e[n],f={},c={};for(let a=1;a<=t.length;a++)c[a+r]=g[a],f[a+r]=!0,r+=Ve(t[a-1]);e[n]=c,e[n]._emit=f,e[n]._multi=!0}function Pn(e){if(Array.isArray(e.begin)){if(e.skip||e.excludeBegin||e.returnBegin)throw D("skip, excludeBegin, returnBegin not compatible with beginScope: {}"),ge;if(typeof e.beginScope!="object"||e.beginScope===null)throw D("beginScope must be object"),ge;nt(e,e.begin,{key:"beginScope"}),e.begin=Te(e.begin,{joinWith:""})}}function Hn(e){if(Array.isArray(e.end)){if(e.skip||e.excludeEnd||e.returnEnd)throw D("skip, excludeEnd, returnEnd not compatible with endScope: {}"),ge;if(typeof e.endScope!="object"||e.endScope===null)throw D("endScope must be object"),ge;nt(e,e.end,{key:"endScope"}),e.end=Te(e.end,{joinWith:""})}}function Cn(e){e.scope&&typeof e.scope=="object"&&e.scope!==null&&(e.beginScope=e.scope,delete e.scope)}function Un(e){Cn(e),typeof e.beginScope=="string"&&(e.beginScope={_wrap:e.beginScope}),typeof e.endScope=="string"&&(e.endScope={_wrap:e.endScope}),Pn(e),Hn(e)}function Dn(e){function t(c,a){return new RegExp(V(c),"m"+(e.case_insensitive?"i":"")+(e.unicodeRegex?"u":"")+(a?"g":""))}class n{constructor(){this.matchIndexes={},this.regexes=[],this.matchAt=1,this.position=0}addRule(a,u){u.position=this.position++,this.matchIndexes[this.matchAt]=u,this.regexes.push([u,a]),this.matchAt+=Ve(a)+1}compile(){this.regexes.length===0&&(this.exec=()=>null);let a=this.regexes.map(u=>u[1]);this.matcherRe=t(Te(a,{joinWith:"|"}),!0),this.lastIndex=0}exec(a){this.matcherRe.lastIndex=this.lastIndex;let u=this.matcherRe.exec(a);if(!u)return null;let m=u.findIndex((k,T)=>T>0&&k!==void 0),y=this.matchIndexes[m];return u.splice(0,m),Object.assign(u,y)}}class r{constructor(){this.rules=[],this.multiRegexes=[],this.count=0,this.lastIndex=0,this.regexIndex=0}getMatcher(a){if(this.multiRegexes[a])return this.multiRegexes[a];let u=new n;return this.rules.slice(a).forEach(([m,y])=>u.addRule(m,y)),u.compile(),this.multiRegexes[a]=u,u}resumingScanAtSamePosition(){return this.regexIndex!==0}considerAll(){this.regexIndex=0}addRule(a,u){this.rules.push([a,u]),u.type==="begin"&&this.count++}exec(a){let u=this.getMatcher(this.regexIndex);u.lastIndex=this.lastIndex;let m=u.exec(a);if(this.resumingScanAtSamePosition()&&!(m&&m.index===this.lastIndex)){let y=this.getMatcher(0);y.lastIndex=this.lastIndex+1,m=y.exec(a)}return m&&(this.regexIndex+=m.position+1,this.regexIndex===this.count&&this.considerAll()),m}}function g(c){let a=new r;return c.contains.forEach(u=>a.addRule(u.begin,{rule:u,type:"begin"})),c.terminatorEnd&&a.addRule(c.terminatorEnd,{type:"end"}),c.illegal&&a.addRule(c.illegal,{type:"illegal"}),a}function f(c,a){let u=c;if(c.isCompiled)return u;[vn,Tn,Un,wn].forEach(y=>y(c,a)),e.compilerExtensions.forEach(y=>y(c,a)),c.__beforeBegin=null,[Mn,An,Ln].forEach(y=>y(c,a)),c.isCompiled=!0;let m=null;return typeof c.keywords=="object"&&c.keywords.$pattern&&(c.keywords=Object.assign({},c.keywords),m=c.keywords.$pattern,delete c.keywords.$pattern),m=m||/\w+/,c.keywords&&(c.keywords=tt(c.keywords,e.case_insensitive)),u.keywordPatternRe=t(m,!0),a&&(c.begin||(c.begin=/\B|\b/),u.beginRe=t(u.begin),!c.end&&!c.endsWithParent&&(c.end=/\B|\b/),c.end&&(u.endRe=t(u.end)),u.terminatorEnd=V(u.end)||"",c.endsWithParent&&a.terminatorEnd&&(u.terminatorEnd+=(c.end?"|":"")+a.terminatorEnd)),c.illegal&&(u.illegalRe=t(c.illegal)),c.contains||(c.contains=[]),c.contains=[].concat(...c.contains.map(function(y){return Bn(y==="self"?c:y)})),c.contains.forEach(function(y){f(y,u)}),c.starts&&f(c.starts,a),u.matcher=g(u),u}if(e.compilerExtensions||(e.compilerExtensions=[]),e.contains&&e.contains.includes("self"))throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");return e.classNameAliases=P(e.classNameAliases||{}),f(e)}function st(e){return e?e.endsWithParent||st(e.starts):!1}function Bn(e){return e.variants&&!e.cachedVariants&&(e.cachedVariants=e.variants.map(function(t){return P(e,{variants:null},t)})),e.cachedVariants?e.cachedVariants:st(e)?P(e,{starts:e.starts?P(e.starts):null}):Object.isFrozen(e)?P(e):e}var $n="11.9.0",Me=class extends Error{constructor(t,n){super(t),this.name="HTMLInjectionError",this.html=n}},ye=Ze,Ke=P,Fe=Symbol("nomatch"),qn=7,rt=function(e){let t=Object.create(null),n=Object.create(null),r=[],g=!0,f="Could not find the language '{}', did you forget to load/include a language module?",c={disableAutodetect:!0,name:"Plain text",contains:[]},a={ignoreUnescapedHTML:!1,throwUnescapedHTML:!1,noHighlightRe:/^(no-?highlight)$/i,languageDetectRe:/\blang(?:uage)?-([\w-]+)\b/i,classPrefix:"hljs-",cssSelector:"pre code",languages:null,__emitter:ve};function u(s){return a.noHighlightRe.test(s)}function m(s){let o=s.className+" ";o+=s.parentNode?s.parentNode.className:"";let p=a.languageDetectRe.exec(o);if(p){let E=L(p[1]);return E||(ze(f.replace("{}",p[1])),ze("Falling back to no-highlight mode for this block.",s)),E?p[1]:"no-highlight"}return o.split(/\s+/).find(E=>u(E)||L(E))}function y(s,o,p){let E="",S="";typeof o=="object"?(E=s,p=o.ignoreIllegals,S=o.language):(j("10.7.0","highlight(lang, code, ...args) has been deprecated."),j("10.7.0",`Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277`),S=s,E=o),p===void 0&&(p=!0);let v={code:E,language:S};G("before:highlight",v);let A=v.result?v.result:k(v.language,v.code,p);return A.code=v.code,G("after:highlight",A),A}function k(s,o,p,E){let S=Object.create(null);function v(i,l){return i.keywords[l]}function A(){if(!d.keywords){N.addText(_);return}let i=0;d.keywordPatternRe.lastIndex=0;let l=d.keywordPatternRe.exec(_),h="";for(;l;){h+=_.substring(i,l.index);let b=x.case_insensitive?l[0].toLowerCase():l[0],R=v(d,b);if(R){let[I,It]=R;if(N.addText(h),h="",S[b]=(S[b]||0)+1,S[b]<=qn&&(ie+=It),I.startsWith("_"))h+=l[0];else{let kt=x.classNameAliases[I]||I;w(l[0],kt)}}else h+=l[0];i=d.keywordPatternRe.lastIndex,l=d.keywordPatternRe.exec(_)}h+=_.substring(i),N.addText(h)}function re(){if(_==="")return;let i=null;if(typeof d.subLanguage=="string"){if(!t[d.subLanguage]){N.addText(_);return}i=k(d.subLanguage,_,!0,Ce[d.subLanguage]),Ce[d.subLanguage]=i._top}else i=$(_,d.subLanguage.length?d.subLanguage:null);d.relevance>0&&(ie+=i.relevance),N.__addSublanguage(i._emitter,i.language)}function M(){d.subLanguage!=null?re():A(),_=""}function w(i,l){i!==""&&(N.startScope(l),N.addText(i),N.endScope())}function Ie(i,l){let h=1,b=l.length-1;for(;h<=b;){if(!i._emit[h]){h++;continue}let R=x.classNameAliases[i[h]]||i[h],I=l[h];R?w(I,R):(_=I,A(),_=""),h++}}function ke(i,l){return i.scope&&typeof i.scope=="string"&&N.openNode(x.classNameAliases[i.scope]||i.scope),i.beginScope&&(i.beginScope._wrap?(w(_,x.classNameAliases[i.beginScope._wrap]||i.beginScope._wrap),_=""):i.beginScope._multi&&(Ie(i.beginScope,l),_="")),d=Object.create(i,{parent:{value:d}}),d}function Pe(i,l,h){let b=sn(i.endRe,h);if(b){if(i["on:end"]){let R=new ue(i);i["on:end"](l,R),R.isMatchIgnored&&(b=!1)}if(b){for(;i.endsParent&&i.parent;)i=i.parent;return i}}if(i.endsWithParent)return Pe(i.parent,l,h)}function Tt(i){return d.matcher.regexIndex===0?(_+=i[0],1):(Se=!0,0)}function Lt(i){let l=i[0],h=i.rule,b=new ue(h),R=[h.__beforeBegin,h["on:begin"]];for(let I of R)if(I&&(I(i,b),b.isMatchIgnored))return Tt(l);return h.skip?_+=l:(h.excludeBegin&&(_+=l),M(),!h.returnBegin&&!h.excludeBegin&&(_=l)),ke(h,i),h.returnBegin?0:l.length}function wt(i){let l=i[0],h=o.substring(i.index),b=Pe(d,i,h);if(!b)return Fe;let R=d;d.endScope&&d.endScope._wrap?(M(),w(l,d.endScope._wrap)):d.endScope&&d.endScope._multi?(M(),Ie(d.endScope,i)):R.skip?_+=l:(R.returnEnd||R.excludeEnd||(_+=l),M(),R.excludeEnd&&(_=l));do d.scope&&N.closeNode(),!d.skip&&!d.subLanguage&&(ie+=d.relevance),d=d.parent;while(d!==b.parent);return b.starts&&ke(b.starts,i),R.returnEnd?0:l.length}function xt(){let i=[];for(let l=d;l!==x;l=l.parent)l.scope&&i.unshift(l.scope);i.forEach(l=>N.openNode(l))}let ae={};function He(i,l){let h=l&&l[0];if(_+=i,h==null)return M(),0;if(ae.type==="begin"&&l.type==="end"&&ae.index===l.index&&h===""){if(_+=o.slice(l.index,l.index+1),!g){let b=new Error(`0 width match regex (${s})`);throw b.languageName=s,b.badRule=ae.rule,b}return 1}if(ae=l,l.type==="begin")return Lt(l);if(l.type==="illegal"&&!p){let b=new Error('Illegal lexeme "'+h+'" for mode "'+(d.scope||"<unnamed>")+'"');throw b.mode=d,b}else if(l.type==="end"){let b=wt(l);if(b!==Fe)return b}if(l.type==="illegal"&&h==="")return 1;if(_e>1e5&&_e>l.index*3)throw new Error("potential infinite loop, way more iterations than matches");return _+=h,h.length}let x=L(s);if(!x)throw D(f.replace("{}",s)),new Error('Unknown language: "'+s+'"');let Ot=Dn(x),me="",d=E||Ot,Ce={},N=new a.__emitter(a);xt();let _="",ie=0,U=0,_e=0,Se=!1;try{if(x.__emitTokens)x.__emitTokens(o,N);else{for(d.matcher.considerAll();;){_e++,Se?Se=!1:d.matcher.considerAll(),d.matcher.lastIndex=U;let i=d.matcher.exec(o);if(!i)break;let l=o.substring(U,i.index),h=He(l,i);U=i.index+h}He(o.substring(U))}return N.finalize(),me=N.toHTML(),{language:s,value:me,relevance:ie,illegal:!1,_emitter:N,_top:d}}catch(i){if(i.message&&i.message.includes("Illegal"))return{language:s,value:ye(o),illegal:!0,relevance:0,_illegalBy:{message:i.message,index:U,context:o.slice(U-100,U+100),mode:i.mode,resultSoFar:me},_emitter:N};if(g)return{language:s,value:ye(o),illegal:!1,relevance:0,errorRaised:i,_emitter:N,_top:d};throw i}}function T(s){let o={value:ye(s),illegal:!1,relevance:0,_top:c,_emitter:new a.__emitter(a)};return o._emitter.addText(s),o}function $(s,o){o=o||a.languages||Object.keys(t);let p=T(s),E=o.filter(L).filter(ne).map(M=>k(M,s,!1));E.unshift(p);let S=E.sort((M,w)=>{if(M.relevance!==w.relevance)return w.relevance-M.relevance;if(M.language&&w.language){if(L(M.language).supersetOf===w.language)return 1;if(L(w.language).supersetOf===M.language)return-1}return 0}),[v,A]=S,re=v;return re.secondBest=A,re}function J(s,o,p){let E=o&&n[o]||p;s.classList.add("hljs"),s.classList.add(`language-${E}`)}function q(s){let o=null,p=m(s);if(u(p))return;if(G("before:highlightElement",{el:s,language:p}),s.dataset.highlighted){console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.",s);return}if(s.children.length>0&&(a.ignoreUnescapedHTML||(console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."),console.warn("https://github.com/highlightjs/highlight.js/wiki/security"),console.warn("The element with unescaped HTML:"),console.warn(s)),a.throwUnescapedHTML))throw new Me("One of your code blocks includes unescaped HTML.",s.innerHTML);o=s;let E=o.textContent,S=p?y(E,{language:p,ignoreIllegals:!0}):$(E);s.innerHTML=S.value,s.dataset.highlighted="yes",J(s,p,S.language),s.result={language:S.language,re:S.relevance,relevance:S.relevance},S.secondBest&&(s.secondBest={language:S.secondBest.language,relevance:S.secondBest.relevance}),G("after:highlightElement",{el:s,result:S,text:E})}function Q(s){a=Ke(a,s)}let Oe=()=>{H(),j("10.6.0","initHighlighting() deprecated.  Use highlightAll() now.")};function F(){H(),j("10.6.0","initHighlightingOnLoad() deprecated.  Use highlightAll() now.")}let W=!1;function H(){if(document.readyState==="loading"){W=!0;return}document.querySelectorAll(a.cssSelector).forEach(q)}function Z(){W&&H()}typeof window<"u"&&window.addEventListener&&window.addEventListener("DOMContentLoaded",Z,!1);function C(s,o){let p=null;try{p=o(e)}catch(E){if(D("Language definition for '{}' could not be registered.".replace("{}",s)),g)D(E);else throw E;p=c}p.name||(p.name=s),t[s]=p,p.rawDefinition=o.bind(null,e),p.aliases&&te(p.aliases,{languageName:s})}function he(s){delete t[s];for(let o of Object.keys(n))n[o]===s&&delete n[o]}function ee(){return Object.keys(t)}function L(s){return s=(s||"").toLowerCase(),t[s]||t[n[s]]}function te(s,{languageName:o}){typeof s=="string"&&(s=[s]),s.forEach(p=>{n[p.toLowerCase()]=o})}function ne(s){let o=L(s);return o&&!o.disableAutodetect}function fe(s){s["before:highlightBlock"]&&!s["before:highlightElement"]&&(s["before:highlightElement"]=o=>{s["before:highlightBlock"](Object.assign({block:o.el},o))}),s["after:highlightBlock"]&&!s["after:highlightElement"]&&(s["after:highlightElement"]=o=>{s["after:highlightBlock"](Object.assign({block:o.el},o))})}function Ee(s){fe(s),r.push(s)}function be(s){let o=r.indexOf(s);o!==-1&&r.splice(o,1)}function G(s,o){let p=s;r.forEach(function(E){E[p]&&E[p](o)})}function se(s){return j("10.7.0","highlightBlock will be removed entirely in v12.0"),j("10.7.0","Please use highlightElement now."),q(s)}Object.assign(e,{highlight:y,highlightAuto:$,highlightAll:H,highlightElement:q,highlightBlock:se,configure:Q,initHighlighting:Oe,initHighlightingOnLoad:F,registerLanguage:C,unregisterLanguage:he,listLanguages:ee,getLanguage:L,registerAliases:te,autoDetection:ne,inherit:Ke,addPlugin:Ee,removePlugin:be}),e.debugMode=function(){g=!1},e.safeMode=function(){g=!0},e.versionString=$n,e.regex={concat:B,lookahead:Xe,either:Ae,optional:tn,anyNumberOfTimes:en};for(let s in le)typeof le[s]=="object"&&We(le[s]);return Object.assign(e,le),e},z=rt({});z.newInstance=()=>rt({});at.exports=z;z.HighlightJS=z;z.default=z});var Gt=e=>{let{value:t}=e.querySelector(".cmp-url-search-params__input--key");return t!=null?t:""},jt=e=>{let{value:t}=e.querySelector(".cmp-url-search-params__input--value");return t!=null?t:""},zt=e=>[Gt(e),jt(e)],Kt=([e,t])=>!!e,ce=()=>{let e=document.querySelectorAll(".cmp-url-search-params__params-pair"),t=[];for(let n of e.values())t.push(zt(n));return new URLSearchParams(t.filter(Kt))},Ft=()=>{let e=document.createElement("div");return e.classList.add("obj-grid","cmp-url-search-params__params-pair"),e.innerHTML=`
    <div class="obj-grid__half util-margin-right">
      <label class="cmp-url-search-params__label">
        <span>URL Search Parameter Key</span>
        <input class="cmp-url-search-params__input cmp-url-search-params__input--key" type="text" name="header" placeholder="URL Search Parameter Key"/>
      </label>
    </div>
    <div class="obj-grid__half">
      <label class="cmp-url-search-params__label">
        <span>Value</span>
        <input class="cmp-url-search-params__input cmp-url-search-params__input--value" type="text" name="value" placeholder="value"/>
      </label>
    </div>  
  `,e},De=()=>{let e=document.querySelector(".cmp-url-search-params"),t=Ft();e==null||e.append(t)},Wt=e=>{let t=e.querySelectorAll(".cmp-url-search-params__input");if(t.length===0)return!1;for(let n of t.values())if(n.value)return!0;return!1},Be=()=>{let e=document.querySelectorAll(".cmp-url-search-params__params-pair");if(e.length===0){De();return}let t=e[e.length-1];Wt(t)&&De()},Zt=e=>{let t=e.closest(".cmp-url-search-params__params-pair");t==null||t.remove()},Xt=e=>e.classList.contains("cmp-url-search-params__input--key")?".cmp-url-search-params__input--value":".cmp-url-search-params__input--key",Vt=e=>{if(e.value)return!1;let t=e.closest(".cmp-url-search-params__params-pair");return!(t==null?void 0:t.querySelector(Xt(e))).value},Yt=e=>{let t=e,n=e.target;t.key==="Backspace"&&Vt(n)&&(Zt(n),Be())},$e=()=>{let e=document.querySelector(".cmp-url-search-params");e==null||e.addEventListener("input",Be),e==null||e.addEventListener("input",X),e==null||e.addEventListener("keydown",Yt)};var oe=e=>{e.classList.toggle("util-visually-hidden"),setTimeout(()=>{e.classList.toggle("util-visually-hidden")},2e3)};var ct=qt(it(),1);var O=ct.default;function ot(e){let t=e.regex,n="HTTP/([32]|1\\.[01])",r=/[A-Za-z][A-Za-z0-9-]*/,g={className:"attribute",begin:t.concat("^",r,"(?=\\:\\s)"),starts:{contains:[{className:"punctuation",begin:/: /,relevance:0,starts:{end:"$",relevance:0}}]}},f=[g,{begin:"\\n\\n",starts:{subLanguage:[],endsWithParent:!0}}];return{name:"HTTP",aliases:["https"],illegal:/\S/,contains:[{begin:"^(?="+n+" \\d{3})",end:/$/,contains:[{className:"meta",begin:n},{className:"number",begin:"\\b\\d{3}\\b"}],starts:{end:/\b\B/,illegal:/\S/,contains:f}},{begin:"(?=^[A-Z]+ (.*?) "+n+"$)",end:/$/,contains:[{className:"string",begin:" ",end:" ",excludeBegin:!0,excludeEnd:!0},{className:"meta",begin:n},{className:"keyword",begin:"[A-Z]+"}],starts:{end:/\b\B/,illegal:/\S/,contains:f}},e.inherit(g,{relevance:0})]}}O.registerLanguage("http",ot);var Gn=e=>{try{return new URL(e).pathname}catch{return e}},jn=e=>{try{return new URL(e).host}catch{return e}},zn=e=>{let t="";for(let[n,r]of e.entries())t+=`${n}: ${r}
`;return t},lt=()=>{let e=we(),t=pe(),n=ce();return{host:jn(e),path:Gn(e),headers:zn(t),searchParams:n.toString()}},ut=e=>`GET ${e.path}${e.searchParams?`?${e.searchParams}`:""} HTTP/1.1
Host: ${e.host}
${e.headers}`,X=()=>{let e=document.querySelector(".cmp-preview pre code"),t=ut(lt());e.innerHTML=O.highlight(t,{language:"http"}).value},Kn=()=>{let e=document.querySelectorAll(".cmp-preview .cmp-copy-button  .cmp-copy-button__icon"),t=document.querySelector(".cmp-preview .cmp-copy-button");t==null||t.classList.toggle("cmp-copy-button--green"),setTimeout(()=>{t==null||t.classList.toggle("cmp-copy-button--green")},2e3),e.forEach(oe),navigator.clipboard.writeText(ut(lt()))},gt=()=>{let e=document.querySelector(".cmp-preview pre code"),t=`GET  HTTP/1.1
Host: `;e.innerHTML=O.highlight(t,{language:"http"}).value,document.querySelector("#url-input").addEventListener("input",X);let r=document.querySelector(".cmp-preview .cmp-copy-button");r==null||r.addEventListener("click",Kn)};var Fn=e=>{let{value:t}=e.querySelector(".cmp-headers__input--header");return t!=null?t:""},Wn=e=>{let{value:t}=e.querySelector(".cmp-headers__input--value");return t!=null?t:""},Zn=e=>[Fn(e),Wn(e)],Xn=([e,t])=>!!e&&!!t,pe=()=>{let e=document.querySelectorAll(".cmp-headers__header-pair"),t=[];for(let n of e.values())t.push(Zn(n));return new Headers(t.filter(Xn))},Vn=()=>{let e=document.createElement("div");return e.classList.add("obj-grid","cmp-headers__header-pair"),e.innerHTML=`
    <div class="obj-grid__half util-margin-right">
      <label class="cmp-headers__label">
        <span>Header</span>
        <input class="cmp-headers__input cmp-headers__input--header" type="text" name="header" placeholder="header"/>
      </label>
    </div>
    <div class="obj-grid__half">
      <label class="cmp-headers__label">
        <span>Value</span>
        <input class="cmp-headers__input cmp-headers__input--value" type="text" name="value" placeholder="value"/>
      </label>
    </div> 
  `,e},dt=()=>{let e=document.querySelector(".cmp-headers"),t=Vn();e==null||e.append(t)},Yn=e=>{let t=e.querySelectorAll(".cmp-headers__input");if(t.length===0)return!1;for(let n of t.values())if(n.value)return!0;return!1},pt=()=>{let e=document.querySelectorAll(".cmp-headers__header-pair");if(e.length===0){dt();return}let t=e[e.length-1];Yn(t)&&dt()},Jn=e=>{let t=e.closest(".cmp-headers__header-pair");t==null||t.remove()},Qn=e=>e.classList.contains("cmp-headers__input--header")?".cmp-headers__input--value":".cmp-headers__input--header",es=e=>{if(e.value)return!1;let t=e.closest(".cmp-headers__header-pair");return!(t==null?void 0:t.querySelector(Qn(e))).value},ts=e=>{let t=e,n=e.target;t.key==="Backspace"&&es(n)&&(Jn(n),pt())},ht=()=>{let e=document.querySelector(".cmp-headers");e==null||e.addEventListener("input",pt),e==null||e.addEventListener("input",X),e==null||e.addEventListener("keydown",ts)};function ft(e){let t=e.regex,n=t.concat(/[\p{L}_]/u,t.optional(/[\p{L}0-9_.-]*:/u),/[\p{L}0-9_.-]*/u),r=/[\p{L}0-9._:-]+/u,g={className:"symbol",begin:/&[a-z]+;|&#[0-9]+;|&#x[a-f0-9]+;/},f={begin:/\s/,contains:[{className:"keyword",begin:/#?[a-z_][a-z1-9_-]+/,illegal:/\n/}]},c=e.inherit(f,{begin:/\(/,end:/\)/}),a=e.inherit(e.APOS_STRING_MODE,{className:"string"}),u=e.inherit(e.QUOTE_STRING_MODE,{className:"string"}),m={endsWithParent:!0,illegal:/</,relevance:0,contains:[{className:"attr",begin:r,relevance:0},{begin:/=\s*/,relevance:0,contains:[{className:"string",endsParent:!0,variants:[{begin:/"/,end:/"/,contains:[g]},{begin:/'/,end:/'/,contains:[g]},{begin:/[^\s"'=<>`]+/}]}]}]};return{name:"HTML, XML",aliases:["html","xhtml","rss","atom","xjb","xsd","xsl","plist","wsf","svg"],case_insensitive:!0,unicodeRegex:!0,contains:[{className:"meta",begin:/<![a-z]/,end:/>/,relevance:10,contains:[f,u,a,c,{begin:/\[/,end:/\]/,contains:[{className:"meta",begin:/<![a-z]/,end:/>/,contains:[f,c,u,a]}]}]},e.COMMENT(/<!--/,/-->/,{relevance:10}),{begin:/<!\[CDATA\[/,end:/\]\]>/,relevance:10},g,{className:"meta",end:/\?>/,variants:[{begin:/<\?xml/,relevance:10,contains:[u]},{begin:/<\?[a-z][a-z0-9]+/}]},{className:"tag",begin:/<style(?=\s|>)/,end:/>/,keywords:{name:"style"},contains:[m],starts:{end:/<\/style>/,returnEnd:!0,subLanguage:["css","xml"]}},{className:"tag",begin:/<script(?=\s|>)/,end:/>/,keywords:{name:"script"},contains:[m],starts:{end:/<\/script>/,returnEnd:!0,subLanguage:["javascript","handlebars","xml"]}},{className:"tag",begin:/<>|<\/>/},{className:"tag",begin:t.concat(/</,t.lookahead(t.concat(n,t.either(/\/>/,/>/,/\s/)))),end:/\/?>/,contains:[{className:"name",begin:n,relevance:0,starts:m}]},{className:"tag",begin:t.concat(/<\//,t.lookahead(t.concat(n,/>/))),contains:[{className:"name",begin:n,relevance:0},{begin:/>/,relevance:0,endsParent:!0}]}]}}var Et="[A-Za-z$_][0-9A-Za-z$_]*",ns=["as","in","of","if","for","while","finally","var","new","function","do","return","void","else","break","catch","instanceof","with","throw","case","default","try","switch","continue","typeof","delete","let","yield","const","class","debugger","async","await","static","import","from","export","extends"],ss=["true","false","null","undefined","NaN","Infinity"],bt=["Object","Function","Boolean","Symbol","Math","Date","Number","BigInt","String","RegExp","Array","Float32Array","Float64Array","Int8Array","Uint8Array","Uint8ClampedArray","Int16Array","Int32Array","Uint16Array","Uint32Array","BigInt64Array","BigUint64Array","Set","Map","WeakSet","WeakMap","ArrayBuffer","SharedArrayBuffer","Atomics","DataView","JSON","Promise","Generator","GeneratorFunction","AsyncFunction","Reflect","Proxy","Intl","WebAssembly"],mt=["Error","EvalError","InternalError","RangeError","ReferenceError","SyntaxError","TypeError","URIError"],_t=["setInterval","setTimeout","clearInterval","clearTimeout","require","exports","eval","isFinite","isNaN","parseFloat","parseInt","decodeURI","decodeURIComponent","encodeURI","encodeURIComponent","escape","unescape"],rs=["arguments","this","super","console","window","document","localStorage","sessionStorage","module","global"],as=[].concat(_t,bt,mt);function St(e){let t=e.regex,n=(o,{after:p})=>{let E="</"+o[0].slice(1);return o.input.indexOf(E,p)!==-1},r=Et,g={begin:"<>",end:"</>"},f=/<[A-Za-z0-9\\._:-]+\s*\/>/,c={begin:/<[A-Za-z0-9\\._:-]+/,end:/\/[A-Za-z0-9\\._:-]+>|\/>/,isTrulyOpeningTag:(o,p)=>{let E=o[0].length+o.index,S=o.input[E];if(S==="<"||S===","){p.ignoreMatch();return}S===">"&&(n(o,{after:E})||p.ignoreMatch());let v,A=o.input.substring(E);if(v=A.match(/^\s*=/)){p.ignoreMatch();return}if((v=A.match(/^\s+extends\s+/))&&v.index===0){p.ignoreMatch();return}}},a={$pattern:Et,keyword:ns,literal:ss,built_in:as,"variable.language":rs},u="[0-9](_?[0-9])*",m=`\\.(${u})`,y="0|[1-9](_?[0-9])*|0[0-7]*[89][0-9]*",k={className:"number",variants:[{begin:`(\\b(${y})((${m})|\\.)?|(${m}))[eE][+-]?(${u})\\b`},{begin:`\\b(${y})\\b((${m})\\b|\\.)?|(${m})\\b`},{begin:"\\b(0|[1-9](_?[0-9])*)n\\b"},{begin:"\\b0[xX][0-9a-fA-F](_?[0-9a-fA-F])*n?\\b"},{begin:"\\b0[bB][0-1](_?[0-1])*n?\\b"},{begin:"\\b0[oO][0-7](_?[0-7])*n?\\b"},{begin:"\\b0[0-7]+n?\\b"}],relevance:0},T={className:"subst",begin:"\\$\\{",end:"\\}",keywords:a,contains:[]},$={begin:"html`",end:"",starts:{end:"`",returnEnd:!1,contains:[e.BACKSLASH_ESCAPE,T],subLanguage:"xml"}},J={begin:"css`",end:"",starts:{end:"`",returnEnd:!1,contains:[e.BACKSLASH_ESCAPE,T],subLanguage:"css"}},q={begin:"gql`",end:"",starts:{end:"`",returnEnd:!1,contains:[e.BACKSLASH_ESCAPE,T],subLanguage:"graphql"}},Q={className:"string",begin:"`",end:"`",contains:[e.BACKSLASH_ESCAPE,T]},F={className:"comment",variants:[e.COMMENT(/\/\*\*(?!\/)/,"\\*/",{relevance:0,contains:[{begin:"(?=@[A-Za-z]+)",relevance:0,contains:[{className:"doctag",begin:"@[A-Za-z]+"},{className:"type",begin:"\\{",end:"\\}",excludeEnd:!0,excludeBegin:!0,relevance:0},{className:"variable",begin:r+"(?=\\s*(-)|$)",endsParent:!0,relevance:0},{begin:/(?=[^\n])\s/,relevance:0}]}]}),e.C_BLOCK_COMMENT_MODE,e.C_LINE_COMMENT_MODE]},W=[e.APOS_STRING_MODE,e.QUOTE_STRING_MODE,$,J,q,Q,{match:/\$\d+/},k];T.contains=W.concat({begin:/\{/,end:/\}/,keywords:a,contains:["self"].concat(W)});let H=[].concat(F,T.contains),Z=H.concat([{begin:/\(/,end:/\)/,keywords:a,contains:["self"].concat(H)}]),C={className:"params",begin:/\(/,end:/\)/,excludeBegin:!0,excludeEnd:!0,keywords:a,contains:Z},he={variants:[{match:[/class/,/\s+/,r,/\s+/,/extends/,/\s+/,t.concat(r,"(",t.concat(/\./,r),")*")],scope:{1:"keyword",3:"title.class",5:"keyword",7:"title.class.inherited"}},{match:[/class/,/\s+/,r],scope:{1:"keyword",3:"title.class"}}]},ee={relevance:0,match:t.either(/\bJSON/,/\b[A-Z][a-z]+([A-Z][a-z]*|\d)*/,/\b[A-Z]{2,}([A-Z][a-z]+|\d)+([A-Z][a-z]*)*/,/\b[A-Z]{2,}[a-z]+([A-Z][a-z]+|\d)*([A-Z][a-z]*)*/),className:"title.class",keywords:{_:[...bt,...mt]}},L={label:"use_strict",className:"meta",relevance:10,begin:/^\s*['"]use (strict|asm)['"]/},te={variants:[{match:[/function/,/\s+/,r,/(?=\s*\()/]},{match:[/function/,/\s*(?=\()/]}],className:{1:"keyword",3:"title.function"},label:"func.def",contains:[C],illegal:/%/},ne={relevance:0,match:/\b[A-Z][A-Z_0-9]+\b/,className:"variable.constant"};function fe(o){return t.concat("(?!",o.join("|"),")")}let Ee={match:t.concat(/\b/,fe([..._t,"super","import"]),r,t.lookahead(/\(/)),className:"title.function",relevance:0},be={begin:t.concat(/\./,t.lookahead(t.concat(r,/(?![0-9A-Za-z$_(])/))),end:r,excludeBegin:!0,keywords:"prototype",className:"property",relevance:0},G={match:[/get|set/,/\s+/,r,/(?=\()/],className:{1:"keyword",3:"title.function"},contains:[{begin:/\(\)/},C]},se="(\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)|"+e.UNDERSCORE_IDENT_RE+")\\s*=>",s={match:[/const|var|let/,/\s+/,r,/\s*/,/=\s*/,/(async\s*)?/,t.lookahead(se)],keywords:"async",className:{1:"keyword",3:"title.function"},contains:[C]};return{name:"JavaScript",aliases:["js","jsx","mjs","cjs"],keywords:a,exports:{PARAMS_CONTAINS:Z,CLASS_REFERENCE:ee},illegal:/#(?![$_A-z])/,contains:[e.SHEBANG({label:"shebang",binary:"node",relevance:5}),L,e.APOS_STRING_MODE,e.QUOTE_STRING_MODE,$,J,q,Q,F,{match:/\$\d+/},k,ee,{className:"attr",begin:r+t.lookahead(":"),relevance:0},s,{begin:"("+e.RE_STARTERS_RE+"|\\b(case|return|throw)\\b)\\s*",keywords:"return throw case",relevance:0,contains:[F,e.REGEXP_MODE,{className:"function",begin:se,returnBegin:!0,end:"\\s*=>",contains:[{className:"params",variants:[{begin:e.UNDERSCORE_IDENT_RE,relevance:0},{className:null,begin:/\(\s*\)/,skip:!0},{begin:/\(/,end:/\)/,excludeBegin:!0,excludeEnd:!0,keywords:a,contains:Z}]}]},{begin:/,/,relevance:0},{match:/\s+/,relevance:0},{variants:[{begin:g.begin,end:g.end},{match:f},{begin:c.begin,"on:begin":c.isTrulyOpeningTag,end:c.end}],subLanguage:"xml",contains:[{begin:c.begin,end:c.end,skip:!0,contains:["self"]}]}]},te,{beginKeywords:"while if switch catch for"},{begin:"\\b(?!function)"+e.UNDERSCORE_IDENT_RE+"\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)\\s*\\{",returnBegin:!0,label:"func.def",contains:[C,e.inherit(e.TITLE_MODE,{begin:r,className:"title.function"})]},{match:/\.\.\./,relevance:0},be,{match:"\\$"+r,relevance:0},{match:[/\bconstructor(?=\s*\()/],className:{1:"title.function"},contains:[C]},Ee,ne,he,G,{match:/\$[(.]/}]}}function yt(e){let t={className:"attr",begin:/"(\\.|[^\\"\r\n])*"(?=\s*:)/,relevance:1.01},n={match:/[{}[\],:]/,className:"punctuation",relevance:0},r=["true","false","null"],g={scope:"literal",beginKeywords:r.join(" ")};return{name:"JSON",keywords:{literal:r},contains:[t,n,e.QUOTE_STRING_MODE,g,e.C_NUMBER_MODE,e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE],illegal:"\\S"}}O.registerLanguage("xml",ft);O.registerLanguage("javascript",St);O.registerLanguage("json",yt);var K={body:"",language:""},xe=e=>{let t=document.querySelector(".cmp-response__text");t.innerHTML=O.highlight(K.body,{language:e}).value,Rt(e)},is=e=>{var n;return((n=e.headers.get("content-type"))!=null?n:"").includes("application/json")},Rt=e=>{let t=document.querySelector("#json-button"),n=document.querySelector("#json-button input"),r=document.querySelector("#xml-button"),g=document.querySelector("#xml-button input");switch(e){case"json":n.setAttribute("checked",""),t.classList.add("cmp-response__languages-button--active"),r.classList.remove("cmp-response__languages-button--active"),K.language="json";break;case"xml":g.setAttribute("checked",""),r.classList.add("cmp-response__languages-button--active"),t.classList.remove("cmp-response__languages-button--active"),K.language="xml";break;default:g.setAttribute("checked",""),r.classList.add("cmp-response__languages-button--active"),t.classList.remove("cmp-response__languages-button--active"),K.language="xml";break}},cs=e=>()=>{let t=document.querySelectorAll(".cmp-response .cmp-copy-button .cmp-copy-button__icon"),n=document.querySelector(".cmp-response .cmp-copy-button");n==null||n.classList.toggle("cmp-copy-button--green"),setTimeout(()=>{n==null||n.classList.toggle("cmp-copy-button--green")},2e3),t.forEach(oe),navigator.clipboard.writeText(e)},os=e=>{let t=document.querySelector(".cmp-response .cmp-copy-button"),n=document.querySelector(".cmp-response__languages");n==null||n.classList.remove("util-visually-hidden"),t==null||t.classList.remove("util-visually-hidden"),t==null||t.addEventListener("click",cs(e))},Nt=e=>{var r;let t=document.querySelector(".cmp-response__text"),n=O.highlightAuto(e);t.innerHTML=n.value,Rt((r=n.language)!=null?r:"xml"),os(e)},vt=async e=>{if(is(e)){let t=JSON.stringify(await e.json());K.body=t,Nt(t)}else{let t=await e.text();K.body=t,Nt(t)}};var ls={method:"GET"},us=e=>{try{return new URL(e),!0}catch{return!1}},we=()=>{let{value:e}=document.querySelector("#url-input");return e},Mt=()=>{let e=we(),t="http://localhost:3000";if(!us(e)){console.log("invalid url");return}let n=`${t}/?url=${encodeURIComponent(e)}?${ce()}`,r=pe(),g=Object.assign({},ls,{headers:r}),f=new Request(n,g);fetch(f).then(c=>vt(c))};var gs=e=>t=>{let n=t.querySelector("input");n==null||n.addEventListener("change",()=>{var g;document.querySelectorAll(".cmp-options-tabs__tab").forEach(f=>f.classList.remove("cmp-options-tabs__tab--active")),t.classList.add("cmp-options-tabs__tab--active"),e==null||e.setAttribute("data-view",(g=n.getAttribute("value"))!=null?g:"")})},At=()=>{let e=document.querySelector(".obj-options-layout");document.querySelectorAll(".cmp-options-tabs__tab").forEach(gs(e))};document.addEventListener("DOMContentLoaded",()=>{let e=document.getElementById("send-button");e==null||e.addEventListener("click",Mt);let t=document.querySelector("#json-button"),n=document.querySelector("#xml-button");t==null||t.addEventListener("click",()=>xe("json")),n==null||n.addEventListener("click",()=>xe("xml")),At(),gt(),ht(),$e()});})();
