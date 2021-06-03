"use strict";
class GameLoopEngine{
	static init(){
		if(window.MainGame!=void 0){throw "globalVar: redefining global: \"window.MainGame\"";}
		if(window.mg!=void 0){throw "globalVar: redefining global: \"window.mg\"";}
		window.MainGame=new this;
		window.mg=MainGame;
		return MainGame;
	}
	init(){
		return this;
	}
	constructor(){
		this.construct_Classes();
		this.construct_Consts();
		this.construct_Vars();
		this.construct_defaultSettings();
		//window.MainGame=new GameLoopEngine();
	}
	construct_defaultSettings(){
		this.layers={
			update:this.mainLayers.update,
			draw:this.mainLayers.draw,
			chunk:this.mainLayers.chunk,
		};
		this.updateOrder=[
			this.layers.update,
			this.layers.draw,
		];
		this.time.deltaClamp={min:1/120,max:1/15};
	}
	construct_Classes(){
		const mainGameObj=this;
		//version numbers are baced on bacwards compatibillity
		//V2 0.2.1 gameEngine
			const GeneratorFunction=(function*(){}).constructor;
			this.UpdateScript=class UpdateScriptV_1_4{//might be V_1_3 idk
				script=()=>{return false;};
				layer;
				//scriptGetter;
				//layerGetter;
				isAttached=false;
				isDeleting=false;
				static get layers(){return this.layers=mainGameObj.layers;}
				static set layers(value){
					Object.defineProperties(this,Object.getOwnPropertyDescriptors({
						layers:value,
					}));
				}
				constructor(getLayer,getScript,autoLoad=true){
					//note: getLayer=(l)=>l.update[8]
					//note: getScript=function/iterator/generator
					if(typeof getLayer == 'function'){
						this.layerGetter=getLayer;
						this.layer=getLayer(this.constructor.layers);
					}else{
						this.layerGetter=()=>getLayer;
						this.layer=getLayer;
					}

					if(getScript instanceof GeneratorFunction){
						this.scriptGetter=getScript;
						this.script=getScript(this.layer,this);
					}else{
						this.scriptGetter=()=>getScript;
						this.script=getScript;
					}

					if(typeof this.script=='function'){
						this.onUpdate=function(layer,self){
							this.isDeleting=Boolean(this.script(layer,self));
							if(this.isDeleting){this.detach();}
							//if(returns false or 0){delete script}
						}
					}
					else if(getScript instanceof GeneratorFunction){
						this.onUpdate=function(layer,self){
							this.isDeleting=this.script.next(layer,self).done;
							if(this.isDeleting){this.detach();}
							//if(returns false or 0){delete script}
						}
					}
					//else this.onUpdate=function(layer,i,pos)
					if(autoLoad)this.attach();
				}
				setLayer(getLayer=this.layerGetter){
					if(typeof getLayer == 'function'){
						this.getLayer=getLayer;
						this.layer=getLayer(mainGameObj.layers);
					}else{
						this.getLayer=()=>getLayer;
						this.layer=getLayer;
					}
					return this;
				}
				setScript(getScript=this.scriptGetter){
					if(getScript instanceof GeneratorFunction){
						this.scriptGetter=getScript;
						this.script=getScript(this.layer,this);
					}else{
						this.scriptGetter=()=>getScript;
						this.script=getScript;
					}
					return this;
				}
				clone(){
					let newObj=new this.constructor(this.layer,this.script,false);
					return newObj;
				}
				attach(){
					//this.layer=this.getLayer(mainGameObj.layers);
					this.layer.add(this);
					this.isAttached=true;
					this.isDeleting=false;
					return this;
				}
				detach(){
					this.isDeleting=true;
					this.layer.delete(this);//this.deleter();
					this.isAttached=false;
					return this;
				}
				onUpdate(updateLayer,updateScript){
					let i=this.script;
					if(!i){}
					else if(typeof i=='function')this.isDeleting=i();
					else if(i.next)return this.isDeleting=i.next().done;//if(i.next()?.done);
					else if(i.onUpdate)i.onUpdate();
					else {
						console.error(this);
						alert("SCRIPT ERROR: failed to run update script");
						throw "UScript Error: \""+typeof this.script+"\" isnt supported;"+
						"\n failed to run UpdateScript";
					}
					return this.isDeleting;
				}
				[Symbol.iterator](){
					return ;
				}
			};
			this.Script=class Script extends this.UpdateScript{
				constructor(eventGetter,scriptGetter){
					super(eventGetter,scriptGetter,false);
				}
				//attach(sprite):sprite,layer,script
			};
			this.UpdateLayer=class UpdateLayerV_1_1 extends Array{
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
						return this.isDeleting;
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
						let index;
						if(typeof item=='number')index=item;
						else index=this.indexOf(item);
						if(index!=-1){
							if(index>this.i){
								this.splice(index,1);
							}else{
								this[index]=undefined;
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
						let deleteScript=false;
						if(!(item==undefined||item.isDeleting)){
							if(typeof item=='function')deleteScript||=item(this,item);
							else if(item.next)deleteScript||=item.next(this,item)?.done;//if(i.next()?.done);
							else if(item.onUpdate)deleteScript||=item.onUpdate(this,item);
							if(item==undefined)deleteScript=true;
							else if(item.isDeleting){
								deleteScript=true;
							}
						}else{deleteScript=true;}
						if(deleteScript){
							this.splice(i,1);
							i--;
						}
					}
					this.i=-1;
				}
				UpdateScript(scriptFunc){
					this(scriptFunc);
				}
			};
			this.UpdateModule=class UpdateModuleV_1_0 extends Set{
				//add,delete,size,for(i of this)
				//get length(){return this.size};
				constructor(activeScripts=[]){
					super(activeScripts);
				}
				parse(){for(let i of this){mainGameObj.makeScripts([i],this)[0];}return this;}
				attach(){for(let i of this){i.attach();}return this;}
				detach(){for(let i of this){i.detach();}return this;}
			};
			this.makeScripts=function makeScriptsV_1_0(scripts,sprite=scripts){
				for(let i in scripts){
					if(scripts.hasOwnProperty(i)){
						let s=scripts[i];
						if(s.onUpdate){//i.e. s instanceof UpdateScript||UpdateLayer 
							scripts[i]=s;
						}
						else{
							let s1=s instanceof Array?[s[0],s[1],s[2]]:
							typeof s=='object'?[s.layer,s.script,s.attach]:0;
							if(s1==0)continue;
							scripts[i]=new mainGameObj.UpdateScript(s1[0],s1[1].bind(sprite),s1[2]);
						}
					}
				}
				return scripts;
			};
			this.makeScript=function makeScriptV_1_0(script,sprite={}){
				let s=script;
				if(s.onUpdate){//i.e. s instanceof UpdateScript||UpdateLayer 
					return s;
				}
				else{
					let s1=s instanceof Array?[s[0],s[1],s[2]]:
					typeof s=='object'?[s.layer,s.script,s.attach]:0;
					if(s1==0)return s;
					return new mainGameObj.UpdateScript(s1[0],sprite?s1[1]:s1[1].bind(sprite),s1[2]);
				}
			}
	}
	construct_Consts(){
		this.time=new Time();
		this.orderLength=1;
		this.mainLayers={
			update:new this.UpdateLayer(20),
			draw:new this.UpdateLayer(20),
			chunk:new this.UpdateLayer(4),//for storing sprites
		}
		this.mainLayers.update.onUpdate=function(){//default function
			this.layerScript();
		};
		this.mainLayers.draw.parent=this;
		this.mainLayers.draw.onUpdate=function(){
			Draw.clear();
			this.layerScript();
			const time=this.parent.time;
			time.startLoop();
			time.realDelta=time.delta;
			time.delta=Math.clamp(1/120,1/15,time.delta)
		};
		this.mainLayers.chunk.onUpdate=function(){
			Draw.clear();
			this.layerScript();
			const time=this.parent.time;
			time.startLoop();
			time.realDelta=time.delta;
			time.delta=Math.clamp(1/120,1/15,time.delta)
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
		this.menuLayers={};//not yet used by MainGame class
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
};GameLoopEngine.init();