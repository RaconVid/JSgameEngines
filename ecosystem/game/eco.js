(function(){//load main game
	{
		mainGame=new MainGame()
		mainGame.layers={
			update:new mainGame.UpdateLayer(),
			physics:new mainGame.UpdateLayer(),
			draw:new mainGame.UpdateLayer(),
			mainDraw:mainGame.mainLayers.draw,
			detectors:new mainGame.UpdateLayer(),
			moveMent:new mainGame.UpdateLayer(),
		};
		for (let i = 0; i < 10; i++) {
			mainGame.layers.update.list[i]=new mainGame.UpdateLayer();
			mainGame.layers.physics.list[i]=new mainGame.UpdateLayer();
			mainGame.layers.draw.list[i]=new mainGame.UpdateLayer();
			mainGame.layers.mainDraw.list[i]=new mainGame.UpdateLayer();
			mainGame.layers.detectors.list[i]=new mainGame.UpdateLayer();
			mainGame.layers.moveMent.list[i]=new mainGame.UpdateLayer();
		}
		mainGame.updateOrder=[
			mainGame.layers.detectors,
			mainGame.layers.update,
			mainGame.layers.physics,
			mainGame.layers.moveMent,
			mainGame.layers.mainDraw,
		];
		//mainGame.layers.mainDraw.list[4]=mainGame.layers.draw;
	}
	let L=mainGame.layers;
	world={};
	world.chunk1=new Space.Chunk();
	world.player=(()=>{
		let newObj={
			speed:200,
		};
		Collider.call(Detachable.call(newObj),world.chunk1);
		newObj.addCamera(true);
		newObj.cameraObj.pos.mat=[[1,0],[0,1]];
		newObj.coords=[40,40]
		newObj.matrixPos.vec[0]=Draw.width/4;
		newObj.draw_view.onUpdate=function(layer,i){
			ctx.save();
			ctx.beginPath();
			//ctx.translate(Draw.width*2/4,0);
			ctx.rect(0,0,Draw.width/2,Draw.height);
			ctx.clip();
			this.script(layer,i);
			ctx.restore();
		}

		newObj.size=300;
		newObj.entity=new Space.RefEntity(newObj,world.chunk1);
		newObj.movement=function(){
			let moveIputs=[
				1*((0*Inputs.getKey("d").down||Inputs.getKey("ArrowRight").down)-(0*Inputs.getKey("a").down||Inputs.getKey("ArrowLeft").down)),
				1*((0*Inputs.getKey("s").down||Inputs.getKey("ArrowDown").down)-(0*Inputs.getKey("w").down||Inputs.getKey("ArrowUp").down)),
			];
			let moveVec=Math.lerpT2(this.velocity,Math.scaleVec2(moveIputs,this.speed*mainGame.time.delta),0.999,mainGame.time.delta);
			this.velocity=moveVec;
			//this.coords=Math.addVec2(this.coords,this.velocity);
		};
		newObj.update1=new mainGame.UpdateScript(newObj,L.update.list[4],undefined,function(){
			this.sprite.movement();
		},true);
		newObj.draw1=(()=>{
			let obj=new mainGame.UpdateScript(newObj,L.draw.list[4],undefined,function(){
				let p=this.sprite;
				ctx.save();
				//Draw.undoTransform()
				ctx.translate(p.coords[0],p.coords[1]);
				Draw.circle(0,0,10,"blue");
				ctx.fillStyle="#B0F0F0B0";
				ctx.textAlign = "center"; 
				ctx.font="10px Arial";
				ctx.fillText([Math.round(p.coords[0]),Math.round(p.coords[1])],0,0);
				ctx.restore();
				this.isDeleting=true;
			});
			return obj;
		})();
		Space.addDrawUpdates.call(newObj,[
			[newObj.draw1,(layer)=>layer.list[4]]
		]);
		return newObj;
	})();
	if(false)world.player2=(()=>{
		let makeChunk=function(oldChunk,oldSide){//adjacentLayers
			let newChunk=new Space.Chunk();
			newChunk.portals={};
		}
		let chunk2=new Space.Chunk();
		let entity={//~= sprite level
			//vars:{
				move:[0,0],
				goTo:[0,0],//coords
				keys:{w:0,a:0,s:0,d:0,},
				objsInView:[],
				minObj:null,
				minDist:Infinity,
				oldLayer:null,
				moveBail:10,
				lastPortal:null,
			//},
			//globals:{

			//},
			//scripts
				onStart:function(layer,id){
					layer.list[id].isDeleting=true;
				},
				onUpdate1:function(layer,id){
					//movement1
						this.move=[this.isKey("d")-this.isKey("a"),this.isKey("s")-this.isKey("w")];
						this.move=Math.scaleVec2(this.move,200*mainGame.time.delta);
						this.goTo=Math.addVec2(this.coords,this.move);
					//get Objs
						this.objsInView=CloneTo(camera.viewList,this.objsInView);
					//rock/paper/scissors
				},
				onMove1:function(layer,id){//movement2
					//find Objs In view (walls/portals) and teteport
						this.onMove1_1_searchView();
						this.lastPortal=null;
						let moveBail=this.moveBail;//10
						for(let i=0;i<moveBail;i++){
							this.onMove1_2_others();
							if(this.oldLayer!=this.layer){
								this.onMove1_1_searchView();
							}
						}
				},
			//----
			//procedures:{
				onMove1_1_searchView:function(){
					this.oldLayer=this.layer;
					//find Objs In view (walls/portals)
					this.objsInView=[];
					let list=this.layer.list;
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
								this.objsInView.push(list[i]);
							}
							else{
								Error();
							}
						}
						catch(error){try{
							let wallType=list[i].obj.type.wall;
							if(wallType.basic_v1){
								this.objsInView.push(list[i]);
							}
						}catch(error){}}
					}
				},
				onMove1_2_others:function(){
					//find nearest wall/portal
						let list=this.objsInView;
						this.minObj=null;
						this.minDist=Math.len2(this.goTo,this.coords);
						for(let i=0;i<list.length;i++){
							if(list[i].obj==this.lastPortal)continue;
							if(this.minDist==0)break;
							if(list[i].obj==undefined){console.log(list[i].obj);alert(":(")}
							let wallType=list[i].obj.type.wall;
							if(wallType.vector){
								let dif=Math.dif2(list[i].obj.vec1,this.coords);
								let difVec=list[i].obj.vec2;
								let ang=Math.getAngle(Math.dif2(this.goTo,this.coords),0,1);
								dif=Math.rotate(dif,-ang,0,1);
								difVec=Math.rotate(difVec,-ang,0,1);
								if(difVec[1]==0)continue;
								let time=-dif[1]/difVec[1];
								let collideX=(dif[0]+time*difVec[0]);
								if(!((time>=0&&time<=1)&&(collideX>=0&&collideX<=Math.len2(this.goTo,this.coords))))continue;
								//else collide (wall is in the way)
								if(collideX<this.minDist){
									this.minDist=collideX;
									this.minObj=list[i];
								}
							}
							else{
								console.error("::no support for type::",type);alert("support ERROR");
							}
						}
					//collide
						let len=Math.len2(this.goTo,this.coords);
						let coordsPointer=this.coords;
						if(len!=0){
							this.coords=Math.lerp2(this.coords,this.goTo,this.minDist/len);
						}
						if(this.minObj!=null){
							let obj=this.minObj.obj;
							let wallType=obj.type.wall;
							try{
								let portalType=obj.type.portal;
								if(portalType.basic_v1){
									this.coords=Math.addVec2(Math.minusVec2(this.coords,obj.vec1),obj.portalB().vec1);
									this.layer=obj.portalB().layer;
									this.lastPortal=obj.portalB();
								}
							}catch(error){}
						}
						this.coords=CloneTo(this.coords,coordsPointer);
					//move entRefs if needed
						if(this.oldLayer!=this.layer){
							this.entRef.main.detach(this.oldLayer);
							this.entRef.main.attach(this.layer);
						}
				},
				isKey:function(k){
					if(k.length==1)return Inputs.getKey(k.toLowerCase()).down||Inputs.getKey(k.toUpperCase()).down;
					return Inputs.getKey(k).down;
				},
			//}
			entRef:{
				main:null,
				portaled:[],
			},
			coords:[40,40],
			velocity:[0,0],
			layer:chunk2,
			pos:new Space.Pos(),
			constructor:function(){

			},
			destructor:function(){

			},
			entityRefs:[],//
			onEventsList:[],
			type:{state:true},
			keywords:{
				all:1,
			},
		};
		let drawing={
			d1:[new mainGame.UpdateScript(undefined,undefined,undefined,function(layer,id){
				Draw.square(entity.coords[0],entity.coords[1],10+5*(entity.layer!=world.chunk1),"green");
			}),(draw)=>draw.list[4]],
		};
		entity.drawing=drawing;
		Space.addDrawUpdates.call(entity,[drawing.d1]);
		entity.entRef.main=new Space.RefEntity(entity,entity.layer);
		entity.entityRefs=[
			entity.main,
		];
		entity.onEventsList=[
			new mainGame.UpdateScript(null,mainGame.layers.physics.list[1],undefined,(l,i)=>entity.onStart(l,i)),
			new mainGame.UpdateScript(null,mainGame.layers.physics.list[4],undefined,(l,i)=>entity.onUpdate1(l,i)),
			new mainGame.UpdateScript(null,mainGame.layers.physics.list[7],undefined,(l,i)=>entity.onMove1(l,i)),
		];
		let camera=Collider.call({},world.chunk1).addCamera(true);
		camera.size=400;
		camera.matrixPos.vec[0]=Draw.width/4;
		camera.draw_view.onUpdate=function(layer,i){
			ctx.save();
			ctx.beginPath();
			ctx.translate(Draw.width*2/4,0);
			ctx.rect(0,0,Draw.width/2,Draw.height);
			ctx.clip();
			this.script(layer,i);
			ctx.restore();
		}
		Object.defineProperties(camera,{
			coords:{get:function(){return entity.coords;}},
			velocity:{get:function(){return entity.velocity;}},
			layer:{get:function(){return entity.layer;}},
		});
		let newObj={
			camera:camera,
			entity:entity,
		};
		return newObj;
	})()
	world.player3=((r_p_s=0)=>{
		let makeChunk=function(oldChunk,oldSide){//adjacentLayers
			let newChunk=new Space.Chunk();
			newChunk.portals={};
		}
		let chunk2=new Space.Chunk();
		let entity={//~= sprite level
			//vars:{
				move:[0,0],
				goTo:[0,0],//coords
				keys:{w:0,a:0,s:0,d:0,},
				objsInView:[],
				minObj:null,
				minDist:Infinity,
				oldLayer:null,
				moveBail:10,
				lastPortal:null,
			//},
			//globals:{

			//},
			//scripts
				onStart:function(layer,id){
					layer.list[id].isDeleting=true;
				},
				onUpdate1:function(layer,id){
					//movement1
						this.move=[this.isKey("d")-this.isKey("a"),this.isKey("s")-this.isKey("w")];
						this.move=Math.scaleVec2(this.move,200*mainGame.time.delta);
						this.goTo=Math.addVec2(this.coords,this.move);
					//get Objs
						this.objsInView=CloneTo(camera.viewList,this.objsInView);
					//rock/paper/scissors
				},
				onMove1:function(layer,id){//movement2
					//find Objs In view (walls/portals) and teteport
						this.onMove1_1_searchView();
						this.lastPortal=null;
						let moveBail=this.moveBail;//10
						for(let i=0;i<moveBail;i++){
							this.onMove1_2_others();
							if(this.oldLayer!=this.layer){
								this.onMove1_1_searchView();
							}
						}
				},
			//----
			//procedures:{
				onMove1_1_searchView:function(){
					this.oldLayer=this.layer;
					//find Objs In view (walls/portals)
					this.objsInView=[];
					let list=this.layer.list;
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
								this.objsInView.push(list[i]);
							}
							else{
								Error();
							}
						}
						catch(error){try{
							let wallType=list[i].obj.type.wall;
							if(wallType.basic_v1){
								this.objsInView.push(list[i]);
							}
						}catch(error){}}
					}
				},
				onMove1_2_others:function(){
					//find nearest wall/portal
						let list=this.objsInView;
						this.minObj=null;
						this.minDist=Math.len2(this.goTo,this.coords);
						for(let i=0;i<list.length;i++){
							if(list[i].obj==this.lastPortal)continue;
							if(this.minDist==0)break;
							if(list[i].obj==undefined){console.log(list[i].obj);alert(":(")}
							let wallType=list[i].obj.type.wall;
							if(wallType.vector){
								let dif=Math.dif2(list[i].obj.vec1,this.coords);
								let difVec=list[i].obj.vec2;
								let ang=Math.getAngle(Math.dif2(this.goTo,this.coords),0,1);
								dif=Math.rotate(dif,-ang,0,1);
								difVec=Math.rotate(difVec,-ang,0,1);
								if(difVec[1]==0)continue;
								let time=-dif[1]/difVec[1];
								let collideX=(dif[0]+time*difVec[0]);
								if(!((time>=0&&time<=1)&&(collideX>=0&&collideX<=Math.len2(this.goTo,this.coords))))continue;
								//else collide (wall is in the way)
								if(collideX<this.minDist){
									this.minDist=collideX;
									this.minObj=list[i];
								}
							}
							else{
								console.error("::no support for type::",type);alert("support ERROR");
							}
						}
					//collide
						let len=Math.len2(this.goTo,this.coords);
						let coordsPointer=this.coords;
						if(len!=0){
							this.coords=Math.lerp2(this.coords,this.goTo,this.minDist/len);
						}
						if(this.minObj!=null){
							let obj=this.minObj.obj;
							let wallType=obj.type.wall;
							try{
								let portalType=obj.type.portal;
								if(portalType.basic_v1){
									this.coords=Math.addVec2(Math.minusVec2(this.coords,obj.vec1),obj.portalB().vec1);
									this.layer=obj.portalB().layer;
									this.lastPortal=obj.portalB();
								}
							}catch(error){}
						}
						this.coords=CloneTo(this.coords,coordsPointer);
					//move entRefs if needed
						if(this.oldLayer!=this.layer){
							this.entRef.main.detach(this.oldLayer);
							this.entRef.main.attach(this.layer);
						}
				},
				isKey:function(k){
					if(k.length==1)return Inputs.getKey(k.toLowerCase()).down||Inputs.getKey(k.toUpperCase()).down;
					return Inputs.getKey(k).down;
				},
			//}
			entRef:{
				main:null,
				portaled:[],
			},
			coords:[40,40],
			velocity:[0,0],
			layer:chunk2,
			pos:new Space.Pos(),
			constructor:function(){

			},
			destructor:function(){

			},
			entityRefs:[],//
			onEventsList:[],
			type:{state:true},
			keywords:{
				all:1,
				//state:{},
				//stats:{},
			},
		};
		switch(r_p_s){
			case 0:
			entity.keywords.rock=1;
			entity.keywords.metalic=false;
			entity.onStart=function(layer,id){
				layer.list[id].isDeleting=true;
				let timers=[0,0,0,0];
				let dirAngle=0;

			}
			entity.onUpdate1_2=function(){

			}
			break;
			case 1:
			entity.keywords.paper=1;
			entity.keywords.metalic=false;
			entity.onUpdate1_2=function(){

			}
			break;
			case 2:
			entity.keywords.scissors=1;
			entity.keywords.metalic=false;
			entity.onUpdate1_2=function(){

			}
			break;
		}
		let drawing={
			d1:[new mainGame.UpdateScript(undefined,undefined,undefined,function(layer,id){
				Draw.square(entity.coords[0],entity.coords[1],10+5*(entity.layer!=world.chunk1),"green");
			}),(draw)=>draw.list[4]],
		};
		entity.drawing=drawing;
		Space.addDrawUpdates.call(entity,[drawing.d1]);
		entity.entRef.main=new Space.RefEntity(entity,entity.layer);
		entity.entityRefs=[
			entity.main,
		];
		entity.onEventsList=[
			new mainGame.UpdateScript(null,mainGame.layers.physics.list[1],undefined,(l,i)=>entity.onStart(l,i)),
			new mainGame.UpdateScript(null,mainGame.layers.physics.list[4],undefined,(l,i)=>entity.onUpdate1(l,i)),
			new mainGame.UpdateScript(null,mainGame.layers.physics.list[7],undefined,(l,i)=>entity.onMove1(l,i)),
		];
		let camera=Collider.call({},world.chunk1).addCamera(true);
		camera.size=400;
		camera.matrixPos.vec[0]=Draw.width/4;
		camera.draw_view.onUpdate=function(layer,i){
			ctx.save();
			ctx.beginPath();
			ctx.translate(Draw.width*2/4,0);
			ctx.rect(0,0,Draw.width/2,Draw.height);
			ctx.clip();
			this.script(layer,i);
			ctx.restore();
		}
		Object.defineProperties(camera,{
			coords:{get:function(){return entity.coords;}},
			velocity:{get:function(){return entity.velocity;}},
			layer:{get:function(){return entity.layer;}},
		});
		let makeWall=function(c1,v1,l1){
			let portalA={
				type:{
					shape:"wall",
					wall:{
						basic_v1:true,
						vector:true,
					},
				},
				vec1:c1,
				vec2:v1,
				layer:l1,
				coords:c1,
				camera:cameraA,
				velocity:[0,0],
			};
		};
		let makePortalSide=function(c1,v1,l1,c2,v2,l2){
			let newObj={
				entityRefs:[],
				type:{
					shape:"wall",
					portal:{
						basic_v1:true,
					},
					wall:{
						basic_v1:true,
						vector:true,
					},
				},
			};
			let cameraA=new Space.Camera().addDraw();
			cameraA.portalFilter=function(relPos){
				return Boolean(relPos.obj.type.portal)//&&relPos.obj!=cameraB;
			}
			cameraA.type.portal={camera_v1:true,};
			cameraA.layerRef=l2;
			cameraA.pos.vec=Math.minusVec2(c2,c1);
			let portalA={
				type:newObj.type,
				vec1:c1,
				vec2:v1,
				layer:l1,
				coords:c1,
				camera:cameraA,
				velocity:[0,0],
			};
			let cameraB=new Space.Camera().addDraw();
			cameraB.portalFilter=function(relPos){
				return Boolean(relPos.obj.type.portal)//&&relPos.obj!=cameraA;
			}
			cameraB.type.portal={camera_v1:true,};
			cameraB.layerRef=l1;
			cameraB.pos.vec=Math.minusVec2(c1,c2);
			let portalB={
				type:newObj.type,
				vec1:c2,
				vec2:v2,
				layer:l2,
				coords:c2,
				camera:cameraB,
				velocity:[0,0],
			};
			portalA.portalB=function(){return portalB;};
			portalB.portalB=function(){return portalA;};
			portalA.parent=function(){return newObj;};
			portalB.parent=function(){return newObj;};
			cameraA.parent=function(){return portalA;};
			cameraB.parent=function(){return portalB;};
			Space.addDrawUpdates.call(portalA,[
				[new mainGame.UpdateScript(undefined,undefined,undefined,function(layer,id){
					Draw.line(
						portalA.vec1[0],
						portalA.vec1[1],
						portalA.vec1[0]+portalA.vec2[0],
						portalA.vec1[1]+portalA.vec2[1],
					4,"#FF880024");
				}),(draw)=>draw.list[4]],
			]);
			Space.addDrawUpdates.call(portalB,[
				[new mainGame.UpdateScript(undefined,undefined,undefined,function(layer,id){
					Draw.line(
						portalB.vec1[0],
						portalB.vec1[1],
						portalB.vec1[0]+portalB.vec2[0],
						portalB.vec1[1]+portalB.vec2[1],
					4,"#0088FF24");
				}),(draw)=>draw.list[4]],
			])
			newObj.portalA=portalA;
			newObj.portalB=portalB;
			newObj.entityRefs=[
				new Space.RefEntity(portalA,portalA.layer),
				new Space.RefEntity(portalB,portalB.layer),
				new Space.RefEntity(cameraA,l1),
				new Space.RefEntity(cameraB,l2),
			];
			return newObj;
		};
		let makePortal=function(c1,v1,l1,c2,v2,l2){
			let newObj={
				entityRefs:[],
				type:{
					shape:"wall",
					portal:{
						basic_v1:true,
					},
					wall:{
						basic_v1:true,
						vector:true,
					},
				},
			};
			let cameraA=new Space.Camera().addDraw();
			cameraA.portalFilter=function(relPos){
				return Boolean(relPos.obj.type.portal)//&&relPos.obj!=cameraB;
			}
			cameraA.type.portal={camera_v1:true,};
			cameraA.layerRef=l2;
			cameraA.pos.vec=Math.minusVec2(c2,c1);
			let portalA={
				type:newObj.type,
				vec1:c1,
				vec2:v1,
				layer:l1,
				coords:c1,
				camera:cameraA,
				velocity:[0,0],
			};
			let cameraB=new Space.Camera().addDraw();
			cameraB.portalFilter=function(relPos){
				return Boolean(relPos.obj.type.portal)//&&relPos.obj!=cameraA;
			}
			cameraB.type.portal={camera_v1:true,};
			cameraB.layerRef=l1;
			cameraB.pos.vec=Math.minusVec2(c1,c2);
			let portalB={
				type:newObj.type,
				vec1:c2,
				vec2:v2,
				layer:l2,
				coords:c2,
				camera:cameraB,
				velocity:[0,0],
			};
			portalA.portalB=function(){return portalB;};
			portalB.portalB=function(){return portalA;};
			portalA.parent=function(){return newObj;};
			portalB.parent=function(){return newObj;};
			cameraA.parent=function(){return portalA;};
			cameraB.parent=function(){return portalB;};
			Space.addDrawUpdates.call(portalA,[
				[new mainGame.UpdateScript(undefined,undefined,undefined,function(layer,id){
					Draw.line(
						portalA.vec1[0],
						portalA.vec1[1],
						portalA.vec1[0]+portalA.vec2[0],
						portalA.vec1[1]+portalA.vec2[1],
					4,"#FF880024");
				}),(draw)=>draw.list[4]],
			]);
			Space.addDrawUpdates.call(portalB,[
				[new mainGame.UpdateScript(undefined,undefined,undefined,function(layer,id){
					Draw.line(
						portalB.vec1[0],
						portalB.vec1[1],
						portalB.vec1[0]+portalB.vec2[0],
						portalB.vec1[1]+portalB.vec2[1],
					4,"#0088FF24");
				}),(draw)=>draw.list[4]],
			])
			newObj.portalA=portalA;
			newObj.portalB=portalB;
			newObj.entityRefs=[
				new Space.RefEntity(portalA,portalA.layer),
				new Space.RefEntity(portalB,portalB.layer),
				new Space.RefEntity(cameraA,l1),
				new Space.RefEntity(cameraB,l2),
			];
			return newObj;
		};
		let portal=makePortal(
			[-200,100],[400,0],world.chunk1,
			[-200,100],[400,0],chunk2,//world.chunk1,
		);
		let newObj={
			portal:portal,
			camera:camera,
			entity:entity,
		};
		return newObj;
	})()
	world.obj1=(()=>{
		const sprite=Space.addEntity.call({type:{}},world.chunk1);
		sprite.entity=new Space.RefEntity(sprite,world.chunk);
		sprite.update=new mainGame.UpdateScript(sprite,L.physics.list[7],undefined,function(){
			const sprite=this.sprite;
			if(sprite.isTouchingPortal){
				sprite.portalObj={pos:{}};
				const portal = sprite.portalObj;
				this.entity.transformPos(portal.Pos);
			}
		});
		sprite.draw= new mainGame.UpdateScript(sprite,L.draw.list[4],undefined,function(){
			let sprite=this.sprite;
			ctx.save();
			ctx.translate(sprite.coords[0],sprite.coords[1]);
			ctx.drawImage(Images.icon,0,0,40,-100);
			ctx.restore();
		});
		Space.addDrawUpdates.call(sprite,[
			[sprite.draw,(layer)=>layer.list[4]],
		]);
		return this;
	})();
	world.obj2=(()=>{
		const sprite=Space.addEntity.call({type:{}},world.chunk1);
		sprite.entity=new Space.RefEntity(sprite,world.chunk);
		sprite.update=new mainGame.UpdateScript(sprite,L.physics.list[7],undefined,function(){
			const sprite=this.sprite;
			let l=mainGame.time.start;
			sprite.coords=[Math.cos(l)*100,Math.sin(l)*100]
		});
		sprite.draw= new mainGame.UpdateScript(sprite,L.draw.list[4],undefined,function(){
			let sprite=this.sprite;
			ctx.save();
			ctx.translate(sprite.coords[0],sprite.coords[1]);
			ctx.drawImage(Images.icon,0,0,10,-40);
			ctx.fillStyle="#9966A044"
			ctx.fillRect(0,0,10,-40)
			ctx.restore();
		});
		Space.addDrawUpdates.call(sprite,[
			[sprite.draw,(layer)=>layer.list[4]],
		]);
		return this;
	})();
	if(false){
		world.portalA=(()=>{
			let newObj=new Space.Portal(world.chunk1);//Collider.call(Detachable.call(new Space.Portal()));
			newObj.pos.vec=[100,0];
			newObj.aa="A";
			newObj.pos.mat=[[1,0],[0,1]];
			newObj.entity=new Space.RefEntity(newObj,world.chunk1);
			//newObj.coords=[0,0];newObj.velocity=[0,0];
			//newObj.addCollider();
			newObj.draw1=new mainGame.UpdateScript(newObj,undefined,undefined,function(){
				const sprite=this.sprite;
				ctx.save();
				Draw.transform(sprite.pos);
				ctx.fillStyle="#00FF0010";
				ctx.fillRect(-sprite.size,-sprite.width,sprite.size*2,sprite.width*2);
				ctx.restore();
			});
			Space.addDrawUpdates.call(newObj,[
				[newObj.draw1,(layer)=>layer.list[6]],
			]);
			return newObj;
		})();
		world.portalB=(()=>{
			let newObj=new Space.Portal(world.chunk1);//Collider.call(Detachable.call(new Space.Portal()));
			newObj.pos.vec=[300,0];
			newObj.aa="B";
			newObj.pos.mat=[[1,0],[0,1]];
			newObj.entity=new Space.RefEntity(newObj,world.chunk1);
			//newObj.addCollider();
			newObj.draw1=new mainGame.UpdateScript(newObj,undefined,undefined,function(){
				const sprite=this.sprite;
				ctx.save();
				Draw.transform(sprite.pos);
				ctx.fillStyle="#FF000010";
				ctx.fillRect(-sprite.size,-sprite.width,sprite.size*2,sprite.width*2);
				ctx.restore();
			});
			Space.addDrawUpdates.call(newObj,[
				[newObj.draw1,(layer)=>layer.list[6]],
			]);
			return newObj;
		})();
		world.portalA.portalB=world.portalB;
		world.portalB.portalB=world.portalA;
	}
	if(false)world.portal=(()=>{
		let newObj=new Space.Camera();//Collider.call(Detachable.call(new Space.Portal()));
		newObj.pos.vec=[100,0];
		newObj.pos.mat=[[0,1],[-1,0]];
		newObj.coords=[-3,40];
		newObj.entity=new Space.RefEntity(newObj,world.chunk1);
		newObj.draw1=new mainGame.UpdateScript(newObj,undefined,undefined,function(){
			const sprite=this.sprite;
			Draw.circle(0,0,10,"green");
		});
		addSpaceDrawer.call(newObj,[
			[newObj.draw1,(layer)=>layer.list[3]],
		]);
		return newObj;
	})();

	world.s=(()=>{
		let newObj={};
		return newObj;
	})();
	(()=>{
		ray=new Raymarcher.Ray();
		ray.coords=[0,0];
		ray.velocity=[1,0];
		ray.size=1000;
		ray.objs=world.chunk1.list;
	})();
})();
mainGame.start();