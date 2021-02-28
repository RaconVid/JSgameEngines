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
					if(0){
						//window.myER1=(()=>{let a=[];list.map(v=>{if(a.indexOf(v.obj)==-1)a.push(v.obj);});return a;}) ();
						//window.myER2=arguments;
						//window.myER3=list.map(v=>([myER1.indexOf(v.obj),...v.pos.vec]));
						//window.myER4=(()=>{let a=myER3.map(v=>v.join(","));let b={};for(let i of a){if(!(i in b))b[i]=1;else b[i]++;}return b;})();
						//console.log("portal error: ",window.myER1);
						console.error("portal error: ",camPos);
						debugger;
						alert("ERROR:too many portal levels : "+n+", list:"+list.length);
						throw "ERROR:too many portal levels : "+n+", list:"+list.length;
					}
					return true;
				}
				return false;
			}
			get viewSearch(){return this.viewSearchV1_2}
			set viewSearch(val){this.viewSearchV1_2=val;}
			viewSearchV1_1(objs,filter,list,pos,n,portalFilter,portalList,toDo){
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
					/*TESTING*/if(!TESTING)if(obj.obj==this)continue;
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
							toDo.push(()=>this.viewSearchV1_1(obj.obj.list,filter,list,newPos,n+1,portalFilter,portalList,toDo));//obj1.pos
						}
					}
					if(this.portalFilter)if(!this.portalFilter(obj1))continue;
					//if(portalFilter)if(!portalFilter(obj1))continue;
					toDo.push(()=>obj.obj.viewSearchV1_1(undefined,filter,list,camPos,n+1,({}.u),portalList,toDo));
				}
				if(n<2){
					for(let i=0;i<4000&&toDo.length>0;i++){
						toDo.shift()();
					}
				}
				return list;
			}
			static *viewSearchV1_2(camRelPos){
				for(let relPos of relPos.pos.layer){
					let obj=relPos;
					yield relPos;
				}
			}
			static viewSearchOld(objs,filter,list,pos,n,portalFilter,portalList){
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
						if(this.viewList[i].obj.Draw)
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
		/*RelPos:class{
			constructor(obj,pos=new Space.Pos(),posT1=new Space.Pos()){
				this.obj=obj;
				this.pos=pos;
				//this.layer=
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
		},*/
		RelPos:class RelPos{
			constructor(obj,pos=new Space.Pos(),posT1){//posT1=new Space.Pos()
				//objVal=object one level up (this.objVal is a relPos or an entity)
				//obj=top level object (this.obj is an entity)
				this.relObj=obj;
				this.obj=(obj instanceof this.constructor)?obj.obj:obj;
				this.pos=pos;
				this.proxy=this;//new Proxy(this,this);
				this.this=this;
				//return new Proxy(this,this);
			}//receiver.prop=()=>target.prop;
			//obj,property,relPos
			get(obj, prop, proxy){//obj == relpos == this
				if(prop in this)return this[prop];
				return this.obj[prop];
			}
			set(obj, prop, value,proxy){
				if(prop in this)this[prop]=value;
				else this.obj[prop]=value;
				return true;
			}
			get coords(){
				return this.vec(this.relObj.coords,this.pos);
			}
			get velocity(){
				return this.vecT1(this.relObj.velocity,this.pos);
			}
			set coords(vec){
				this.relObj.coords = this.vec_set(vec,this.pos);
			}
			set velocity(vec){
				this.relObj.velocity = this.vecT1_set(vec,this.pos);
			}
			vec(vec,pos=this.pos){
				//return [pos.vec[0]+vec[0],pos.vec[1]+vec[1]];
				const a=vec;
				const b=pos;
				return [
					b.vec[0]+a[0]*b.mat[0][0]+a[1]*b.mat[1][0],
					b.vec[1]+a[0]*b.mat[0][1]+a[1]*b.mat[1][1]
				];
			}
			vecT1(vec,pos=this.pos){//vec*time^-1
				//return [vec[0],vec[1]];
				const a=vec;
				const b=pos;
				return [
					a[0]*b.mat[0][0]+a[1]*b.mat[1][0],
					a[0]*b.mat[0][1]+a[1]*b.mat[1][1]
				];
			}
			vec_set(vec,pos=this.pos){
				//return [vec[0]-pos.vec[0],vec[1]-pos.vec[1]];
				let det=1/(pos.mat[0][0]*pos.mat[1][1]-pos.mat[0][1]*pos.mat[1][0]);
				return[
					det*((vec[0]-pos.vec[0])*pos.mat[0][0]-(vec[1]-pos.vec[1])*pos.mat[1][0]),
					det*((vec[1]-pos.vec[1])*pos.mat[1][1]-(vec[0]-pos.vec[0])*pos.mat[0][1]),
				];
			}
			vecT1_set(vec,pos=this.pos){//vec*time^-1
				//return [vec[0],vec[1]];
				let det=1/(pos.mat[0][0]*pos.mat[1][1]-pos.mat[0][1]*pos.mat[1][0]);
				return[
					det*(vec[0]*pos.mat[0][0]-(vec[1])*pos.mat[1][0]),
					det*(vec[1]*pos.mat[1][1]-(vec[0])*pos.mat[0][1]),
				];
			}
		},
		Pos:class{
			constructor({vec,mat,layer}={}){
				if(vec)this.vec=vec;
				if(mat)this.mat=mat;
				if(layer)this.layer=layer;
			}
			mat=[[1,0],[0,1]];
			vec=[0,0];
			//layer=undefined;
			add(b){
				return new this.constructor({
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
			minus(b){
				let a;
				if(b==undefined){
					b=this;
					a=new this.constructor();
				}
				a=this;
				let det=1/(b.mat[0][0]*b.mat[1][1]-b.mat[0][1]*b.mat[1][0]);
				return new this.constructor({
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
				});
			}
			static add(a=new this,b=new this){
				return new this({
					mat:[
						[
							a.mat[0][0]*b.mat[0][0]+a.mat[0][1]*b.mat[1][0],
							a.mat[0][0]*b.mat[0][1]+a.mat[0][1]*b.mat[1][1]
						],
						[
							a.mat[1][0]*b.mat[0][0]+a.mat[1][1]*b.mat[1][0],
							a.mat[1][0]*b.mat[0][1]+a.mat[1][1]*b.mat[1][1]
						]
					],
					vec:[
						b.vec[0]+a.vec[0]*b.mat[0][0]+a.vec[1]*b.mat[1][0],
						b.vec[1]+a.vec[0]*b.mat[0][1]+a.vec[1]*b.mat[1][1]
					]
				})
			}
			static minus(a=new this,b=new this){
				let det=1/(b.mat[0][0]*b.mat[1][1]-b.mat[0][1]*b.mat[1][0]);
				return new this({
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
				});
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
				super(obj);
				//Detachable.call(this);
				this.id=NaN;
				this.obj=obj;
				this.objVal=obj;
				this.pos=new Space.Pos({layer:layer});
				this.insideGoTo=false;
				if(layer){
					this.attach(layer);
				}
			}
			goto(){

			}
			get coords(){
				if(this.insideGoTo){
					return this.obj.coords;
				}
				else{
					return this.vec(this.obj.coords,this.pos);
				}
			}
			set coords(val){
				if(this.insideGoTo){
					this.obj.coords=coords;
				}
				else{
					this.insideGoTo=true;
					this.goto(this.vec_set(val,this.pos));
					this.insideGoTo=false;
				}
			}
			getProxy(){//un-used
				return this.proxy;
			}
			//attachers
				//obsolete = dont use 
				get layer(){return this.pos.layer};//obsolete
				set layer(v){this.pos.layer=v};//obsolete
				attachScripts(layer=this.layer){//obsolete
					this.attachLayer(layer);
				}
				detachScripts(layer=this.layer){//obsolete
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
					layer.list.push(this);//this.proxy
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
				this.type={chunk:true};
				this.list=list;//[Entity,Entity];layer.list[i].get_coords; or
			}
			*[Symbol.iterator](){//unfinished
				for(let i of this.list){
					yield this.list[i];
				}
			}
		},
		Entity:class{// extends refEntity //Entity
			constructor(layer=undefined){
				Space.addEntity.call(this,layer);
			}
			coords=[0,0];
			velocity=[0,0];
			type={};
		},
		DrawSymbol:Symbol("Draw"),//unused
		addEntity(layer=undefined){//addEntity.call(this)
			//Detachable.call(this);
			const prototype={
				coords:[0,0],
				velocity:[0,0],
				pos:new Space.Pos(),
				layer:null,
				refEntity:new Space.RefEntity(this,layer),
				type:{},

				goto(coords){return this.refEntity.goto(...arguments);},
				clone(){return Object.create(this)},
				delete(){this.refEntity.detach();},
			};
			for(let i in prototype){
				if(!(i in this)){
					this[i]=prototype[i];
				}
			}
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
					for(let i in this.scripts){//for(let i=0;i<this.scripts.length;i++){
						let relPos1={
							pos:relPos.pos,
							scriptObj:this.scripts[i][0],
							onUpdate:function(layer,i){
								ctx.save();
								ctx.translate(...Math.minusVec2(relPos.coords,relPos.pos.vec));
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
class Sprite{
	constructor(oldObj){
		this.add=this.constructor.addSprite(this);
	}
	static constructorShell(){
		let newObj=new Sprite.addSprite({
			coords:[0,0],
			velocity:[0,0],
			mass:10,
			size:10,
			deleteList:[//part of object.delete();
				()=>{

				}
			],
			//...other properties
		});
		newObj.scripts={
			script1:new mainGame.Script(layers=>layers.update.list[5],function*(){
				while(true){

					yield;
				}
			}.bind(newObj)),
			//...other scripts
		};
		newObj.Draw.scripts=[
			[()=>{
				
			},draw=>draw.list[4]],
			//...other Drawing scripts
		];
	}
	static constructorExample(){
		let newObj=new Sprite.addSprite({
			coords:[0,0],
			velocity:[0,0],
			mass:10,
			size:10,
			//...other custom properties/variables
		});
		newObj.scripts={
			update5:new mainGame.Script(layers=>layers.update.list[5],function*(){
				let moveTo=[0,0];
				while(true){
					let startTime=mainGame.time.start;
					let c1=this.coords;
					let c2=Math.addVec2(this.coords);
					do{
						//this.goto(Math.lerp2())
						yield;
					}while(1>=mainGame.time.start-startTime)
					yield;
				}
			}.bind(newObj)()),
			script7:new mainGame.Script(layers=>layers.physics.list[7],function*(){
				
			}.bind(newObj)()),
			//...other scripts
		};
		newObj.Draw.scripts=[
			[()=>{
				Draw.circle(0,0,10,"grey");
			},draw=>draw.list[4]],
			//...other Drawing scripts
		];
	}
	static addSprite(obj={}){
		obj;
		let construct={
			coords:[0,0],
			velocity:[0,0],
			mass:10,
			size:10,
			scripts:{},
			Draw:{scripts:[[()=>Draw.circle(0,0,obj.size,"grey"),d=>d.list[5]]],},
			cloneList:[],//list of constructor(clone) functions
			deleteList:[],//list of de-refference funcions
			...obj,
		}
		Space.addEntity.call(
		Space.addDrawUpdates.call(
		Object.defineProperties(obj,Object.getOwnPropertyDescriptors({
			...construct,
			scripts:{
				detachScripts(){
					for(let i in this){
						if(typeof this[i]=="object"){
							if(this[i].detach)this[i].detach();
							else if(this[i].return)this[i].return();
						}
					}
				},
				...construct.scripts,
			},
			deleteList:[
				function(){
					this.scripts.detachScripts();
					this.camera.detachScripts();
					this.refEntity.detachLayer();
				}.bind(obj),
				...construct.deleteList,
			],
			clone(){},
			delete(){
				for(let i=0;i<this.detachList.length;i++){
					this.detachList[i]();
				}
			},
			type:{shape:"circle",...construct.type},
			goto(coords){this.refEntity.coords=coords;},
			*viewSearch(){
				yield*this.camera.cameraObj.viewList;
			},
			get layer(){return this.refEntity.layer},
			set layer(layerNew){
				this.refEntity.detach();
				this.refEntity.attach(layerNew);
			},
			camera:Collider.call({
				entity:obj,
				get coords(){return this.entity.coords;},
				get velocity(){return this.entity.velocity;},
				get layer(){return this.entity.layer;},
			}).addCamera(),
		})),construct.Draw.scripts));
		obj.type.Sprite_v1=true;
		if(!obj.layer)obj.layer=world.chunk1;
		return obj;
	}
	static add={
		movement:{
			GoTo:function(newReattach){
				let movement={};
				const moveBail=200;
				const tollerance=Math.pow(2,-20*0);
				let oldLayer,hitWall,objsInView,lastPortal,minObj,minDist,coordsPointer;
				let goTo,coords,layer,self;
				let reattach=function(oldLayer,layer){
					//this.entRef.main.detach(oldLayer);
					//this.entRef.main.attach(layer);
					this.layer=layer;
				};
				if(newReattach!=undefined){
					reattach=newReattach;
				}
				const GoTo=function(newCoords){//walls and portal
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
								onMove1_1_searchView();
							}
							if(Math.len2(coords,goTo)==0)break;
						}
						if(i>=moveBail){console.error("movement error",i);alert("ERROR: movement error"+i)}

				};
				const onMove1_1_searchView=function(){
					oldLayer=layer;
					//find Objs In view (walls/portals)
					objsInView=[];
					let list;
					try{
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
		properties:{

		}
	}
};
Space.Sprite=Sprite;
Space.RefEntity.prototype.goto=Sprite.add.movement.GoTo(function(oldLayer,newLayer){
	if(!isNaN(this.id)){
		this.detach(oldLayer);
		this.attach(newLayer);
	}
});
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
					this.objsInHitbox=this.cameraObj.viewSearchV1_1(this.layer,this.detectorFilter)
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
					Draw.undoTransform(sprite.cameraObj.pos.add(sprite.matrixPos));
					ctx.translate(-sprite.coords[0],-sprite.coords[1]);
					sprite.viewLayer.onUpdate();
					ctx.restore();
				},true);
			}
			else{
				this.draw_view = new mainGame.UpdateScriptV1_0(this,layers.draw.list[4],undefined,function(){
					if(!this.sprite.active)return;
					Draw.undoTransform(sprite.cameraObj.pos.add(sprite.matrixPos));
					this.sprite.viewLayer.onUpdate();
					Draw.transform(this.sprite.matrixPos);
				},true);
			}
			
			this.getSpaceLayers=function(){
				let objs=this.cameraObj.viewSearchV1_1(this.layer.list,this.viewFilter);
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
						if(obj.type.portal.camera_v1){///to do: make more effisient!!
							//check in range
							let obj=relPos.obj.parent();
							let vecA=relPos.vec(obj.vec1,relPos.pos);
							//let vecB=relPos.vec(obj.vec1,relPos.obj.getCamPos(relPos.pos));
							c=Math.rotate(Math.dif2(this.coords,vecA),-Math.getAngle(relPos.vecT1(obj.vec2,relPos.pos),0,1),0,1);
							c[0]=c[0]>0?Math.max(0,c[0]-Math.len2(obj.vec2)):c[0];
							dist=Math.len2(c)-this.size;
							if(dist>0)return false;
							if(Math.len2(relPos.pos.vec)!=0){
								let posA=relPos.obj.getCamPos();
								if(
									(
										Math.ceil(Math.getAngle(posA.vec,0,1)/Math.PI/2*4)+8-
										Math.ceil(Math.getAngle(relPos.pos.vec,0,1)/Math.PI/2*4)
										+1
									)%4<1
								)return false;
							}
							//if(Math.len2(vecA)>=Math.len2(vecB))return false;//if movingCloser->false
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
					if(obj.type.portal!=undefined)return true;
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
			if(!("mass"in this))this.mass=1;
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
						let relPos=this.Physics.minObj;let obj=relPos.obj;
						switch(obj.type.shape){
							case"circle":
								let dif=Math.minusVec2(Math.addVec2(this.coords,this.velocity),Math.addVec2(relPos.coords,relPos.velocity));
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
								relPos.velocity=vel1[1];
								if(len>0&&len<(this.size+obj.size)){
									if(this.type.movable!==false)
										this.coords=Math.lerpV(this.coords,relPos.coords,(len-this.size-obj.size)/len/(1+(obj.type.movable!==false)));
									if(obj.type.movable!==false)
										relPos.coords=Math.lerpV(relPos.coords,this.coords,(len-this.size-obj.size)/len/(1+(this.type.movable!==false)));
								}
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
					//for(let i=0;i<this.layer.list.length;i++){
					for(let relPos of this.layer.viewSearch()){//this.size*4)){
						let obj=relPos.obj;//this.layer.list[i];
						if(obj==this)continue;
						if(obj.type!=undefined)if(obj.type.shape!=undefined&&obj.type.physical!=undefined){
							let normal,obj_dist,obj_time,normal2, dif,len,sizeSum;
							switch(obj.type.shape){
								case "circle":
									sizeSum=(this.size+obj.size);
									dif=Math.minusVec2(Math.addVec2(this.coords,this.velocity),relPos.coords);//relPos.velocity));
									len=Math.len2(dif)-sizeSum;
									if(len<0){
										normal=Math.minusVec2(this.coords,relPos.coords);
										obj_dist=Math.len2(normal);
										if(obj_dist!=0){
											obj_dist-=sizeSum;
											if(obj_dist<len){//collide
												obj_dist=(obj_dist-len);
											}
											else{
												obj_dist=len;
											}
											if(obj_dist<minCTime&&obj_dist<0){
												minCTime=obj_dist;
												minObj=relPos;
											}
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
				update1:new mainGame.UpdateScriptV1_0(this,layers.physics.list[6],undefined,()=>{
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
}//old collider
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
