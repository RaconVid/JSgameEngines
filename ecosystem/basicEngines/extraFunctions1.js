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
function classToFunction(classObj,constructor){
	constructor??=function(...args){
		return new classObj(...args);
	};
	let newFunction={[classObj.name]:constructor}[classObj.name];
	Object.defineProperties(newFunction,Object.getOwnPropertyDescriptors(classObj));
	newFunction.prototype.constructor=newFunction;
	return newFunction;
};
function fastSet(arry){//not finished
	//can only store objects.
	this.array=arry;
	this.indexSymbol=Symbol("index");
	return 
};fastSet.prototype={
	...fastSet.prototype,
	get set(){

	},
	add(item){
		if(indexSymbol in item&&item[indexSymbol]!=-1){
			item[indexSymbol]=this.array.length;
			this.array.push(item);
		}
		return this;
	},
	clear(){
		for(let i=0;i<this.array.length;i++){
			
		}
	},
	delete(){},
};
var globalEval=(exp)=>eval(exp);
//importJavascriptFromSrc(
//	"game/player1.js"
//);