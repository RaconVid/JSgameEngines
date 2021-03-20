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
		//Version 0.1.0
		this.UpdateScriptV1_0=class{
			constructor(sprite=null,layer=undefined,layer_i=undefined,script=function(layer,layer_i){},addToList=false){//i.e. parent,UpdateLayer
				this.isDeleting=false;
				this.sprite=sprite;
				this.layer=layer;
				if(layer !=undefined){
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
			constructor(getLayer=v=>null,script=function(layer,layer_i){},sprite=null){
				super(sprite,getLayer(),undefined,script);
				this.onUpdate=function(layer,i,pos){
					this.isDeleting=(0===1*this.script(layer,i,pos));
					//if(returns false or 0){delete script}
				}
				this.getLayer=getLayer;
			}
		};
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
	}
	construct_Consts(){
		this.time=new Time();
		this.orderLength=1;
		this.mainLayers={
			update:new this.UpdateLayer(),
			draw:new this.UpdateLayer(),
		}
		this.mainLayers.update.onUpdate=function(){//default function
			this.layerScript();
		};
		this.mainLayers.draw.parent=this;
		this.mainLayers.draw.onUpdate=function(){
			Draw.clear();
			this.layerScript();
			this.parent.time.startLoop();
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