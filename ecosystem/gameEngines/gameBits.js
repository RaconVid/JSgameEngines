Space={
	//--------
		Camera:class{
			constructor(){
				this.coords=[0,0];
				//this.layerRef=null;
				this.viewList=[];
				this.pos=new Space.Pos();
				this.type={
					shape:"point",
					portal:{
						basic1:true,
					}
				}
				//to use -->"this.viewObjs=camera.viewSearch(this.layer.list,()=>true);"
			}
			getCamPos(pos=new Pos){
				return Space.Pos.add(pos,this.pos);
			}
			viewSearch(objs=this.layerRef.list,filter=()=>true,list=[],pos=new Space.Pos(),n=0){
				//function(objs,filter,list,pos,n)
				let camPos=this.getCamPos(pos);
				if(n>2||list.length>40){
					//console.error("portal error: ",camPos);
					//alert("ERROR:too many portal levels : "+n);
					return list;
				}
				let obj=null;
				for(let i=0;i<objs.length;i++){
					obj=objs[i];//obj=RefPos;
					if(obj.obj==this)continue;
					if(!filter(obj))continue;
					list.push(new Space.RelPos(obj.obj,Space.Pos.add(obj.pos,camPos)));
					if(obj.obj.type.portal){
						obj.obj.viewSearch(objs,filter,list,camPos,n+1);
					}
				}
				return list;
			}
			addDraw(){//"this.layerDraw.onUpdate"
				this.layerDraw=new mainGame.UpdateLayer(function(){
					this.viewList=this.sprite.viewList;
					this.viewList.sort((a,b)=>a.coords[1]-b.coords[1]);
					for(let i=0;i<this.viewList.length;i++){//attach draw-Scripts to Draw Layer
						if(this.viewList[i].obj.Draw)//test for defined
						this.viewList[i].obj.Draw.attachDraw(this.viewList[i],this);
					}
					this.layerScript();
				});
				this.layerDraw.viewList=[];
				this.layerDraw.sprite=this;
				for (let i=0;i<10;i++) {
					this.layerDraw.list.push(new mainGame.UpdateLayer(function(){
						this.layerScript();
						this.list=[];
					}));
				}
				return this;
			}
		},
		RelPos:class{
			constructor(obj,pos=new Space.Pos(),posT1=new Space.Pos()){
				this.obj=obj;
				this.pos=pos;
			}
			get coords(){
				return this.vec(this.obj.coords,this.pos);
			}
			get velocity(){
				return this.vecT1(this.obj.velocity,this.pos);
			}
			vec(vec,pos){
				const a=vec;
				const b=pos;
				return [
					b.vec[0]+a[0]*b.mat[0][0]+a[1]*b.mat[1][0],
					b.vec[1]+a[0]*b.mat[0][1]+a[1]*b.mat[1][1]
				];
			}
			vecT1(vec,pos){//vec*time^-1
				const a=vec;
				const b=pos;
				return [
					a[0]*b.mat[0][0]+a[1]*b.mat[1][0],
					a[0]*b.mat[0][1]+a[1]*b.mat[1][1]
				];
			}
		},
		Pos:class{
			constructor(){
				this.mat=[[1,0],[0,1]];
				this.vec=[0,0];
			}
			static add(a,b){
				return {
					mat:[
						[
							a.mat[0][0]*b.mat[0][0]+a.mat[0][1]*b.mat[1][0],
							a.mat[0][0]*b.mat[0][1]+a.mat[0][1]*b.mat[1][1]
						],
						[
							a.mat[1][0]*b.mat[0][0]+a.mat[1][1]*b.mat[1][0],
							a.mat[1][0]*b.mat[0][1]+a.mat[1][1]*b.mat[1][1]
						],
					],
					vec:[
						b.vec[0]+a.vec[0]*b.mat[0][0]+a.vec[1]*b.mat[1][0],
						b.vec[1]+a.vec[0]*b.mat[0][1]+a.vec[1]*b.mat[1][1]
					]
				};
			}
			static minus(a,b){
				let det=1/(b.mat[0][0]*b.mat[1][1]-b.mat[0][1]*b.mat[1][0]);
				return {
					mat:[
						[
							det*(a.mat[0][0]*b.mat[1][1]-a.mat[0][1]*b.mat[1][0]),
							det*(-a.mat[0][0]*b.mat[0][1]+a.mat[0][1]*b.mat[0][0])
						],
						[
							det*(a.mat[1][0]*b.mat[1][1]-a.mat[1][1]*b.mat[1][0]),
							det*(-a.mat[1][0]*b.mat[0][1]+a.mat[1][1]*b.mat[0][0])
						],
					],
					vec:[
						(a.vec[0]-b.vec[0])*b.mat[0][0]-(a.vec[1]-b.vec[1])*b.mat[1][0],
						(a.vec[1]-b.vec[1])*b.mat[1][1]-(a.vec[0]-b.vec[0])*b.mat[0][1],
					]
				};
			}
			static get Pos(){
				const p={	
					mat:[[1,0],[0,1]],
					vec:[0,0],
				};
				return p;
			}
		},
		Portal:function(layer){
			let newObj=(new Space.Camera()).addDraw();
			newObj.objRelPos=new Space.RelPos();//used only for calculations
			newObj.getCamPos=function(pos=new Space.Pos()){
				return Space.Pos.add(Space.Pos.minus(pos,this.portalB.pos),this.pos);
				//return Space.Pos.add(Space.Pos.minus(pos,this.pos),this.portalB.pos);
			};
			newObj.getCamPos2=function(pos=new Space.Pos()){
				return Space.Pos.add(Space.Pos.minus(pos,this.portalB.pos),this.pos);
			};
			//this.onUpdate=onUpdate;
			newObj.layer=layer;
			//this.matrixPos=[[1,0],[0,1]];
			newObj.portalB=new Space.Camera();
			newObj.width=200;
			newObj.size=5;
			newObj.type={
				shape:"line",
				portal:{basic1:true},
			};
			newObj.giveVecDist=function(collider){//how long will it take to collide?
				//DE point
				let dif=Math.undotransform()
			}
			newObj.giveOnCollide=function(collider){
				//collider.detachSpace();
				collider.layer=this.portalB.layer;
				if(collider.coords)collider.coords=this.objRelPos.vec(collider.coords,this.getCamPos());//Math.transform(Math.undoTransform(collider.coords,this.matrixPos),this.camera.matrixPos);
				if(collider.pos)collider.pos=this.getCamPos(collider.pos);//Math.transform(Math.undoTransform(collider.matrixPos,this.matrixPos),this.camera.matrixPos);
				if(collider.velocity)collider.velocity=this.objRelPos.vec(collider.velocity,this.getCamPos());//Math.transform(Math.undoTransform(collider.coords,this.matrixPos),this.camera.matrixPos);
				//collider.attachSpace();
			}
			newObj.addCollider=function(){//v -a +b -> v-a  {Vec,Apos,Bpos}
				this.entity=new Space.RefEntity(this,this.layer);
				this.tpList=[];//relPos' to be teleported
				this.searchUpdate1=new mainGame.UpdateScript(this,mainGame.layers.moveMent.list[1],undefined,()=>{
					this.tpList=this.viewSearch(this.layer.list,(relPos)=>{
						if(relPos.obj.type.portal)return false;
						let c=this.objRelPos.vec(relPos.coords,Space.Pos.minus(new Space.Pos(),this.portalB.pos));
						let v=Math.minusVec2(this.objRelPos.vec(Math.addVec2(relPos.coords,relPos.velocity),Space.Pos.minus(new Space.Pos(),this.portalB.pos)),c);
						if(Math.abs(c[0])>0 && (c[0]<0?1:-1)*(c[0]+v[0])>0){//passing through portal plane
							if(Math.abs(c[1]+v[1])<this.width){
								return true;
							}
						}
						else{
							return false;
						}
					});
				});
				this.searchUpdate2=new mainGame.UpdateScript(this,mainGame.layers.moveMent.list[2],undefined,()=>{
					for(let i=0;i<this.tpList.length;i++){
						let relPos=new Space.RelPos(this.tpList[i].obj,this.getCamPos2());
						relPos.obj.coords=relPos.coords;
						relPos.obj.velocity=relPos.velocity;
						relPos.obj.entity.detachLayer();
						relPos.obj.layer=this.layer;
						relPos.obj.entity.attachLayer();
					}
				});
			}
			return newObj;
		},
	//--------
		RefEntity:class{
			constructor(obj=null,layer=undefined){
				//Detachable.call(this);
				this.id=NaN;
				this.obj=obj;
				this.layer=layer;
				this.pos=new Space.Pos();
				if(layer !=undefined){
					this.attachLayer(layer);
				}
			}
			//attachers
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
					if(layer.list.length>1&&this.id<layer.list.length-1){
						layer.list[this.id]=layer.list.pop();
						layer.list[this.id].id=this.id;
					}else{
						layer.list.pop();
					}
					this.id=NaN;
					return true;
				}
			//---- pos
				get coords(){
					return this.vec(this.obj.coords,this.pos);
				}
				get velocity(){
					return this.vecT1(this.obj.velocity,this.pos);
				}
				vec(vec,pos){
					const a=vec;
					const b=pos;
					return [
						b.vec[0]+a[0]*b.mat[0][0]+a[1]*b.mat[1][0],
						b.vec[1]+a[0]*b.mat[0][1]+a[1]*b.mat[1][1]
					];
				}
				vecT1(vec,pos){//vec*time^-1
					const a=vec;
					const b=pos;
					return [
						a[0]*b.mat[0][0]+a[1]*b.mat[1][0],
						a[0]*b.mat[0][1]+a[1]*b.mat[1][1]
					];
				}
			//----
		},
		Chunk:class{
			constructor(list=[],onUpdate){
				this.onUpdate=onUpdate;
				this.list=list;//[Entity,Entity];layer.list[i].get_coords; or
			}
		},
		Entity:class{
			constructor(layer=undefined){
				Space.addEntity.call(this,layer);
			}
		},
		addEntity:function(layer=undefined){//addEntity.call(this)
			Detachable.call(this);
			this.coords=[0,0];
			this.velocity=[0,0];
			this.pos=new Space.Pos();
			this.layer=layer;
			this.entity=new Space.RefEntity(this,layer);
			if(false){
				this.PosisionUpdate = new mainGame.UpdateScript(this,layers.physics.list[8],undefined,()=>{
					this.coords=Math.AddVec2(this.coords,this.velocity);
				});
			}
			
			return this;
		},
		addDraw:function(scripts){
			this.Draw={
				scripts:scripts,
				attachDraw:function(relPos,layer){
					for(let i=0;i<this.scripts.length;i++){
						let relPos1={
							pos:relPos.pos,
							scriptObj:this.scripts[i][0],
							onUpdate:function(){
								ctx.save();
								Draw.transform(relPos.pos);
								this.scriptObj.onUpdate();
								ctx.restore();
							}
						};
						this.scripts[i][1](layer).list.push(relPos1);
					}
				}
			}
			return this;
		},
	//--------
};
Sprite={
	addSprite:function(obj={}){
		obj.Scripts={
			Draw:Detachable.call({
				sprite:obj,
			})
		};
		return obj;
	},
};
function Detachable(restart=false){//Deletable.call(sprite)
	if(restart||!("detachScripts"in this))this.detachScripts=function(){//detachScripts
		let list=this.updateScriptList;
		for (var i = 0; i < list.length; i++) {
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
Collider_Interactions={
	circle:{
		detectArea:{
			circle:function(obj){
				return Math.len2(this.coords,obj.coords)-(this.size+obj.size);
			}
		},
		dist:{
			circle:function(obj){
				return Math.len2(this.coords,obj.coords)-(this.size+obj.size);
			}
		},
	}
};
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
	this.coords=[0,0];//new Space.Pos();
	this.velocity=[0,0];//new Space.Pos();
	this.matrixPos=new Space.Pos();//[rotation,coords]
	this.layer=SpaceLayer;
	Detachable.call(this);
	this.PosisionUpdate = new mainGame.UpdateScript(this,layers.physics.list[7],undefined,()=>{
		this.matrixPos[this.matrixPos.length-1]=this.coords;
	});
	(()=>{//extensions
		this.addDrawing=(colour=this.colour)=>{
			this.colour=colour;
			this.Draw = new mainGame.UpdateScript(this,layers.draw.list[4],undefined,()=>{
				//ctx.translate(this.coords[0],this.coords[1])
				Draw.transform(this.matrixPos);
				Draw.circle(0,0,this.size,this.colour);
				Draw.undoTransform(this.matrixPos);
				//ctx.translate(-this.coords[0],-this.coords[1])
			});
			this.updateScriptList.push(this.Draw);
			return this;
		};
		this.addDetector=(triggerKeyWord=["all",1],filter=undefined)=>{//[colour,this.colour]
			if(filter==undefined){
				this.detectorFilter=function(RelPos){
					if("keywords" in RelPos.obj)
					if(this.triggerKeyWord[0] in RelPos.obj.keywords)
					if(RelPos.obj.keywords[this.triggerKeyWord[0]]==this.triggerKeyWord[1]){
						return this.hitboxScript(RelPos);
					}
					return false;
				};
			}
			else{
				this.detectorFilter=filter;
			}
			switch(this.type.shape){
				case"rect":
				default://i.e. "circle"
					this.hitboxScript=function(pos_obj){
						let dist,dif=Math.dif2(pos_obj.coords,this.coords);
						let obj=pos_obj.obj;
						switch(obj.type.shape){
							case"circle":
								dist= Math.len2(dif)-this.size-obj.size;
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
			this.cameraObj=new Space.Camera();
			if(false){
				this.areaDetectorScript = new mainGame.UpdateScript(this,layers.detectors.list[3],undefined,()=>{
					this.objsInHitbox=this.cameraObj.viewSearch(this.layer,this.detectorFilter)
					for(let i=0;i<this.objsInHitbox.length;i++){
						let obj=this.objsInHitbox[i];
						if(obj.obj==this){
							this.objsInHitbox.splice(i,1);
							i--;
						}
					}
				});
			}
			this.updateScriptList.push(this.areaDetectorScript);
			return this;
		};
		this.addCamera=(isPlayer=false)=>{
			this.cameraObj=new Space.Camera().addDraw();
			this.type.camera=true;
			this.viewLayer=this.cameraObj.layerDraw; //layers.draw;
			this.active=isPlayer;
			if(isPlayer){
				this.draw_view = new mainGame.UpdateScript(this,layers.mainDraw.list[1],undefined,function(a,b){
					if(!this.sprite.active)return;
					const sprite=this.sprite;
					ctx.save();
					ctx.translate(Draw.width/2,Draw.height/2);
					Draw.undoTransform({vec:this.sprite.coords,mat:sprite.matrixPos.mat});
					sprite.viewLayer.onUpdate();
					ctx.restore();
				});
			}
			else{
				this.draw_view = new mainGame.UpdateScript(this,layers.draw.list[4],undefined,function(){
					if(!this.sprite.active)return;
					Draw.undoTransform(this.sprite.matrixPos);
					this.sprite.viewLayer.onUpdate();
					Draw.transform(this.sprite.matrixPos);
				});
			}
			
			this.getSpaceLayers=function(){
				let objs=this.cameraObj.viewSearch(this.layer.list,this.viewFilter);
				this.cameraObj.viewList=objs;
				return objs;
			}
			this.objFinderUS=new mainGame.UpdateScript(this,layers.detectors.list[3],undefined,function(){
				this.sprite.getSpaceLayers();
			});
			//this.updateScriptList.push(this.draw_view);
			switch(this.type.shape){
				case"circle":
				this.viewFilter=(relPos)=>{
					const obj=relPos.obj;
					const originObj=this;
					if(obj.type.portal!=undefined)
					if(obj.type.portal.basic1==true){//let difference in matrix's=0;
						//searchSpaceLayer
						let dist,c,c1,dif;
						switch(obj.type.shape){
							case "line":
								c=Space.Pos.minus({vec:this.coords,mat:[[1,0],[0,1]]},obj.pos).vec;
								//c=dif.vec;
								c[1]=c[1]/obj.width;//all but coords[0]
								dist=Math.len2(c)-this.size-obj.size;
							break;
							case "circle":
								c=Math.len2(relPos.coords,this.coords);
								dist=c-this.size-obj.size;
							break;
							default:
								c=Math.len2(relPos.coords,this.coords);
								dist=c-this.size;
						}
						if(dist<=0){
							return true;
						}
						else{
							return false;
						}
					}else{
						return true;
					}
					return true;
				}
				break;
				case"rect":
				this.viewFilter=function(relPos){
					const obj=relPos.obj;
					const originObj=this;
					if(obj.type.portal!=undefined)
					if(obj.type.portal.basic1==true){//let difference in matrix's=0;
						//searchSpaceLayer
						let dist,c,c1,dif;
						switch(obj.type.shape){
							case "line":
								dif=Math.undotransform(originObj.posMatrix,obj.matrixPos);
								c=dif[dif.length-1];
								c[1]=c[1]/obj.width;//all but coords[0]
								dist=Math.len2([
									Math.max(0,Math.abs(c[0])-originObj.rectSize[0]),
									Math.max(0,Math.abs(c[1])-originObj.rectSize[1])
								])-obj.size;
							break;
						}
						if(dist<=0){
							return true;
						}
					}else{
						return true;
					}
					return false;
				}
				break;
				default:
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
									dif=Math.minusVec2(Math.addVec2(this.coords,this.velocity),obj.coords);//obj.velocity));
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
				move:()=>{
					this.coords=Math.addVec2(this.coords,Math.scaleVec2(this.velocity,this.Physics.minCTime));
				},
				update1:new mainGame.UpdateScript(this,layers.physics.list[2],undefined,()=>{
					this.Physics.findMinObj();
					this.Physics.move();
					this.Physics.reflectVel();
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
		this.addTraverseable=()=>{
			this.Movement={
				update:new mainGame.UpdateScript(this,layers.moveMent.list[8],undefined,()=>{
					this.coords=Math.addVec2(this.coords,this.velocity);
				},true),
			};
			return this;
		}
		this.addTraverseable();
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
