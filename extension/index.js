"use strict";(()=>{var r={method:"GET"},u=e=>{try{return new URL(e),!0}catch{return!1}},s=()=>{var n;let e=document.querySelector("#url-input"),t=(n=e==null?void 0:e.value)!=null?n:"";if(u(t)){let o=new Request(t,r);fetch(o).then(()=>console.log("sent"));return}console.log("invalid url")};document.addEventListener("DOMContentLoaded",()=>{let e=document.getElementById("send-button");e==null||e.addEventListener("click",s)});})();
