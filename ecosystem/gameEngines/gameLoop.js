class MainGame{
	constructor(){
		this.loop=0;
		this.Update=class{
			constructor(numOfLayers=1,updateName="Update",hasUpdateName="hasUpdate"){
				this.updateName=updateName;
				this.hasUpdateName=hasUpdateName;
				this.layers=[];
				for (let i = 0; i < numOfLayers; i++) {
					this.layers.push([]);
				}
			}
			addSpriteToLayer(sprite,layer){
				if(layer>=this.layers.length){
					for (let i = 0; i < 100&&this.layers.length<=layer&&this.layers.length<100; i++) {
						this.layers.push([]);
					}
				}
				this.layers[layer].push(sprite);
			}
			addSprite(sprite){
				this.addSpriteToLayer(sprite,this.layers.length-1);
			}
			doUpdates(){
				for(let i =0;i<this.layers.length;i++){
					const layer=this.layers[i];
					for(let j =0;j<layer.length;j++){
						let obj=layer[j];
						if(this.updateName in obj&&obj[this.hasUpdateName+"Val"]!==false){
							obj[this.updateName]();
						}
						else{
							layer.splice(j,1);
						}
					}
				}
			}
		};
		this.updates={
			update:new this.Update(1,"Update","hasUpdate"),
			draw:new this.Update(1,"DrawSprite","hasDraw"),
		};
		this.nextId=0;
		this.freeIds=[];
		this.sprites={};
		this.mainLoop=()=>{
			this.time.startLoop();
			Draw.clear();
			this.updates.update.doUpdates();
			this.updates.draw.doUpdates();
			if(!this.endLoop){
				window.requestAnimationFrame(this.mainLoop);
			}
		}
		this.endLoop=false;
		this.time=new Time();
	}
	addId(spriteObj){
		let id;
		if(this.freeIds.length>0){
			id=this.freeIds.shift();
		}
		else{
			id=this.nextId;
			this.nextId++;
		}
		this.sprites[id]=spriteObj;
		spriteObj.id=String(id);
	}
	deleteId(id){
		this.freeIds.push(id);
		delete this.sprites[id];
	}
	start(){
		this.loop=window.requestAnimationFrame(this.mainLoop);
	}
	end(){
		window.cancelAnimationFrame(this.loop);
		this.endLoop=true;
	}
};
