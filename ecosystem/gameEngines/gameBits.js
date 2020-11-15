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
	(()=>{//extensions
		this.addDrawing=(colour=this.colour)=>{
			this.colour=colour;
			this.Drawing = new mainGame.UpdateScript(this,layers.draw.list[4],undefined,()=>{
				ctx.translate(this.coords[0],this.coords[1])
				Draw.transform(this.matrixPos);
				Draw.circle(0,0,this.size,this.colour);
				Draw.undoTransform(this.matrixPos);
				ctx.translate(-this.coords[0],-this.coords[1])
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
					return false;
				};
			}
			else{
				detectorFilter=filter;
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
		this.addCamera=()=>{
			
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
				update1:new mainGame.UpdateScript(this,layers.physics.list[2],undefined,()=>{
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
									dif=Math.minusVec2(Math.addVec2(this.coords,this.velocity),Math.addVec2(obj.coords,obj.velocity));
									len=Math.len2(dif)-(this.size+obj.size);
									if(len<0){
										normal=Math.minusVec2(this.coords,obj.coords);
										obj_dist=Math.len2(normal)-(this.size+obj.size);
										if(obj_dist<len){
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

					//phisics part 2: do collisions + move object
					this.coords=Math.addVec2(this.coords,Math.scaleVec2(this.velocity,this.Physics.minCTime));
					if(this.Physics.isColliding){
						let obj=this.Physics.minObj;
						this.colour="red";
						switch(obj.type.shape){
							case"circleOld":{
								let dif=Math.minusVec2(this.coords,Math.addVec2(obj.coords,obj.velocity));
								let len=Math.len2(dif);
								let vel_u=Math.minusVec2(this.velocity,obj.velocity);
								let abs_vu=0;//abs(v-u); (change in speed)
								//vel2[0]=Math.abs(vel2[0]);
								abs_vu=[
									 (Math.SQRT1_2*(1-Math.sqrt(obj.mass/this.mass))-1),
									-(Math.SQRT1_2*(1-Math.sqrt(this.mass/obj.mass))-1),
								];
								abs_vu=[
									 ((1-1/(this.mass))-1),
									-((1-1/(obj.mass))-1),
								];
								let test=[
									(Math.pow(abs_vu[0]+1,2)*this.mass+Math.pow(abs_vu[1]-1,2)*obj.mass)*Math.len2(vel_u),
								];
								
								this.velocity=Math.addVec2(this.velocity,Math.scaleVec2(vel_u,abs_vu[0]));
								obj.velocity=Math.addVec2( obj.velocity,Math.scaleVec2(vel_u,abs_vu[1]));
								//console.log(this.velocity,obj.velocity);//alert(test);
								if(len<(this.size+obj.size)&&this.type.movable!==false)this.coords=Math.lerpV(this.coords,obj.coords,(len-this.size-obj.size)/len/(1+(obj.type.movable!==false)));
								if(len<(this.size+obj.size)&&obj.type.movable!==false)obj.coords=Math.lerpV(obj.coords,this.coords,(len-this.size-obj.size)/len/(1+(this.type.movable!==false)));
							}break;
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