Images={
	icon:"images/sublimetext.PNG",
	//rock:"images/rock.PNG",
}
//new Promise(function(){
	for(let i in Images){
		let img=new Image();
		img.src=Images[i];
		Images[i]=img;
	}
//});