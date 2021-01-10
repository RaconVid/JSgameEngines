let mg=new MainGame();
let UpdateScript=function*(){
	let startT=mg.time.start;
	while(mg.time.start-startT<1){
		let time=mg.time.start-startT;
		yield;
	}
	console.error(12345);
	return 42;
}
let script=UpdateScript();
mg.updateOrder.push(function(){script.next();})


mg.start();
