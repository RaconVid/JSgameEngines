try{
	baseSrc;
	importJavascriptFromSrc.baseSrc=baseSrc;
}catch(error){}finally{
	delete window.baseSrc;
}
{//images (&maybe sound(both should be in one js file)) has to be done in head
	let script=document.createElement('SCRIPT');
	script.src="basicEngines/images.js";
	document.head.appendChild(script);
}{//extraFunctions1 contains importJavascriptFromSrc
	let script=document.createElement('SCRIPT');
	script.src="basicEngines/extraFunctions1.js";
	document.body.appendChild(script);
}
importJavascriptFromSrc(
	"basicEngines/_header.js",
	"gameEngines/_header.js",
	"game/_header.js",
);