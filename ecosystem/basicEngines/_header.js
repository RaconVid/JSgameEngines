{
	for(let i of [
		"basicEngines/extraFunctions1.js",
		"basicEngines/math.js",
		"basicEngines/gameLoop.js",
		"basicEngines/images.js",
	])
	document.head.appendChild();
	let a=()=>importJavascriptFromSrc(
		//"basicEngines/extraFunctions1.js",
		//"basicEngines/images.js",
		"basicEngines/io.js",
		"basicEngines/JSON++.js",
		"basicEngines/math.js",
		"basicEngines/gameLoop.js",
	);
	if(document.body)a();
	else{
		window.addEventListener("onload",a);
		window.onload=a;
	}
}