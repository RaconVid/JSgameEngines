"use strict";
function loga(log="",alertText=""){
	console.error(log);alert(alertText);
}
var scripts;
function importJavascriptFromSrc(...sources){//e.g.
	for(let i of sources){
		let script=document.createElement('SCRIPT');
		script.src=i;
		document.body.appendChild(script);
		scripts=script;
	}
}
//importJavascriptFromSrc(
//	"game/player1.js"
//);