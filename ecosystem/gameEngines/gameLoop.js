class MainGame{
	constructor(){
		this.construct_Classes();
		this.construct_Consts();
		this.construct_Vars();
		this.construct_defaultSettings();
	}
	construct_defaultSettings(){
		this.updates=[];
	}
	construct_Classes(){
	
	}
	//classes
	Script=class{
		constructor(func,layer){
			this.func=func;
			this.layer=layer;
		}
	}
	Event=class{
		constructor(layer){
			this.itter=this.onStart();
			this.triggers=[];
			this.listeners=[];
			this.done=true;
		}
		*generator(){
			for (let i=0;i<this.updateLength&&i<this.updates.length;i++) {
				let script=this.updates.shift();
				val=script.next(i,);
				if(!val.done)this.updates.push(script);
			}
			yield;
		}
		onStart(){
			this.itter=this.generator();
		}
	}

	construct_Consts(){
		this.time=new Time();
		this.frameId=0;
	}
	mainLoop(){
		this.updateLength=this.updates.length;
		let val;
		for (let i=0;i<this.updateLength&&i<this.updates.length;i++) {
			let script=this.updates.shift();
			val=script.next(i,this.updates);
			if(!val.done)this.updates.push(script);
		}
		if(this.updates.length==0)this.endLoop=true;
		Draw.clear();
		//this.layerScript();
		this.time.startLoop();
	};
	async gameLoop(){
		while(!this.endLoop){
			let loopPromise=new Promise((resolve)=>{
				this.frameId=window.requestAnimationFrame(()=>{
					this.mainLoop();resolve();
				});
			});
			await loopPromise;
		}
	}
	construct_Vars(){
		this.updateOrder=[];

		this.layers={};
		this.menuLayers={};//not yet by MainGame class
	}
	start(){
		this.endLoop=false;
		this.gameLoop();//this.frameId=window.requestAnimationFrame(this.mainLoop);
	}
	end(){
		this.endLoop=true;
	}	
}