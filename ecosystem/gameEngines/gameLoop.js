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
		this.time.deltaClamp={min:1/120,max:1/15};
	}
	construct_Classes(){
		const mainGameObj=this;
		//V2 0.2.1 gameEngine
			const GeneratorFunction=(function*(){}).constructor;
			this.UpdateScript=class UpdateScript{
				script=()=>{return false;};
				layer;
				//getScript;
				//getLayer;
				isDeleting=false;
				constructor(getLayer,getScript,autoLoad=true){
					//note: getLayer=(l)=>l.update[8]
					//note: getScript=function/iterator/generator
					if(typeof getLayer == 'function'){
						this.getLayer=getLayer;
						this.layer=getLayer(mainGameObj.layers);
					}else{
						this.getLayer=()=>getLayer;
						this.layer=getLayer;
					}
					if(getScript instanceof GeneratorFunction){
						this.getScript=getScript;
						this.script=getScript(this.layer,this);
					}else{
						this.getScript=()=>getScript;
						this.script=getScript;
					}
					if(typeof this.script=='function'){
						this.onUpdate=function(layer,i,pos){
							this.isDeleting=Boolean(this.script(layer,i,pos));
							if(this.isDeleting){this.detach();}
							//if(returns false or 0){delete script}
						}
					}
					else if(getScript instanceof GeneratorFunction){
						this.onUpdate=function(layer,i,pos){
							this.isDeleting=this.script.next(layer,i,pos).done;
							if(this.isDeleting){this.detach();}
							//if(returns false or 0){delete script}
						}
					}
					if(autoLoad)this.attach();
				}
				attach(){
					//this.layer=this.getLayer(mainGameObj.layers);
					this.layer.add(this);return this;
				}
				detach(){
					this.isDeleting=true;
					this.layer.delete(this);//this.deleter();
					return this;
				}
				onUpdate(){
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
				}
				[Symbol.iterator](){
					return 
				}
			};
			this.Script=class Script extends this.UpdateScript{
				constructor(eventGetter,scriptGetter){
					super(eventGetter,scriptGetter,false);
				}
				//attach(sprite):sprite,layer,script
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
			this.makeScripts=function makeScripts(scripts,sprite=scripts){
				for(let i in scripts){
					if(scripts.hasOwnProperty(i)){
						let s=scripts[i];
						if(s.onUpdate){//i.e. s instanceof UpdateScript||UpdateLayer 
							scripts[i]=s;
						}
						else{
							let s1=s instanceof Array?[s[0],s[1]]:
							typeof s=='object'?[s.layer,s.script]:0;
							if(s1==0)continue;
							scripts[i]=new mainGameObj.UpdateScript(s1[0],s1[1].bind(sprite),false);
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
};