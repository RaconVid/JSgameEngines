(function(){//load main game
	{//set up maingame UpdateLayers
		mainGame=new MainGame()
		mainGame.layers={
			update:new mainGame.UpdateLayer(),
			physics:new mainGame.UpdateLayer(),
			moveMent:new mainGame.UpdateLayer(),
			detectors:new mainGame.UpdateLayer(),
			draw:new mainGame.UpdateLayer(),
			mainDraw:mainGame.mainLayers.draw,
		};
		for (let i = 0; i < 20; i++) {
			for(let j in mainGame.layers){
				mainGame.layers[j].list[i]=new mainGame.UpdateLayer();
			}
		}
		mainGame.updateOrder=[
			mainGame.layers.update,
			mainGame.layers.physics,
			mainGame.layers.moveMent,
			mainGame.layers.detectors,
			mainGame.layers.mainDraw,
			mainGame.layers.draw,
		];
		//mainGame.layers.mainDraw.list[4]=mainGame.layers.draw;
	}

	/*TESTING*/{
		if(0){//frame by frame testing
			let main1=new mainGame.UpdateLayer(()=>main1.layerScript(),mainGame.updateOrder);
			mainGame.updateOrder=[
				new mainGame.UpdateScript(({}).a,()=>{
					let t=mainGame.time.real;
					if(Inputs.mouse.onDown){
						main1.onUpdate();
					}
					Inputs.mouse.onDown=false;
				})
			]
		}
		let a=1/60;//debug UI
		if(1)new mainGame.UpdateScript(a=>mainGame.layers.draw,()=>{
			Draw.square(100,100,10,"#AA884040");
			ctx.font="30px Arial";
			ctx.fillStyle="white";
			let b=mainGame.time.delta;
			a=Math.lerp(a,b,0.5);
			//seconds per frame
			ctx.fillText("spf:"+Math.floor(a*10000)/10000,100,100)
			ctx.fillText(world.player2.camera.cameraObj.viewList.length,100,140)
		})
	}
	let L=mainGame.layers;
	world={};
	world.chunk1=new Space.Chunk();
	world.worldChunks1=(()=>{
		let mapScale=20;
		let mapSize=[mapScale,mapScale];
		let chunkSize=400;//diamiter
		let makeChunk=function(newChunk=new Space.Chunk()){//adjacentLayers
			newChunk.size=chunkSize;
			let makeSide=function(){
				this.portal;
				this.chunk;
				this.isActive=false;
			}
			newChunk.sides={
				"00":new makeSide(),//(-x)left
				"01":new makeSide(),//(+x)right
				"10":new makeSide(),//(-y)up
				"11":new makeSide(),//(+y)down (+z)="21" (-z)="20"
			}
			newChunk.setSide=function(side,chunk=makeChunk()){
				const size=this.size;
				const size1=this.size*1.2;
				let newPortal=null;
				let opposite="";//opposite side
				switch(side){
					case"00":opposite="01";
					newPortal=makePortal(
						[-size/2,-size1/2],[0, size1],this,
						[ size/2,-size1/2],[0, size1],chunk,
					);
					break;
					case"01":opposite="00";
					newPortal=makePortal(
						[ size/2, size1/2],[0,-size1],this,
						[-size/2, size1/2],[0,-size1],chunk,
					);
					break;
					case"10":opposite="11";
					newPortal=makePortal(
						[ size1/2,-size/2],[-size1,0],this,
						[ size1/2, size/2],[-size1,0],chunk,
					);
					break;
					case"11":opposite="10";
					newPortal=makePortal(
						[-size1/2, size/2],[ size1,0],this,
						[-size1/2,-size/2],[ size1,0],chunk,
					);
					break;
				}
				let isOldPortalGone=false;
				let setter1=function(side,chunk){
					if(side.isActive&&(!isOldPortalGone)){
						side.portal.destructor();
						isOldPortalGone=true;
						side.isActive=false;
					}
					side.portal=newPortal;
					side.isActive=true;
					side.chunk=chunk;
				}
				setter1(this.sides[side],chunk);
				setter1(chunk.sides[opposite],this);
			}
			return newChunk;
		}
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
		let makePortal=function(c1,v1,l1,c2,v2,l2){
			let newObj={
				entityRefs:[],
				portalA:null,
				portalB:null,
				type:{
					shape:"wall",
					portal:{
						basic_v1:true,
						oneFace:true,
					},
					wall:{
						basic_v1:true,
						vector:true,
					},
				},
				destructor:function(){
					this.entityRefs[0].detach();
					this.entityRefs[1].detach();
					this.entityRefs[2].detach();
					this.entityRefs[3].detach();
				},
			};
			let portalFilter=new Space.Camera().portalFilter;
			//----
				let cameraA=new Space.Camera().addDraw();
				cameraA.portalFilter=function(relPos){
					return portalFilter(relPos)&&relPos.obj!=cameraB;
				}
				cameraA.type.portal={camera_v1:true,};
				cameraA.layerRef=l2;
				cameraA.pos.vec=Math.minusVec2(c1,c2);
				let portalA={
					type:newObj.type,
					side:0,
					vec1:c1,
					vec2:v1,
					layer:l1,
					coords:c1,
					camera:cameraA,
					velocity:v1,//[0,0],
				};
			//----
				let cameraB=new Space.Camera().addDraw();
				cameraB.portalFilter=function(relPos){
					return portalFilter(relPos)&&relPos.obj!=cameraA;
				}
				cameraB.type.portal={camera_v1:true,};
				cameraB.layerRef=l1;
				cameraB.pos.vec=Math.minusVec2(c2,c1);
				let portalB={
					type:newObj.type,
					side:1,
					vec1:c2,
					vec2:v2,
					layer:l2,
					coords:c2,
					camera:cameraB,
					velocity:v2,//[0,0],
				};
			//----
			portalA.portalB=function(){return portalB;};
			portalB.portalB=function(){return portalA;};
			portalA.parent=function(){return newObj;};
			portalB.parent=function(){return newObj;};
			cameraA.parent=function(){return portalA;};
			cameraB.parent=function(){return portalB;};
			if(false){//add drawScripts TESTING
				Space.addDrawUpdates.call(cameraA,[
				[new mainGame.UpdateScriptV1_0(undefined,undefined,undefined,function(layer,id){
					Draw.line(
						portalA.vec1[0],
						portalA.vec1[1],
						portalA.vec1[0]+portalA.vec2[0],
						portalA.vec1[1]+portalA.vec2[1],
					4,"#FF8800");
				}),(draw)=>draw.list[2]],
				]);
				Space.addDrawUpdates.call(cameraB,[
					[new mainGame.UpdateScriptV1_0(undefined,undefined,undefined,function(layer,id){
						Draw.line(
							portalB.vec1[0],
							portalB.vec1[1],
							portalB.vec1[0]+portalB.vec2[0],
							portalB.vec1[1]+portalB.vec2[1],
						6,"#0088FF88");
					}),(draw)=>draw.list[2]],
				])
			}
			newObj.portalA=portalA;
			newObj.portalB=portalB;
			newObj.entityRefs=[
				new Space.RefEntity(portalA,portalA.layer.portals),
				new Space.RefEntity(portalB,portalB.layer.portals),
				//new Space.RefEntity(cameraA,l1.portals),
				//new Space.RefEntity(cameraB,l2.portals),
				new Space.RefEntity(cameraA,l1),
				new Space.RefEntity(cameraB,l2),
			];
			return newObj;
		};
		let mapChunks=[];
		for(let y=0;y<mapSize[1];y++){
			mapChunks[y]=[];
			for(let x=0;x<mapSize[0];x++){
				mapChunks[y][x]=makeChunk();
			}
		}
		mapChunks[0][0]=makeChunk(world.chunk1);
		let neighbours=[[0,0],[0,1],[1,0],[1,1]]
		for(let y=0;y<mapSize[1];y++){
			for(let x=0;x<mapSize[0];x++){
				mapChunks[y][x].coords=[x,y];
				for(let i=0;i<neighbours.length;i++){
					let joinCoords=[
						(x+(neighbours[i][0]==0)*(neighbours[i][1]*2-1)+mapSize[0])%mapSize[0],
						(y+(neighbours[i][0]==1)*(neighbours[i][1]*2-1)+mapSize[1])%mapSize[1],
					];
					mapChunks[y][x].setSide(neighbours[i].join(""),mapChunks[joinCoords[1]][joinCoords[0]]);
				}
			}
		}
		let newObj={
			gridChunks:mapChunks,

		};
		return newObj;
	})();
	world.player1=(()=>{
		let entity={//~= sprite level
			//vars:{
				move:[0,0],
				goTo:[0,0],//coords
				keys:{w:0,a:0,s:0,d:0,},
				objsInView:[],
			//},
			//globals:{
			//},
			//scripts
				onStart:function(layer,id){
					layer.list[id].isDeleting=true;
				},
				onUpdate1:function(layer,id){
					//movement1
						this.move=[this.isKey("ArrowRight")-this.isKey("ArrowLeft"),this.isKey("ArrowDown")-this.isKey("ArrowUp")];
						this.move=Math.scaleVec2(this.move,200*mainGame.time.delta);
						CloneTo(Math.lerpT2(this.velocity,this.move,0.9,mainGame.time.delta),this.velocity);
						this.goTo=Math.addVec2(this.coords,this.velocity);
					//get Objs
						this.objsInView=CloneTo(camera.viewList,this.objsInView);
					//rock/paper/scissors
				},
				onMove1:function(layer,id){//movement2
					this.movement_goto(this.goTo);
				},
				movement_goto:Sprite.add.movement.GoTo(),
				isKey:function(k){
					if(k.length==1)return Inputs.getKey(k.toLowerCase()).down||Inputs.getKey(k.toUpperCase()).down;
					return Inputs.getKey(k).down;
				},
			//}
			entRef:{
				main:null,
				portaled:[],
			},
			coords:[40,100],
			velocity:[0,0],
			layer:world.chunk1,
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
			d1:[new mainGame.UpdateScriptV1_0(undefined,undefined,undefined,function(layer,id){
				Draw.square(entity.coords[0],entity.coords[1],10+5*(entity.layer!=world.chunk1),"green");
				ctx.fillStyle="#B0F0F0B0";
				ctx.textAlign = "center"; 
				ctx.font="10px Arial";
				ctx.fillText([Math.round(entity.coords[0]),Math.round(entity.coords[1])],entity.coords[0],entity.coords[1]);
			}),(draw)=>draw.list[4]],
		};
		entity.drawing=drawing;
		Space.addDrawUpdates.call(entity,[drawing.d1]);
		entity.entRef.main=new Space.RefEntity(entity,entity.layer);
		entity.entityRefs=[
			entity.main,
		];
		entity.onEventsList=[
			new mainGame.UpdateScriptV1_0(null,mainGame.layers.physics.list[1],undefined,(l,i)=>entity.onStart(l,i)),
			new mainGame.UpdateScriptV1_0(null,mainGame.layers.physics.list[4],undefined,(l,i)=>entity.onUpdate1(l,i)),
			new mainGame.UpdateScriptV1_0(null,mainGame.layers.physics.list[7],undefined,(l,i)=>entity.onMove1(l,i)),
		];
		let camera=Collider.call({},world.chunk1).addCamera(true);
		camera.size=100;
		camera.view_rect=[Draw.width/2,0,Draw.width/2,Draw.height];
		camera.draw_view.onUpdate=function(layer,i){
			ctx.save();
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
		//entity.chunk=entity.layer;
		//entity.camera=camera;
		return newObj;
	})();
	world.player2=(()=>{
		let entity;{
			entity={
				//vars:{
					move:[0,0],
				//},
				//scripts{
					onStart:function(layer,id){
						layer.list[id].isDeleting=true;
					},
					onUpdate1:function(layer,i){
						this.move=[this.isKey("d")-this.isKey("a"),this.isKey("s")-this.isKey("w")];
						this.move=Math.scaleVec2(this.move,200*mainGame.time.delta);
						CloneTo(Math.lerpT2(this.velocity,this.move,0.9,mainGame.time.delta),this.velocity);
					},
					onMovement1:function(layer,i){
						let gotoPos=Math.addVec2(this.coords,this.velocity);
						this.goto(gotoPos);
					},
					onDraw1:[function(layer,i){
						ctx.save();
						ctx.translate(entity.coords[0],entity.coords[1]);
						Draw.circle(0,0,10,"#00ABAB")
						ctx.restore();
					},(layer)=>layer.list[4]],
				//},
				//procedures:{
					isKey:function(k){
						if(k.length==1)return Inputs.getKey(k.toLowerCase()).down||Inputs.getKey(k.toUpperCase()).down;
						return Inputs.getKey(k).down;
					},
					goto:Sprite.add.movement.GoTo(function(layerOld,layerNew){
						entity.layer=layerNew;
					}),
				//}
				get layer(){return this.mainEntRef.layer},
				set layer(layerNew){
					entity.mainEntRef.detach();
					entity.mainEntRef.attach(layerNew);
				},
				type:{shape:"circle"},
				keywords:{rock:true,player:true},size:10,
				mainEntRef:null,
				coords:[0,0],
				velocity:[0,0],
			};
			Space.addDrawUpdates.call(entity,[entity.onDraw1]);
			let bindScript=function(func_getLayer){
				let self=entity;
				let func=func_getLayer[0];
				let getLayer=func_getLayer[1];
				let uS={//UpdateScript Object
					isDeleting:false,
					func:func,
					onUpdate:(l,i,p)=>func.call(self,l,i,p),
					get layer(){return getLayer(mainGame);}
				};
				let layer=getLayer(mainGame);
				if(layer instanceof Array)layer.push(uS);
				else layer.list.push(uS);
				return uS;
			};
			entity.scripts=[
				bindScript([entity.onStart,(m)=>m.layers.update.list[1]]),
				bindScript([entity.onUpdate1,(m)=>m.layers.update.list[4]]),
				bindScript([entity.onMovement1,(m)=>m.layers.physics.list[7]]),
			];
			entity.mainEntRef=new Space.RefEntity(entity);
			entity.layer=world.chunk1;
		}
		let camera;{
			camera=Collider.call({},world.chunk1).addCamera(true);
			camera.view_rect=[0,0,Draw.width/2,Draw.height];
			camera.size=Math.max(80,10+Math.len2([camera.view_rect[2],camera.view_rect[3]])/2);
			/*TESTING*/if(0)new mainGame.UpdateScript(()=>mainGame.layers.update.list[4],()=>{
				//scaleable camera
				camera.matrixPos.mat=[[2*Inputs.mouse.x/Draw.width,0],[0,2*Inputs.mouse.x/Draw.width]];
			});
			Object.defineProperties(camera,{
				coords:{get(){return entity.coords;}},
				velocity:{get(){return entity.velocity;}},
				layer:{get(){return entity.layer;}},
			});
		}
		let newObj={
			updateEventsList:[

			],
			drawObjs:[
				entity.Draw,
				
			],
			entity:entity,
			camera:camera,
		};
		return newObj;
	})();
	world.creature1=(()=>{//rock?
		let makeRock=function(coords=[0,0].map(v=>Math.random()*100)){
			let newObj={};
			let startT=0;
			let makeBaceEntity=function(layer,size){
				let baceEntity={
					//bace_entity:{
						coords:[0,0],
						velocity:[0,0],
						type:{chunk:true,shape:"circle"},
						list:[],
						keywords:{},
						entRefs:{
							main:null,
							list:[],
						},
						toJSON:function(){

						},
						destructor:function(){

						},
					//}
					scripts:{
						redoRefferenceEntities:new mainGame.UpdateScript(()=>L.update.list[7],function(){
							let self=baceEntity;
							self.setUpRefEnts();
						}),
					},
					//basicfunctions:{
						setUpRefEnts(){
							return;
							let self=baceEntity;
							for(let i=0;i<self.entRefs.list.length;i++){
								let entRef=self.entRefs.list[i];
								entRef.detach();
							}
							CloneTo([],self.entRefs.list);
							let refEnts=[self.entRefs.main];
							let checkedLists=[];

							const bail=10;
							let size=self.size;
							let i;
							for(i=0;i<bail&&refEnts.length>0;i++){//while 
								let len=refEnts.length;
								for(let i=0;i<len;i++){
									let refEnt=refEnts.shift();
									let list=refEnt.layer.portals.list;
									if(checkedLists.indexOf(refEnt.layer)!=-1){
										refEnt.detach();
										continue;
									}
									checkedLists.push(refEnt.layer);
									let objsInView=[];
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
												//({})();//cause Error
											}
										}catch(e){}
									}
									for(let i=0;i<objsInView.length;i++){
										let relpos=objsInView[i];
										let portalType=relpos.obj.type.portal;
										dist=Infinity;
										if(portalType.basic_v1){
											//note: c = a.pos->{-b.pos}->{rotate(-b.vec.angle)}
											//let c=Math.rotate(Math.dif2(refEnt.coords,relpos.obj.vec1),-Math.getAngle(relpos.vec(relpos.obj.vec2,refEnt.pos),0,1),0,1);
											//c[0]=c[0]>0?Math.max(0,c[0]-Math.len2(relpos.obj.vec2)):c[0];
											let c=Math.addVec2(refEnt.pos.vec,Math.minusVec2(relpos.obj.portalB().vec1,relpos.obj.vec1))
											dist=Math.len2(c);
										}
										if(dist<=size&&dist>Math.len2(refEnt.pos.vec)){//create new refEnt
											let newRef=new Space.RefEntity(self,relpos.obj.portalB().layer);
											self.entRefs.list.push(newRef);
											newRef.pos.vec=Math.addVec2(refEnt.pos.vec,Math.minusVec2(relpos.obj.portalB().vec1,relpos.obj.vec1))
											refEnts.push(newRef);
										}
										else{

										}
									}
								}
							}
							if(i>=bail){
								if(true){
									console.error("::entity existing through too many portals::");
									alert("entity portal error");
								}
							}
						},
						goto:Sprite.add.movement.GoTo(function(layerOld,layerNew){
							baceEntity.layer=layerNew;
						}),
						get layer(){return this.entRefs.main.layer},
						set layer(layerNew){
							baceEntity.entRefs.main.detach();
							baceEntity.entRefs.main.attach(layerNew);
							baceEntity.setUpRefEnts();
						},
					//},
				};
				let baceEntRef=new Space.RefEntity(baceEntity,world.chunk1);
				baceEntity.entRefs.main=baceEntRef;
				baceEntity.size=size;
				baceEntity.setUpRefEnts();
				return baceEntity;
			};
			let baceEntity=makeBaceEntity(world.chunk1,20);
			let camera=Collider.call({}).addCamera(0,0);
			Object.defineProperties(camera,{
				coords:{get:function(){return baceEntity.coords;}},
				velocity:{get:function(){return baceEntity.velocity;}},
				layer:{get:function(){return baceEntity.layer;}},
			});
			camera.size=100;
			newObj.baceEntity=baceEntity;
			let power=0;
			let rock1={
				//vars:{
					view:[],
					momentum:[0,0],
					maxPower:0.9999,
					timers:[0,0,0,0,0],
					modes:[0,0,0,0,0,],
					powerAngle:0,
				//},
				scripts:{
					onStart:new mainGame.UpdateScript(()=>L.update.list[4],function(layer,i){
						const self=rock1;
						return false;
					}),
					update1:new mainGame.UpdateScript(()=>L.update.list[3],(layer,i)=>{
						const self=rock1;
						let list=camera.cameraObj.viewList;
						self.view=[];
						for(let i=0;i<list.length;i++){
							let canSee=false;
							let obj=list[i].obj;
							if(obj==baceEntity)continue;
							if(obj==rock1)continue;
							if(!obj.keywords)continue;
							if(obj.type.portal)continue;
							if("rock" in obj.keywords)canSee=true;
							if("metalic" in obj.keywords)canSee=true;
							if("scissors" in obj.keywords)canSee=true;
							if("paper" in obj.keywords)canSee=true;
							if(!canSee)continue;
							self.view.push(list[i]);
						}
						let view=[];
						let minObj=null;
						let minDist=Infinity;
						let objs=[];
						let dists=[];
						const dt=mainGame.time.delta;
						list=self.view;
						for(let i=0;i<list.length;i++){
							if(list[i].obj.keywords.rock){
								let dist=Math.len2(list[i].coords,baceEntity.coords);
								let sides=4;
								let angle=Math.PI*2*(1.125)+Math.getAngle(Math.dif2(list[i].coords,baceEntity.coords),0,1);
								let shapeSize=1/Math.cos(Math.abs((angle%(Math.PI*2/sides))-Math.PI/sides));
								let size=(list[i].obj.size+rock1.size)*shapeSize;
								if(dist>0&&dist<size*4){
									let force=
										dist<=size+2?Math.clamp(0,1,dt*20)*(dist-size)/Math.max(1,dist/(0.5*size))/dist
									:0;
									let fvec=Math.dif2(list[i].coords,baceEntity.coords);

									baceEntity.goto(Math.addVec2(baceEntity.coords,Math.scaleVec2(fvec,force/2)));
									list[i].obj.goto(list[i].vec_set(Math.addVec2(list[i].coords,Math.scaleVec2(fvec,-force/2))));
								}
								dist=Math.len2(list[i].coords,baceEntity.coords);
								if(dist<200){
									if(minDist>dist&&dist>0){
										minDist=dist;
										minObj=list[i];
									}
								}
							}
						}
						const mp=0.01;//minPower
						if(minObj!=null){
							let len=minDist;
							self.powerAngle+=dt*0.4;
							self.powerAngle%=1;
							power=Math.lerpT(power,Math.pow(Math.sin(self.powerAngle*Math.PI*2),2),0.9,dt);
							if(typeof minObj.obj.keywords!="object")console.error(minObj.obj.keywords)
							if("rock" in minObj.obj.keywords){
								if(len>0){
									let size=rock1.size+minObj.obj.size;
									if(1)baceEntity.goto(Math.lerpT2(baceEntity.coords,minObj.coords,-1,dt*power));
								}
							}
						}
						else{
							const dt=mainGame.time.delta;
							self.powerAngle=Math.lerp(self.powerAngle,0.5,0.5*dt);
						}
					}),
				},
				costumes:{
					main:[(layer,i,pos)=>{
						let a=0;
						let x=rock1.coords[0];
						let y=rock1.coords[1];
						let sz=rock1.size;
						//ctx.drawImage(Images.rock,x-sz,y-sz,sz/2,sz/2);
						{
							ctx.save();
							ctx.translate(x,y);
							ctx.scale(sz,sz);
							ctx.beginPath();
							ctx.moveTo(1,0);
							ctx.quadraticCurveTo(1,1,0,1);
							ctx.quadraticCurveTo(-1,1,-1,0);
							ctx.quadraticCurveTo(-1,-1,0,-1);
							ctx.quadraticCurveTo(1,-1,1,0);
							ctx.lineWidth=0.3;
							ctx.strokeStyle="grey";
							ctx.fillStyle="darkGrey";
							ctx.closePath();
							ctx.fill();
							ctx.stroke();
							ctx.scale(1/sz,1/sz);
							ctx.translate(-x,-y);
							ctx.restore();
						}
						//let txt=baceEntity.layer.coords;//Math.round(power*100);
						//ctx.fillText(txt,x,y);
					},(draw)=>draw.list[3]],
				},
				//basic{
					coords:[0,0],
					velocity:[0,0],
					size:15,
					entRef:null,
					goto:function(coords){
						return baceEntity.goto(Math.addVec2(coords,baceEntity.coords));
					},
					state:{},
					type:{state:true},
					keywords:{
						rock:{},
						metalic:false,
					},
				//},
			};
			newObj.rock1=rock1;
			rock1.entRef=new Space.RefEntity(rock1,baceEntity);
			Space.addDrawUpdates.call(rock1,[
				rock1.costumes.main,
			]);
			rock1.goto(coords);
			return newObj;
		}
		let rocks=[];
		for(let i=0;i<100;i++){
			rocks.push(makeRock());//[0,0]
		}
		return rocks;
	})();
	world.basicObj=(()=>{
		let refEnt=new Space.RefEntity({
			type:{},
			coords:[0,0],
			velocity:[0,0],
		},world.chunk1);
		refEnt.obj.Draw={
			attachDraw:function(relPos,layer){
				layer.list[4].list.push({onUpdate:function(){
					const self=refEnt.obj;
					ctx.save();
					Draw.transform(relPos.pos);
						ctx.translate(self.coords[0],self.coords[1]);
						ctx.beginPath();
						ctx.moveTo(-20,-20);
						ctx.lineTo(20,20);
						ctx.moveTo(-20,20);
						ctx.lineTo(20,-20);
						ctx.strokeStyle="#FFFFFF88";
						ctx.lineWidth=4;
						ctx.stroke();
					ctx.restore();
				}});
			}
		};
		return refEnt;
	})();
	world.s=(()=>{
		let newObj={};
		return newObj;
	})();
})();
mainGame.start();