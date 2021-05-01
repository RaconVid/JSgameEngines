"use strict";
class MainGame{
	constructor(){
		this.construct_Classes();
		this.construct_Consts();
		this.construct_Vars();
		this.construct_defaultSettings();
	}
	construct_defaultSettings(){
		this.layers={
			update:this.mainLayers.update,
			draw:this.mainLayers.draw,
		};
		this.updateOrder=[
			this.layers.update,
			this.layers.draw,
		];
	}
	construct_Classes(){
		const mainGameObj=this;
		//Version 0.1
			//Version 0.1.0
			this.UpdateScriptV1_0=class{
				constructor(sprite=null,layer=undefined,layer_i=undefined,script=function(layer,layer_i){},addToList=false){//i.e. parent,UpdateLayer
					this.isDeleting=false;
					this.sprite=sprite;
					this.layer=layer;
					if(layer){
						this.attachLayer(layer,layer_i);
					}
					this.script=script;
					//add datachable
					if(addToList&&sprite!=null)if(sprite.updateScriptList!=undefined){sprite.updateScriptList.push(this)}
				}
				attachLayer(layer=this.layer,layer_i){//attach to layer
					if(typeof layer_i=="number"&&layer_i!=NaN){
						layer.list[layer_i]=this;
					}
					else if(layer_i==undefined){
						layer.list.push(this);
					}

				}
				detachLayer(){//detach from Layer
					this.isDeleting=true;//detaching is done by the UpdateLayer
				}
				attachScripts(){
					this.attachLayer();
				}
				detachScripts(){
					this.detachLayer();
				}
				isThisDeleting(layer,layer_i){
					return this.isDeleting;//||this.layer!=layer;
				}
				onUpdate(layer,layer_i){
					this.script(layer,layer_i);
				}
			};
			//Version 0.1.1
			this.UpdateScript=class extends this.UpdateScriptV1_0{
				constructor(getLayer=v=>null,itterScript=(function*(){})(),sprite,autoAdd){
					let layer=getLayer;
					if(typeof getLayer == "function"){
						layer=getLayer(mainGameObj.layers);
					}
					super(sprite,layer,undefined,itterScript,autoAdd);
					if(typeof itterScript=="function")
						this.onUpdate=function(layer,i,pos){
							this.isDeleting=Boolean(this.script(layer,i,pos));
							//if(returns false or 0){delete script}
						}
					else
						this.onUpdate=function(layer,i,pos){
							this.isDeleting=this.script.next(layer,i,pos).done;
							//if(returns false or 0){delete script}
						}
					this.getLayer=getLayer;
				}
				attach(){
					this.layer=this.getLayer(mainGameObj.layers);
				}
				detach(){
					if(this.script.return){
						try{
							this.script.return();
						}catch(error){
							if(error.message!="already executing generator"){
								throw error;
							}
						}
						finally{
							this.isDeleting=true;
						}
					}
					else{
						this.isDeleting=true;
					}
				}
			};
			//Version 0.1.2
			const mainGame=this;
			this.Script=this.UpdateScript;
			//unfinished
			this.Event=class{
				constructor(){

				}
				get list(){return this;}
				*[Symbol.iterator](){
					const list=this;
					while(list.length>0){
						for(let i=0;i<list.length;i++){
							let val=list[i].next();
							if(val.done){list.splice(i,1);}
						}
					}
				}
			}
			this.UpdateLayer=class{
				constructor(onUpdate=()=>{this.layerScript();},list=[]){
					this.onUpdate=onUpdate;
					this.list=list;
					this.isDeleting=false;
				}
				layerScript(){
					let remove=false;

					for (let i = 0; i < this.list.length; i++) {
						if(this.list[i]==undefined)continue;
						if(!this.list[i].isDeleting){//!(removing script)
							this.list[i].onUpdate(this,i);
							if(!this.list[i].isDeleting){
								continue;
							}
						}
						//else : remove script
						this.list[i].isDeleting=false;
						this.list.splice(i,1);
						i--;
					}
				};
			};
			this.RefLinker=class{
				constructor(){
					this.a=null;
					this.b=null;
				}
				detach(){

				}
				attach(){

				}
			};
		//V2 0.2.1 gameEngine
			this.UpdateScript=class UpdateScript{
				deleter=()=>false;
				getEvent;
				getScript;
				isDeleting=false;
				scriptInstance=undefined;
				sprite=undefined;
				constructor(eventGetter,scriptGetter,instaLoad=true){
					//new US(l=>l.draw[4],function*(deleter){...deleter()}))
					this.getEvent=eventGetter||(l=>l.update[8]);
					this.getScript=scriptGetter||((del,script)=>()=>del());
					if(instaLoad){
						this.onLoad();
					}
				}
				bindSprite(sprite){
					this.sprite=sprite;
					sprite.deleteList.add(this);
					return this;
				}
				onUpdate(){
					let i=this.scriptGetter;
					if(!i){}
					else if(typeof i=='function')i();
					else if(i.next)i.next();//if(i.next()?.done);
					else if(i.onUpdate)i.onUpdate();
				}
				onLoad(){
					this.scriptInstance=this.scriptInstance||this.getScript(()=>this.onDelete(),this,this.sprite);
					this.deleter=this.getEvent(mainGame.layers,this,this.sprite).add(this.scriptInstance);
					if(this.sprite){
						this.sprite.loadList.add(this);
						this.sprite.unloadList.add(this);
					}
					return this;
				}
				onUnload(){
					this.deleter();
					this.deleter=()=>false;
					return this;
				}
				onStart(){
					
				}
				onDelete(){
					this.deleter();
					this.scriptInstance=false;
					this.isDeleting=true;
					return this;
				}
				[Symbol.iterator](){
					return {next(){},return(){},throw(){}};
				}
			};
			this.UpdateLayer=class UpdateLayer extends Array{
				i=-1;
				isDeleting=false;
				constructor(length=16){
					if(arguments.length<=1&&typeof length=='number'){
						super(length);
						for(let i=0;i<length;i++){
							this[i]=new this.constructor(0);
						}
					}
					else {
						super(...arguments);
					}
				}
				//events
					onUpdate(){
						this.layerScript();
					}	
					onload(){

					}
					unload(){

					}
					onDelete(){
						if(this.i!=-1&&!this.isDeleting){
							this.clear();
							this.add(()=>this.onDelete());
							this.isDeleting=true;
						}
						else for(let i of this){
							if(i)continue;
							else if(i.onDelete)i.onDelete();
							else if(i.return){
								i.return();
							};
							this.clear();//this.splice(0,this.length);
							//this.isDeleting=false;
						}
					}
				//item handling
					add(item){
						this.push(item);
						return ()=>this.delete(item);
					}
					set(item,newItem){
						let index=this.indexOf(item);
						if(index!=-1){
							this[index]=newItem;
						}
						return ()=>this.delete(newItem);
					}
					delete(item=this.i){
						let index=this.indexOf(item);
						if(index!=-1){
							if(index>this.i){
								this.splice(index,1);
							}else{
								this[i]=undefined;
							}
							return ()=>this.add(item);
						}
						else return false;
					}
					clear(){
						this.splice(0,this.length);
					}
				*iterator(){

				}
				deleteCurrentItem(){
					this[this.i]= undefined;
				}
				layerScript(){
					if(this.isDeleting){return this.onDelete();}
					this.i=0;
					for(let i=0;i<this.length;i++){
						this.i=i;
						let item=this[i];
						if(!(item==undefined||item?.isDeleting)){
							if(typeof item=='function')item(this);
							else if(item.next)item.next(this);//if(i.next()?.done);
							else if(item.onUpdate)item.onUpdate(this);
						}
						if(item==undefined||item?.isDeleting){
							i--;
							this.splice(i,1);
							continue;
						}
					}
					this.i=-1;
				}
				UpdateScript(scriptFunc){
					this(scriptFunc);
				}
			};
			this.makeScripts=function makeScripts(scripts){
				for(let i in scripts){
					if(scripts.hasOwnProperty(i)){
						let s=scripts[i];
						if(s.onUpdate){//i.e. s instanceof UpdateScript||UpdateLayer 
							scripts[i]=s;
						}
						else{
							let s1=s instanceof Array?[s[0],s[1]]:
							typeof s=='object'?[s.layer,s.script]:
							scripts[i]=new mainGameObj.UpdateScript(s1[0],s1[1],false);
						}
					}
				}
				return scripts;
			}
	}
	construct_Consts(){
		this.time=new Time();
		this.orderLength=1;
		this.mainLayers={
			update:new this.UpdateLayer(20),
			draw:new this.UpdateLayer(20),
		}
		this.mainLayers.update.onUpdate=function(){//default function
			this.layerScript();
		};
		this.mainLayers.draw.parent=this;
		this.mainLayers.draw.onUpdate=function(){
			Draw.clear();
			this.layerScript();
			this.parent.time.startLoop();
			this.parent.time.realDelta=this.parent.time.delta;
			this.parent.time.delta=Math.clamp(1/120,1/15,this.parent.time.delta)
		};
		this.frameId=0;
		this.i=0;
		this.mainLoop=()=>{
			if(!this.endLoop){
				this.orderLength=this.updateOrder.length;
				for (let i=0;i<this.orderLength&&i<this.updateOrder.length;i++) {
					this.i=i;
					this.updateOrder[i].onUpdate();
					i=this.i;
				}
			}
		}
	}
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
		this.layers={};
		this.updateOrder=[];
		this.menuLayers={};//not yet by MainGame class
	}
	start(){
		this.endLoop=false;
		this.gameLoop();//this.frameId=window.requestAnimationFrame(this.mainLoop);
	}
	end(){
		window.cancelAnimationFrame(this.frameId);
		this.endLoop=true;
		window.requestAnimationFrame(()=>{
			Draw.clear();
		});
	}
};