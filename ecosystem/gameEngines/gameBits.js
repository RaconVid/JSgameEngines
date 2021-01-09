//Space
	Space={
		Camera:class{
			constructor(){window.numN=1;//to delete: testing
				this.coords=[0,0];
				this.layerRef=null;
				this.viewList=[];
				this.pos=new Space.Pos();
				this.n=0;
				this.type={
					shape:"point",
					//portal:{
						//basic1:true,
					//}
				}
				//to use -->"this.viewObjs=camera.viewSearch(this.layer.list,()=>true);"
			}
			getCamPos(pos=new Space.Pos()){
				return Space.Pos.add(pos,this.pos);
			}
			portalFilter(relPos){
				if(relPos.obj.type.portal){
					if(relPos.obj.type.portal.basic_v1)return false;
					if(relPos.obj.type.portal.camera_v1){
						return true;
					}
					return true;
				}
				return false
			}
			filter(relPos){
				return true;
			}
			portalErrorHandling(objs,filter,list,camPos,n){
				if(n>15+numN||list.length>20000){//20,000
					if(1){
						//window.myER1=(()=>{let a=[];list.map(v=>{if(a.indexOf(v.obj)==-1)a.push(v.obj);});return a;}) ();
						//window.myER2=arguments;
						//window.myER3=list.map(v=>([myER1.indexOf(v.obj),...v.pos.vec]));
						//window.myER4=(()=>{let a=myER3.map(v=>v.join(","));let b={};for(let i of a){if(!(i in b))b[i]=1;else b[i]++;}return b;})();
						//console.log("portal error: ",window.myER1);
						console.error("portal error: ",camPos);
						alert("ERROR:too many portal levels : "+n+", list:"+list.length);
					}
					return true;
				}
				return false;
			}
			viewSearch(objs,filter,list,pos,n,portalFilter,portalList,toDo){
				//function(objs,filter,list,pos,n)
				{
					if(objs==undefined)objs=this.layerRef.list;
					if(!(objs instanceof Array)){
						filter=objs.filter;
						list=objs.list;
						pos=objs.pos;
						n=objs.n;
						portalFilter=objs.portalFilter;
					}
					if(objs==undefined)objs=this.layerRef.list;
					if(filter==undefined){filter=this.filter;}
					if(list==undefined)list=[];
					if(pos==undefined)pos=new Space.Pos();
					if(n==undefined)n=0;
					if(portalFilter==undefined)portalFilter=this.portalFilter;
					if(portalList==undefined)portalList=[];
					if(toDo==undefined)toDo=[];
				}
				//if(n>-1&&portalList.indexOf(objs)>0)return list;
				//else portalList.push(objs);
				this.n=n;
				let camPos=this.getCamPos(pos);
				if(this.portalErrorHandling(objs,filter,list,camPos,n))return list;
				// both obj and obj1 are an instanceof relPos (relativePosisions) 
				for(let i=0;i<objs.length;i++){
					let obj=objs[i];//obj=RefPos;
					if(obj.obj==this)continue;
					let obj1=new Space.RelPos(obj.obj,Space.Pos.add(obj.pos,camPos));
					if(!filter(obj1,list,obj))continue;
					list.push(obj1);
					{//if object contains more objects
						if(obj.obj.type)
						if(obj.obj.type.chunk)
						if(obj.obj.list instanceof Array)
						if(obj.obj.list.length>0){
							let newPos=Space.Pos.minus(obj1.pos,this.getCamPos());
							newPos.vec=Math.addVec2(newPos.vec,obj1.obj.coords);
							toDo.push(()=>this.viewSearch(obj.obj.list,filter,list,newPos,n+1,portalFilter,portalList,toDo));//obj1.pos
						}
					}
					if(this.portalFilter)if(!this.portalFilter(obj1))continue;
					//if(portalFilter)if(!portalFilter(obj1))continue;
					toDo.push(()=>obj.obj.viewSearch(undefined,filter,list,camPos,n+1,({}.u),portalList,toDo));
				}
				if(n<2){
					for(let i=0;i<4000&&toDo.length>0;i++){
						toDo.shift()();
					}
				}
				return list;
			}
			viewSearchOld(objs,filter,list,pos,n,portalFilter,portalList){
				{
					if(objs==undefined)objs=this.layerRef.list;
					if(!(objs instanceof Array)){
						filter=objs.filter;
						list=objs.list;
						pos=objs.pos;
						n=objs.n;
						portalFilter=objs.portalFilter;
					}
					if(objs==undefined)objs=this.layerRef.list;
					if(filter==undefined){filter=this.filter;}
					if(list==undefined)list=[];
					if(pos==undefined)pos=new Space.Pos();
					if(n==undefined)n=0;
					if(portalFilter==undefined)portalFilter=this.portalFilter;
					if(portalList==undefined)portalList=[];
				}
				//if(portalList.indexOf(this)!=-1)return list;
				//else portalList.push(this);
				this.n=n;
				//function(objs,filter,list,pos,n)
				let camPos=this.getCamPos(pos);
				if(this.portalErrorHandling(objs,filter,list,camPos,n))return list;
				let obj=null;let obj1;
				// both obj and obj1 are an instanceof relPos (relativePosisions) 
				for(let i=0;i<objs.length;i++){
					obj=objs[i];//obj=RefPos;
					if(obj.obj==this)continue;
					obj1=new Space.RelPos(obj.obj,Space.Pos.add(obj.pos,camPos));
					if(!filter(obj1))continue;
					list.push(obj1);
					{//if object contains more objects
						if(obj.obj.type)
						if(obj.obj.type.chunk)
						if(obj.obj.list instanceof Array)
						if(obj.obj.list.length>0){
							let newPos=Space.Pos.minus(obj1.pos,this.getCamPos());
							newPos.vec=Math.addVec2(newPos.vec,obj1.obj.coords);
							this.viewSearch(obj.obj.list,filter,list,newPos,n+1,portalFilter,portalList);//obj1.pos
						}
					}
					if(this.portalFilter)if(!this.portalFilter(obj1))continue;
					//if(portalFilter)if(!portalFilter(obj1))continue;
					obj.obj.viewSearch(undefined,filter,list,camPos,n+1,({}.u),portalList);
				}
				return list;
			}
			addDraw(){//"this.layerDraw.onUpdate"
				this.layerDraw=new mainGame.UpdateLayer(function(){
					this.viewList=this.sprite.viewList;
					this.viewList.sort((a,b)=>a.coords[1]-b.coords[1]);
					for(let i=0;i<this.viewList.length;i++){//attach draw-Scripts to Draw Layer
						try{
							//if(this.viewList[i].obj.Draw)//test for defined
							this.viewList[i].obj.Draw.attachDraw(this.viewList[i],this);
						}
						catch(error){}
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
			set coords(vec){
				this.obj.coords = this.vec_set(this.obj.coords,this.pos);
			}
			set velocity(vec){
				this.obj.velocity = this.vecT1_set(this.obj.velocity,this.pos);
			}
			vec(vec,pos=this.pos){
				const a=vec;
				const b=pos;
				return [
					b.vec[0]+a[0]*b.mat[0][0]+a[1]*b.mat[1][0],
					b.vec[1]+a[0]*b.mat[0][1]+a[1]*b.mat[1][1]
				];
			}
			vecT1(vec,pos=this.pos){//vec*time^-1
				const a=vec;
				const b=pos;
				return [
					a[0]*b.mat[0][0]+a[1]*b.mat[1][0],
					a[0]*b.mat[0][1]+a[1]*b.mat[1][1]
				];
			}
			vec_set(vec,pos=this.pos){
				let det=1/(pos.mat[0][0]*pos.mat[1][1]-pos.mat[0][1]*pos.mat[1][0]);
				return[
					det*((vec[0]-pos.vec[0])*pos.mat[0][0]-(vec[1]-pos.vec[1])*pos.mat[1][0]),
					det*((vec[1]-pos.vec[1])*pos.mat[1][1]-(vec[0]-pos.vec[0])*pos.mat[0][1]),
				];
			}
			vecT1_set(vec,pos=this.pos){//vec*time^-1
				let det=1/(pos.mat[0][0]*pos.mat[1][1]-pos.mat[0][1]*pos.mat[1][0]);
				return[
					det*(vec[0]*pos.mat[0][0]-(vec[1])*pos.mat[1][0]),
					det*(vec[1]*pos.mat[1][1]-(vec[0])*pos.mat[0][1]),
				];
			}
		},
		Pos:class{
			constructor({vec,mat}={}){
				this.mat=mat==undefined?[[1,0],[0,1]]:mat;
				this.vec=vec==undefined?[0,0]:vec;
			}
			add(b){
				return new this.prototype({
					mat:[
						[
							this.mat[0][0]*b.mat[0][0]+this.mat[0][1]*b.mat[1][0],
							this.mat[0][0]*b.mat[0][1]+this.mat[0][1]*b.mat[1][1]
						],
						[
							this.mat[1][0]*b.mat[0][0]+this.mat[1][1]*b.mat[1][0],
							this.mat[1][0]*b.mat[0][1]+this.mat[1][1]*b.mat[1][1]
						],
					],
					vec:[
						b.vec[0]+this.vec[0]*b.mat[0][0]+this.vec[1]*b.mat[1][0],
						b.vec[1]+this.vec[0]*b.mat[0][1]+this.vec[1]*b.mat[1][1]
					]
				});
			}
			minus(a=new this,b=new this){
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
						det*((a.vec[0]-b.vec[0])*b.mat[0][0]-(a.vec[1]-b.vec[1])*b.mat[1][0]),
						det*((a.vec[1]-b.vec[1])*b.mat[1][1]-(a.vec[0]-b.vec[0])*b.mat[0][1]),
					]
				};
			}
			static add(a=new this,b=new this){
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
			static minus(a=new this,b=new this){
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
						det*((a.vec[0]-b.vec[0])*b.mat[0][0]-(a.vec[1]-b.vec[1])*b.mat[1][0]),
						det*((a.vec[1]-b.vec[1])*b.mat[1][1]-(a.vec[0]-b.vec[0])*b.mat[0][1]),
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
	};
	Space={
		...Space,
		RefEntity:class extends Space.RelPos{
			constructor(obj=null,layer=undefined){
				super(obj)
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
				attachScripts(layer=this.layer){
					this.attachLayer(layer);
				}
				detachScripts(layer=this.layer){
					this.detachLayer(layer);
				}
				attach(layer=this.layer){
					this.attachLayer(layer);
				}
				detach(layer=this.layer){
					this.detachLayer(layer);
				}
				attachLayer(layer=this.layer){
					this.id=layer.list.length;
					layer.list.push(this);
					this.layer=layer;
				}
				detachLayer(layer=this.layer){
					if(isNaN(this.id))return false;
					if(layer.list.length>1&&this.id<layer.list.length-1){
						layer.list[this.id]=layer.list.pop();
						layer.list[this.id].id=this.id;
					}else{
						layer.list.pop();
					}
					this.id=NaN;
					return true;
				}
		},
		Chunk:class{
			constructor(list=[],onUpdate){
				this.onUpdate=onUpdate;
				this.portals={list:[]};
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
			if(!"coords" in this)this.coords=[0,0];
			if(!"velocity" in this)this.velocity=[0,0];
			if(!"pos" in this)this.pos=new Space.Pos();
			if(!"layer" in this)this.layer=layer;
			if(!"entity" in this)this.entity=new Space.RefEntity(this,layer);
			if(false){
				this.PosisionUpdate = new mainGame.UpdateScriptV1_0(this,layers.physics.list[8],undefined,()=>{
					this.coords=Math.AddVec2(this.coords,this.velocity);
				});
			}
			//this.addDraw=Space.addDraw;
			return this;
		},
		addDrawUpdates:function(scripts){//[[UScript{},attachFunc()]]
			this.Draw={
				scripts:scripts,
				attachDraw:function(relPos,layer){
					for(let i=0;i<this.scripts.length;i++){
						let relPos1={
							pos:relPos.pos,
							scriptObj:this.scripts[i][0],
							onUpdate:function(layer,i){
								ctx.save();
								Draw.transform(relPos.pos);
								if(typeof this.scriptObj=="function")this.scriptObj(layer,i,this.pos);
								else this.scriptObj.onUpdate(layer,i,this.pos);
								ctx.restore();
							}
						};
						this.scripts[i][1](layer).list.push(relPos1);
					}
				},
				destructor:function(){
					this.scripts=[];
				},
			}
			return this;
		},
	};
//----
Raymarcher={
	Ray:class{
		constructor(){
			this.coords=[0,0];
			this.velocity=[0,0];
			this.size=1;
			this.objs=[];//relPos
			this.shape="line";

			this.minDist=Infinity;
			this.minObj=null;
			this.type={
				rayMarch:{
					ray:true,
				},
				shape:"line",
			}
		}
		march(objs=this.objs){//ray
			this.minDist=Infinity;
			this.minObj=null;
			for(let i=0;i<objs.length;i++){
				let dist=Infinity;let isSearching=true;//isLookingForDistanceFunction?
				if(objs[i].obj.type.rayMarch){
					let t=objs[i].obj.type.rayMarch;
					if(t.rayCollider){
						dist=objs[i].obj.DE[this.type.shape](this);
						isSearching=false;
					}
				}
				if(isSearching){
					try{
						dist=Raymarcher.DE[this.type.shape][objs[i].obj.type.shape](this,objs[i]);
					}
					catch(error){
					}
					isSearching=false;
				}
				if(dist<this.minDist){
					this.minDist=dist;
					this.minObj=objs[i];
				}
			}
			return {dist:this.minDist,obj:this.minObj};
		}
	},
	DE:{//DE.Rayshape.objShape()
		point:{

		},
		circle:{
			
		},
		line:{
			line:function(){return Infinity},
			point:function(ray,relPos){//x+Xt=a y+Yt=b => t =(a-x)/X = (b-x)/X
				let size=ray.size+relPos.obj.size;
				if(Math.len2(ray.velocity)==0){
					return Math.Math.len2(ray.coords,relPos.coords)-ray.size;
				}
				let angle=Math.getAngle(ray.velocity,0,1);
				let c=Math.rotate(Math.dif2(relPos.coords,ray.coords),-angle,0,1);
				let dist=Math.sqrt(Math.pow(ray.size,2)-Math.pow(c[1],2));
				let minDist=c[1]-ray.size;
				if(minDist>0)return Infinity;
				return dist;
			},
			circle:function(ray,relPos){//x+Xt=a y+Yt=b => t =(a-x)/X = (b-x)/X
				let size=ray.size+relPos.obj.size;
				if(Math.len2(ray.velocity)==0){
					return Math.Math.len2(ray.coords,relPos.coords)-size;
				}
				let angle=Math.getAngle(ray.velocity,0,1);
				let c=Math.rotate(Math.dif2(relPos.coords,ray.coords),-angle,0,1);
				let dist=Math.sqrt(Math.pow(size,2)-Math.pow(c[1],2));
				let minDist=c[1]-size;
				if(minDist>0)return Infinity;
				return dist;
			},
			square:function(ray,relPos){//x+Xt=a y+Yt=b => t =(a-x)/X = (b-x)/X
				let size=ray.size+relPos.obj.size;
				if(Math.len2(ray.velocity)==0){
					return Math.Math.len2(ray.coords,relPos.coords)-size;
				}
				let angle=Math.getAngle(ray.velocity,0,1);
				let c=Math.rotate(Math.dif2(relPos.coords,ray.coords),-angle,0,1);
				let dist=Math.sqrt(Math.pow(size,2)-Math.pow(c[1],2));
				let minDist=c[1]-size;
				if(minDist>0)return Infinity;
				return dist;
			},
		},
	},
	Collider:class{
		DE(ray){

		}
	}
};
Sprite={
	addSprite:function(obj={}){
		CloneTo(addDrawUpdates.call({
			coords:[0,0],
			velocity:[0,0],
			type:{Sprite_v1:true},
			scripts:{

			},
			entRefs:{
				main:new Space.RefEntity(obj),
			},
			get layer(){return this.entRefs.main.layer},
			set layer(layerNew){
				baceEntity.entRefs.main.detach();
				baceEntity.entRefs.main.attach(layerNew);
			},
			goto:Sprite.add.movement.GoTo(function(oldLayer,layer){
				//this.entRef.main.detach(oldLayer);
				//this.entRef.main.attach(layer);
				this.layer=layer;
			}),
			camera:Collider.call({
				entity:obj,
				get coords(){return this.entity.coords;},
				get velocity(){return this.entity.velocity;},
				get layer(){return this.entity.layer;},
			}).addCamera(),
			...obj,
		}),obj);
		return obj;
	},
	add:{
		movement:{
			GoTo:function(newReattach){
				let movement={};
				const moveBail=100;
				const tollerance=Math.pow(2,-20*0);
				let oldLayer,hitWall,objsInView,lastPortal,minObj,minDist,coordsPointer;
				let goTo,coords,layer,self;
				let reattach=function(oldLayer,layer){
					this.entRef.main.detach(oldLayer);
					this.entRef.main.attach(layer);
					this.layer=layer;
				};
				if(newReattach!=undefined){
					reattach=newReattach;
				}
				let GoTo=function(newCoords){//walls and portal
					self=this;
					goTo=newCoords;
					coords=this.coords;
					layer=this.layer;
					//find Objs In view (walls/portals) and teteport
						hitWall=false;
						onMove1_1_searchView();
						lastPortal=null;
						let i;
						for(i=0;i<moveBail&&!hitWall;i++){
							onMove1_2_others();
							if(oldLayer!=layer){
								reattach.call(this,oldLayer,layer);
								if(layer.portals==undefined){console.log(this,layer instanceof Space.Chunk);alert()}//TESTING
								onMove1_1_searchView();
							}
							if(Math.len2(coords,goTo)==0)break;
						}
						if(i>4){console.error("movement error",i);alert("ERROR: movement error"+i)}
				};
				const onMove1_1_searchView=function(){
					oldLayer=layer;
					//find Objs In view (walls/portals)
					objsInView=[];
					let list;
					try{//TESTING
						list=layer.portals.list;
					}
					catch(e){
						list=layer.list;
					}
					for(let i=0;i<list.length;i++){
						if(list[i]==undefined){
							list[i]=list.pop();
							list[i].id=i;
							i--;
							continue;
						}
						try{
							let portalType=list[i].obj.type.portal;
							if(portalType.basic_v1){
								objsInView.push(list[i]);
							}
							else{
								({})();//cause error
							}
						}
						catch(error){try{
							let wallType=list[i].obj.type.wall;
							if(wallType.basic_v1){
								objsInView.push(list[i]);
							}
						}catch(error){}}
					}
				};
				const onMove1_2_others=function(){
					//find nearest wall/portal
						let list=objsInView;
						minObj=null;
						minDist=Math.len2(goTo,coords);
						for(let i=0;i<list.length;i++){
							if(list[i].obj==lastPortal)continue;
							if(minDist==0)break;
							if(list[i].obj==undefined){console.error(list[i].obj);alert("ERROR :(")}
							let wallType=list[i].obj.type.wall;
							if(wallType.vector){
								let dif=Math.dif2(list[i].obj.vec1,coords);
								let difVec=list[i].obj.vec2;
								let ang=Math.getAngle(Math.dif2(goTo,coords),0,1);
								dif=Math.rotate(dif,-ang,0,1);
								difVec=Math.rotate(difVec,-ang,0,1);
								if(Math.abs(difVec[1])<tollerance)continue;
								//if on wrong side of portal => continue; (side==1?antIclockwise)
								if(list[i].obj.side!=undefined)if(difVec[1]>0!=list[i].obj.side)continue;
								let time=-dif[1]/difVec[1];
								let collideX=(dif[0]+time*difVec[0]);
								if(!((time>=0&&time<=1)&&(collideX>=-tollerance&&collideX<=Math.len2(goTo,coords))))continue;
								//else collide (wall is in the way)
								if(collideX<minDist){
									minDist=0;//collideX;
									minObj=list[i];
								}
							}
							else{
								console.error("::no support for type::",type);alert("support ERROR");
							}
						}
					//collide
						let len=Math.len2(goTo,coords);
						coordsPointer=coords;
						if(len!=0){
							coords=Math.lerp2(coords,goTo,minDist/len);
						}
						if(minObj!=null){
							let obj=minObj.obj;
							let wallType=obj.type.wall;
							try{
								let portalType=obj.type.portal;
								if(portalType.basic_v1){
									let vec=Math.minusVec2(obj.portalB().vec1,obj.vec1);
									coords=Math.addVec2(coords,vec);
									CloneTo(Math.addVec2(goTo,vec),goTo);
									layer=obj.portalB().layer;
									lastPortal=obj.portalB();
								}
								else{
									hitWall=true;
									//({})();//error
								}
							}catch(error){
								hitWall=true;
							}
						}
						coords=CloneTo(coords,coordsPointer);

						//testing only
						if(false)if(minObj!=null){console.log(coords,coordsPointer);
							new mainGame.UpdateScriptV1_0(undefined,mainGame.layers.mainDraw.list[9],undefined,function(){
								alert(Math.round(coords[1])+" , "+1*(self.camera.layer==self.entRef.main.layer)+" :0");
								this.isDeleting=true;
								new mainGame.UpdateScriptV1_0(undefined,mainGame.layers.mainDraw.list[8],undefined,function(){
									alert(Math.round(coords[1])+" , "+1*(self.camera.layer==self.entRef.main.layer)+" :1");
									this.isDeleting=true;
								})
							})
						}
				};
				return GoTo;
			},
		},
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
	if(!("keywords"in this))this.keywords={
		all:1,
		colour:"#00FF88",
	};
	if(!("type"in this))this.type={
		shape:"circle",
	}
	if(!("colour"in this))this.colour=this.keywords.colour;
	if(!("size"in this))this.size=10;
	if(!("coords"in this))this.coords=[0,0];//new Space.Pos();
	if(!("velocity"in this))this.velocity=[0,0];//new Space.Pos();
	if(!("matrixPos"in this))this.matrixPos=new Space.Pos();//[rotation,coords]
	if(!("layer"in this))this.layer=SpaceLayer;
	Detachable.call(this);
	//this.PosisionUpdate = new mainGame.UpdateScriptV1_0(this,layers.physics.list[7],undefined,()=>{
	//	this.matrixPos[this.matrixPos.length-1]=this.coords;
	//});
	(()=>{//extensions
		this.addDrawing=(colour=this.colour)=>{
			this.colour=colour;
			this.Draw = new mainGame.UpdateScriptV1_0(this,layers.draw.list[4],undefined,()=>{
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
				this.areaDetectorScript = new mainGame.UpdateScriptV1_0(this,layers.detectors.list[3],undefined,()=>{
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
		this.addCamera=(isPlayer=false,isActive=true,)=>{

			this.cameraObj=new Space.Camera().addDraw();
			this.type.camera=true;
			this.viewLayer=this.cameraObj.layerDraw; //layers.draw;
			this.active=isPlayer;
			if(isPlayer){
				this.view_rect=[0,0,Draw.width,Draw.height]
				this.draw_view = new mainGame.UpdateScriptV1_0(this,layers.mainDraw.list[1],undefined,function(a,b){
					this.sprite.getSpaceLayers();
					if(!this.sprite.active)return;
					const sprite=this.sprite;
					ctx.save();
					ctx.beginPath();
					ctx.rect(...this.sprite.view_rect);
					ctx.clip();
					ctx.translate(this.sprite.view_rect[0]+this.sprite.view_rect[2]/2,this.sprite.view_rect[1]+this.sprite.view_rect[3]/2)//ctx.translate(Draw.width/2,Draw.height/2);
					Draw.transform(Space.Pos.add(sprite.matrixPos,sprite.cameraObj.pos));
					ctx.translate(-sprite.coords[0],-sprite.coords[1]);
					sprite.viewLayer.onUpdate();
					ctx.restore();
				},true);
			}
			else{
				this.draw_view = new mainGame.UpdateScriptV1_0(this,layers.draw.list[4],undefined,function(){
					if(!this.sprite.active)return;
					Draw.undoTransform(this.sprite.matrixPos);
					this.sprite.viewLayer.onUpdate();
					Draw.transform(this.sprite.matrixPos);
				},true);
			}
			
			this.getSpaceLayers=function(){
				let objs=this.cameraObj.viewSearch(this.layer.list,this.viewFilter);
				this.cameraObj.viewList=objs;
				return objs;
			}
			this.objFinderUS=new mainGame.UpdateScriptV1_0(this,layers.detectors.list[3],undefined,function(){
				this.sprite.getSpaceLayers();
			},true);
			//this.updateScriptList.push(this.draw_view);
			switch(this.type.shape){
				case"circle":
				this.viewFilter1=(relPos)=>{
					const obj=relPos.obj;
					const originObj=this;
					let doElse=false;//unused variable
					if(obj.type==undefined)return true;
					if(obj.type.portal!=undefined){
						let dist,c,c1,dif;
						//basic1 isn't used
						if(obj.type.portal.basic1==true){//let difference in matrix's=0;
							//searchSpaceLayer
							let dist,c,c1,dif;
							switch(obj.type.shape){
								case "line":
									c=obj.vec_set(this.coords,obj.pos);
									//c=dif.vec;
									c[1]=c[1]/obj.width;//all but coords[0]
									dist=Math.len2(c)-this.size-obj.size;
								break;
								case "circle":
									c=Math.len2(relPos.coords,this.coords);
									dist=c-this.size-obj.size;
								break;
								case "wall"://vector wall
									c=Math.rotate(Math.dif2(this.coords,relPos.coords),-Math.getAngle(relPos.velocity,0,1),0,1);
									c[0]=c[0]>0?Math.max(0,c[0]-Math.len2(relPos.velocity)):c[0];
									dist=Math.len2(c);
								break;
								default:
									c=Math.len2(relPos.coords,this.coords);
									dist=c-this.size;
							}
							if(dist<=0)return true;
							else return false;
						}
						else if(obj.type.portal.camera_v1){///to do: make more effisient!!
							//check in range
							let obj=relPos.obj.parent();
							let vecA=relPos.vec(obj.vec1,relPos.pos);
							//let vecB=relPos.vec(obj.vec1,relPos.obj.getCamPos(relPos.pos));
							c=Math.rotate(Math.dif2(this.coords,vecA),-Math.getAngle(relPos.vecT1(obj.vec2,relPos.pos),0,1),0,1);
							c[0]=c[0]>0?Math.max(0,c[0]-Math.len2(obj.vec2)):c[0];
							dist=Math.len2(c)-this.size;
							if(dist>0)return false;
							//if(Math.len2(vecA)>=Math.len2(vecB))return false;
							//check view angles -> prevent repeating portals
							if(c[1]!=0)if((c[1]>0)!=obj.side)return false;
							return true;
						}
						else if(obj.type.portal.layer){//unused portal type
						}
						switch(obj.type.shape){
							case "wall"://vector wall
								c=Math.rotate(Math.dif2(this.coords,relPos.coords),-Math.getAngle(relPos.vec(relPos.velocity,this.pos),0,1),0,1);
								c[0]=c[0]>0?Math.max(0,c[0]-Math.len2(relPos.obj.vec2)):c[0];
								dist=Math.len2(c)-this.size;
							break;
							case undefined:
								return true;

							default:
							//if(relPos.pos.vec[0]!=0){console.log(relPos.pos.vec);alert("it works");}
								c=Math.len2(relPos.coords,this.coords);
								dist=c-this.size;
						}
						if(dist<=0){
							return true;
						}
						else{
							return false;
						}
					}
					if(1&&obj.type.shape){
						let dist,c,c1,dif;
						switch(obj.type.shape){
							case "wall"://vector wall
								c=Math.rotate(Math.dif2(this.coords,relPos.coords),-Math.getAngle(relPos.vec(relPos.velocity,this.pos),0,1),0,1);
								c[0]=c[0]>0?Math.max(0,c[0]-Math.len2(relPos.obj.vec2)):c[0];
								dist=Math.len2(c)-this.size;
							break;
							case"circle":
								c=Math.len2(relPos.coords,this.coords);
								dist=c-this.size;
								if(dist<=0)return true;
							break;
							default:
							//if(relPos.pos.vec[0]!=0){console.log(relPos.pos.vec);alert("it works");}
							c=Math.len2(relPos.coords,this.coords);
							dist=c-this.size;
						}
						if(dist<=0){
							return true;
						}
						else{
							return false;
						}
					}
					return true;
				}
				break;
				case"rect":
				this.viewFilter1=function(relPos){
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
			this.viewFilter=(relPos)=>this.viewFilter1(relPos);
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
				velocity:[0,0],
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
				update1:new mainGame.UpdateScriptV1_0(this,layers.physics.list[2],undefined,()=>{
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
		this.addPhysics2=()=>{
		};
		this.addTraverseable=()=>{
			this.Movement={
				update:new mainGame.UpdateScriptV1_0(this,layers.moveMent.list[8],undefined,()=>{
					this.coords=Math.addVec2(this.coords,this.velocity);
				},true),
			};
			return this;
		}
		//this.addTraverseable();
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
			this.Draw=new mainGame.UpdateScriptV1_0(this,layers.mainDraw.list[7],undefined,()=>{
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
