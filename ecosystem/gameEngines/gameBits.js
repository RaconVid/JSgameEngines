Space={
	Entity:class{
		constructor(sprite=null,layer=undefined){
			//Detachable.call(this);
			this.id=NaN;
			this.sprite=sprite;
			this.layer=layer;
			if(layer !=undefined){
				this.attachLayer(layer);
			}
		}
		attachScripts(){
			this.attachLayer();
		}
		detachScripts(){
			this.detachLayer();
		}
		attachLayer(layer=this.layer){
			this.id=layer.list.length;
			layer.list.push(this);
		}
		detachLayer(layer=this.layer){
			if(this.id==NaN)return false;
			if(layer.list.length>1){
				layer.list[this.id]=layer.list.pop();
				layer.list[this.id].id=this.id;
			}
			this.id=NaN;
		}
	},
	Portal:class{
		constructor(layer=[]){
			this.onUpdate=onUpdate;
			this.layer=layer;
			this.matrixPos=[[1,0],[0,1],[0,0]];
			this.camera=null;
			this.type={
				shape:"line",
			};
		}
		addCollider(){}
		giveVecDist(collider){//how long will it take to collide?
			//DE point
			let dif=Math.undotransform()
		}
		giveOnCollide(collider){
			//collider.detachSpace();
			collider.layer=this.camera.layer;
			//collider.coords=Math.transform(Math.undoTransform(collider.coords,this.matrixPos),this.camera.matrixPos);
			//collider.attachSpace();
		}
	},
	Layer:class{
		constructor(list=[]){
			this.onUpdate=onUpdate;
			this.list=list;
		}
		addPlane(){
			this.layers={
				draw:{

				},
			};
		}
	},
}
function Detachable(restart=false){//Deletable.call(sprite)
	if(restart||!("detachScripts"in this))this.detachScripts=function(){//detachScripts
		let list=this.updateScriptList;
		for (var i = 0; i < list.length; i++) {
			if(list[i].detachScripts==undefined)console.log("ERROR:",i,list[i])
			list[i].detachScripts();
		}
	}
	if(restart||!("attachScripts"in this))this.attachScripts=function(){//attachScripts
		let list=this.updateScriptList;
		for (var i = 0; i < list.length; i++) {
			list[i].attachScripts();
		}
	}
	if(restart||!("updateScriptList"in this))this.updateScriptList=[];
	return this;
};
class Camera{
	constructor({matrixPos,}){
		this.matrixPos=matrixPos;
	}
}
function Collider(SpaceLayer=this.SpaceLayer){//spriteRef=Collider.call(sprite).addPhysics(layer...);
	const layers=mainGame.layers;
	this.keywords={
		all:1,
		colour:"#00FF88",
	};
	this.type={
		shape:"circle",
	}
	this.colour=this.keywords.colour;

	this.size=10;
	this.coords=[0,0];
	this.velocity=[0,0];
	this.matrixPos=[[1,0],[0,1],[0,0]];//[rotation,coords]
	this.layer=SpaceLayer;
	Detachable.call(this);
	this.PosisionUpdate = new mainGame.UpdateScript(this,layers.physics.list[7],undefined,()=>{
		this.matrixPos[this.matrixPos.length-1]=this.coords;
	});
	(()=>{//extensions
		this.addDrawing=(colour=this.colour)=>{
			this.colour=colour;
			this.Drawing = new mainGame.UpdateScript(this,layers.draw.list[4],undefined,()=>{
				//ctx.translate(this.coords[0],this.coords[1])
				Draw.transform(this.matrixPos);
				Draw.circle(0,0,this.size,this.colour);
				Draw.undoTransform(this.matrixPos);
				//ctx.translate(-this.coords[0],-this.coords[1])
			});
			this.updateScriptList.push(this.Drawing);
			return this;
		};
		this.addDetector=(triggerKeyWord=["all",1],filter=undefined)=>{//[colour,this.colour]
			if(filter==undefined){
				this.detectorFilter=function(obj){
					if("keywords" in obj)
					if(this.triggerKeyWord[0] in obj.keywords)
					if(obj.keywords[this.triggerKeyWord[0]]==this.triggerKeyWord[1]){
						return this.hitboxScript(obj);
					}
					return false;
				};
			}
			else{
				this.detectorFilter=filter;
			}
			switch(this.type.shape){
				default://i.e. "circle"
					this.hitboxScript=function(obj){
						let dist;
						switch(obj.type.shape){
							case"circle":
								dist= Math.len2(this.coords,obj.coords)-this.size-obj.size;
							break;
							default:
								dist=Infinity;
						}
						if(dist>0){
							return false;
						}
						return true;
					}
				break;
			}
			
			this.keywords.colour=this.colour;
			this.triggerKeyWord=triggerKeyWord;
			this.objsInHitbox=[];
			this.areaDetectorScript = new mainGame.UpdateScript(this,layers.detectors.list[0],undefined,()=>{
				this.objsInHitbox=[];
				for(let i=0;i<this.layer.list.length;i++){
					let obj=this.layer.list[i];
					if(obj==this)continue;
					if(this.detectorFilter(obj)){
						this.objsInHitbox.push(obj)
					}
				}
			});
			this.updateScriptList.push(this.areaDetectorScript);
			return this;
		};
		this.addCamera=(isPlayer=false)=>{
			this.type.camera=true;
			this.viewLayer=layers.draw;
			if(isPlayer){
				this.draw_view = new mainGame.UpdateScript(this,layers.mainDraw.list[4],undefined,function(){
					const sprite=this.sprite;
					ctx.translate(Draw.width/2,Draw.height/2);
					Draw.undoTransform(sprite.matrixPos);
					sprite.viewLayer.onUpdate();
					Draw.transform(sprite.matrixPos);
					ctx.translate(-Draw.width/2,-Draw.height/2);
				});
			}else{
				this.draw_view = new mainGame.UpdateScript(this,layers.mainDraw.list[4],undefined,function(){
					Draw.undoTransform(this.sprite.matrixPos);
					this.sprite.viewLayer.onUpdate();
					Draw.transform(this.sprite.matrixPos);
				});
			}
			this.updateScriptList.push(this.draw_view);
			switch(this.type.shape){
				case"circle":
				this.getSpaceLayers=function(){
					const searchSpaceLayer=(spacelayer,list,)=>{
						for (let i=0;i<spacelayer.length; i++) {
							const obj=spacelayer[i];
							if(obj.type.portal!=undefined)
							if(obj.type.portal.basic1==true){
								//searchSpaceLayer
							}
						}
					}
				}
				break;
			}
			return this;
		};
		this.addPhysics=()=>{
			this.type.physical=1;
			this.mass=1;
			this.Physics=Detachable.call({
				minObj:null,
				minCTime:NaN,
				minDist:NaN,
				isColliding:false,
				newVelocity:Clone(this.velocity),
				reflectVel:()=>{
					//phisics part 2: do collisions + move object
					if(this.Physics.isColliding){
						let obj=this.Physics.minObj;
						this.colour="red";
						switch(obj.type.shape){
							case"circle":
								let dif=Math.minusVec2(Math.addVec2(this.coords,this.velocity),Math.addVec2(obj.coords,obj.velocity));
								let len=Math.len2(dif);
								let vScalers=[[0,0],[0,0]];
								let inf0=0+(this.mass==Infinity||this.type.movable===false);
								let inf1=0+( obj.mass==Infinity|| obj.type.movable===false);
								//calulate new velocity
								if(inf0||inf1){
									vScalers=[
										[
											(inf0-inf1)/1,
											inf1/1,
										],
										[
											(inf1-inf0)/1,
											inf0/1
										],
									];
								}
								else if(this.mass+obj.mass==0){
									vScalers=[
										[
											(this.mass-obj.mass)/1,
											(2*obj.mass)/1
										],
										[
											(obj.mass-this.mass)/1,
											(2*this.mass)/1
										],
									];
								}
								else{
									vScalers=[
										[
											(this.mass-obj.mass)/(this.mass+obj.mass),
											(2*obj.mass)/(this.mass+obj.mass)
										],
										[
											(obj.mass-this.mass)/(obj.mass+this.mass),
											(2*this.mass)/(obj.mass+this.mass)
										],
									];
								}
								let angle=Math.getAngle(dif,0,1);
								let vel1=[
									Math.rotate(this.velocity,-angle,0,1),
									Math.rotate( obj.velocity,-angle,0,1),
								];
								let vel2=[
									vel1[0][0]*vScalers[0][0]+vel1[1][0]*vScalers[0][1],
									vel1[1][0]*vScalers[1][0]+vel1[0][0]*vScalers[1][1],
								];
								vel1[0][0]=vel2[0];
								vel1[1][0]=vel2[1];
								vel1=[
									Math.rotate(vel1[0],angle,0,1),
									Math.rotate(vel1[1],angle,0,1),
								];
								this.velocity=vel1[0];
								obj.velocity=vel1[1];
								if(len<(this.size+obj.size)&&this.type.movable!==false)this.coords=Math.lerpV(this.coords,obj.coords,(len-this.size-obj.size)/len/(1+(obj.type.movable!==false)));
								if(len<(this.size+obj.size)&&obj.type.movable!==false)obj.coords=Math.lerpV(obj.coords,this.coords,(len-this.size-obj.size)/len/(1+(this.type.movable!==false)));
							break;
						}
					}else{
						this.colour=this.keywords.colour;
					}
				},
				findMinObj:()=>{
					this.Physics.newVelocity=[this.velocity[0],this.velocity[1]];
					let minDist=Infinity;//can be -ve (i.e. <0)
					let minCTime=Infinity;//min Collission time how many frames until collision
					let minObj=null;
					//phisics layer 1: get/handle collisions
					for(let i=0;i<this.layer.list.length;i++){
						let obj=this.layer.list[i];
						if(obj==this)continue;
						if(obj.type!=undefined)if(obj.type.shape!=undefined)if(obj.type.physical!=undefined){
							let normal,obj_dist,obj_time,normal2, dif,len;
							switch(obj.type.shape){
								case "circle":
									dif=Math.minusVec2(Math.addVec2(this.coords,this.velocity),Math.addVec2(obj.coords,[0,0]));//obj.velocity));
									len=Math.len2(dif)-(this.size+obj.size);
									if(len<0){
										normal=Math.minusVec2(this.coords,obj.coords);
										obj_dist=Math.len2(normal)-(this.size+obj.size);
										if(obj_dist<len){//collide
											obj_dist=(obj_dist-len);
										}
										else{
											obj_dist=len;
										}
										if(obj_dist<minCTime&&obj_dist<0){
											minCTime=obj_dist;
											minObj=obj;
										}
									}
								break;
								default:
							}
						}
					}
					this.Physics.minObj=minObj;
					this.Physics.minCTime=minCTime;
					this.Physics.isColliding=this.Physics.minObj!=null&&this.Physics.minCTime<1;
					this.Physics.minCTime=this.type.movable===false?1:Math.clamp(0,1,this.Physics.minCTime);
				},
				update1:new mainGame.UpdateScript(this,layers.physics.list[2],undefined,()=>{
					this.Physics.findMinObj();
					this.coords=Math.addVec2(this.coords,Math.scaleVec2(this.velocity,this.Physics.minCTime));
					//this.Physics.reflectVel();
				}),
				attachLayer:function(){
					for(let i=0;i<this.scripts.length;i++){
						this.scripts[i].attachLayer();
					}
				},
				detachLayer:function(){
					for(let i=0;i<this.scripts.length;i++){
						this.scripts[i].detachLayer();
					}
				},
			});
			//this.Physics.update2.detachLayer();
			this.Physics.updateScriptList=[this.Physics.update1];
			this.updateScriptList.push(this.Physics);
			return this;
		}
	})();
	return this;
}
GUI={
	Meterbar:class{//8:15 to 8:50 : 35 mins
		constructor(){
			const layers=mainGame.layers;
			Detachable.call(this);
			this.coords=[-0.98,0.98];
			this.bgcolour="#44332280";
			this.getValue=function(){
				return this.valueRef.obj[this.valueRef.property]/1000;
			};
			this.mainDrawScript=function(){
				let val=this.getValue();
				ctx.moveTo(0,0);
				ctx.lineWidth=2;
				ctx.fillStyle=this.bgcolour;
				ctx.fillRect(0,0,0.4,-0.05);
				ctx.fillStyle=Draw.hslColour(val,0.7,0.7);
				ctx.fillRect(0.005,-0.005,(0.4-0.01)*val,-0.04);
			};
			this.Draw=new mainGame.UpdateScript(this,layers.mainDraw.list[7],undefined,()=>{
				this.drawScript();
			},1);
			this.drawScript=()=>{
				ctx.save();
				ctx.translate(Draw.width/2,Draw.height/2);
				ctx.scale(Draw.width/2,Draw.height/2);
				ctx.translate(this.coords[0],this.coords[1]);
				this.mainDrawScript();
				ctx.restore();
				//ctx.translate(this.coords[0],this.coords[1]);
			};
			this.setValueFunc=function(func){
				this.getValue=func;
				return this;
			}
		}
	},
}
