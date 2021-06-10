"use strict";
function loga(log="",alertText=""){
    console.error(log);
    alert(alertText);
};
function importJavascriptFromSrc(...sources){
    // Adds the scripts at sources to the webpage by
    // adding them to the body as inline script elements.
	let scripts={},src,script;
	for(let source of sources){
		src=importJavascriptFromSrc.baseSrc+source;
		script=document.createElement('SCRIPT');
		script.src=src;
		document.body.appendChild(script);
		scripts[src]=script;
	}
	return scripts;
};
importJavascriptFromSrc.baseSrc="";
//importJavascriptFromSrc(
//	"game/player1.js"
//);
var globalEval=(exp)=>eval(exp);
