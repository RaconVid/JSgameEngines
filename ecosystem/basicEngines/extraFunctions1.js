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
function classToFunction(classObj){
	let newFunction=function(){
		return new classObj(...args);
	}
	newFunction.name=classObj.name;
	Object.defineProperties(newFunction,Object.getOwnPropertyDescriptors(class1));
	newFunction.prototype.constructor=newFunction;
	return newFunction;
}
importJavascriptFromSrc.baseSrc="";
var globalEval=(exp)=>eval(exp);
//importJavascriptFromSrc(
//	"game/player1.js"
//);
