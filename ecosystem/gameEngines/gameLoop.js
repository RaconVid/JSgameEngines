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
		this.UpdateScript=class{
			constructor(sprite=null,layer=undefined,layer_i=undefined,script=function(layer,layer_i){}){//i.e. parent,UpdateLayer
				this.isDeleting=false;
				this.sprite=sprite;
				this.layer=layer;
				this.id=layer_i;
				if(layer !=undefined){
					this.attachLayer(layer,layer_i);
				}
				this.script=script;
			}
			attachLayer(layer=this.layer,layer_i){//attach to layer
				if(typeof layer_i=="number"&&layer_i!=NaN){
					layer.list[layer_i]=this;
					this.id=layer_i;
				}
				else if(layer_i==undefined){
					this.id=layer.list.length
					layer.list.push(this);
				}
			}
			addPassive(){//UNFINNISHED//mode: layer deletes Scripts
				//unknown id
				//known id
				this.detatchLayer=function(id){//ordered
					this.layer.list[this.id]=undefined;
				};
				this.detatchLayer=function(){//unordered
					let carry=this.layer.list.pop();
					if(this.layer.list.length>0){
						this.layer.list[this.id]=carry;
						carry.id=this.id;
					}
					this.id=undefined;
				};
			}
			detatchLayer(){//detatch from Layer
				this.isDeleting=true;//detatching is done by the UpdateLayer
			}
			detatch(){
			}
			isThisDeleting(layer,layer_i){
				return this.isDeleting;//||this.layer!=layer;
			}
			onUpdate(layer,layer_i){
				this.id=layer_i;
				this.script(layer,layer_i);
			}
		}
		this.UpdateLayer=class{
			constructor(onUpdate=()=>{this.layerScript();},list=[]){
				this.onUpdate=onUpdate;
				this.list=list;
				this.isDeleting=false;
				this.modes={
					ordered:true,
					constantIDs:true,
				}
			}
			layerScript(){
				//if list[i]: undefined=deserved space,
				//0==
				let remove=false;
				for (let i = 0; i < this.list.length; i++) {
					if(this.list[i]==undefined)continue;
					if(this.list[i]===1){
						this.list.splice(i,1);
						i--;
						continue;
					}
					if(!this.list[i].isDeleting){//!(removing script)
						this.list[i].onUpdate(this,i);
						if(!this.list[i].isDeleting)continue;
					}
					//else : remove script
					this.list[i].isDeleting=false;
					this.list.splice(i,1);
					i--;
				}
			}
		}
	}
	construct_Consts(){
		this.time=new Time();
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
		this.loop=0;
		this.mainLoop=()=>{
			if(!this.endLoop){
				for (let i = 0; i < this.updateOrder.length; i++) {
					this.updateOrder[i].onUpdate();
				}
				if(!this.endLoop){
					window.cancelAnimationFrame(this.loop);
					this.loop=window.requestAnimationFrame(this.mainLoop);
				}
			}
		}
	}
	construct_Vars(){
		this.layers={};
		this.updateOrder=[];
	}
	start(){
		this.endLoop=false;
		this.loop=window.requestAnimationFrame(this.mainLoop);
	}
	end(){
		window.cancelAnimationFrame(this.loop);
		this.endLoop=true;
		window.requestAnimationFrame(()=>{
			Draw.clear();
		});
	}	
};
Space={
	Entity:class{
		constructor(sprite=null,layer=undefined){
			this.id=NaN;
			this.sprite=sprite;
			this.layer=layer;
			if(layer !=undefined){
				this.attachLayer(layer);
			}
		}
		attachLayer(layer){
			this.id=layer.list.length;
			layer.list.push(this);
		}
		detatchLayer(){
			if(this.id==NaN)return false;
			if(layer.list.length>1){
				layer.list[this.id]=layer.list.pop();
				layer.list[this.id].id=this.id;
			}
			this.id=NaN;
		}
	},
	EntityLayer:class{
		constructor(list=[]){
			this.list=list;
		}
	}
}