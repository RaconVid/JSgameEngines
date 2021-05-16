"use strict";
function loga(log="",alertText=""){
	console.error(log);alert(alertText);
};
function importJavascriptFromSrc(...sources){//e.g.
	let scripts={},src,script;
	for(let i of sources){
		src=importJavascriptFromSrc.baseSrc+i;
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