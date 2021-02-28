(function(){//load main game
	{//set up maingame UpdateLayers
		window.mainGame=new MainGame();
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
	window. DEBUG_UI=true;
	window. TESTING=true;
	if(DEBUG_UI)if(1){
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
			ctx.fillStyle="#FFFFFFD0";
			let b=mainGame.time.realDelta;
			const m=0.001;
			a=Math.abs(b-a)<m?a=b:a>b?a-m:a+m;
			a=Math.lerp(a,b,0.3);
			//note: spf = seconds per frame
			let fps=1/a;
			//note: fps
			//note: view = amount of objects in player2's viewList
			if(1){//fps
				ctx.fillText("fps:"+Math.floor(fps*10000)/10000,100,100);
				ctx.fillStyle="#101010A0";
				ctx.fillRect(100-4,60-4,14*6+8,10+8);
				ctx.fillStyle="#A0CFA0A0";
				ctx.fillRect(100+14*5,60-4,10,10+8);//60fps marker
				ctx.fillStyle="#FFFFFFD0";
				let modulo=10;
				let fpsDIV=(fps-fps%modulo)/modulo;
				for(let i=0;i<fpsDIV;i++){
					let x=i;
					ctx.fillRect(100+14*x,60,10,10);
				}
				ctx.fillRect(100+14*fpsDIV,60,10*(fps%modulo)/modulo,10);
			}
			if(1)ctx.fillText("view:"+world.player2.camera.cameraObj.viewList.length,100,140);
			ctx.font="15px Arial";
			if(1){
				ctx.fillText("P1 chunk:"+world.player1.entity.layer.coords,100,240);
				ctx.fillText("P2 chunk:"+world.player2.entity.layer.coords,100,255);
			}
		})
	}
	let L=mainGame.layers;
	window. world=new World();
	function newPlayerCamera(entity,rect){
		let camera=Collider.call({},world.chunk1).addCamera(true);
		camera.view_rect=rect;
		camera.size=Math.max(0,10+Math.len2([camera.view_rect[2],camera.view_rect[3]])/2);
		Object.defineProperties(camera,{
			coords:{get(){return entity.coords;}},
			velocity:{get(){return entity.velocity;}},
			layer:{get(){return entity.layer;}},
		});
		return camera;
	}
	let playerConstructor;
	world.player1=(()=>{
		playerConstructor=class{
			//constructors/static fields
				static carryable= Symbol("carryable by player V1");
				static addCarryable(entity,isStrict=false){
					let errorMsg=function(msg1){return "ERROR::uncompatible entity: "+msg1;}//" entity.size undefined"}
					if(!("type" in entity))
						if(!isStrict){
							entity.type={};
						}
						else
							throw errorMsg("entity.size undefined");
					if(!("mass" in entity))
						if(!isStrict){
							entity.mass=10;
						}
						else
							throw errorMsg("entity.mass undefined");
					if(!("size" in entity))
						if(!isStrict){
							entity.size=10;
						}
						else
							throw errorMsg("entity.size undefined");
					if(!(this.carryable in entity.type))
						entity.type[this.carryable]=true;
					return entity;
				};
				constructor(){
					this.constructor.constructor_entity.call(this);
					this.armObj.carrySymbol=this.constructor.carryable;
					this.camera_canvasRect=[0,0,Draw.width,Draw.height];
					this.camera=newPlayerCamera(this.entity,this.camera_canvasRect);
					//note: the camera is to only be used for drawing, not for viewSearching, so I can replace it when needed.
					this.constructor.constructor_scripts.call(this);
					this.constructor.constructor_refferences.call(this);
				};
				static constructor_entity(){
					this.entity.layer=world.chunk1;
					this.entity.id=this.entity.layer.list.length;
					this.entity.layer.list.push(this.entity);
					this.entity.obj=this.entity;
					this.entity.proxy=this.entity;
					this.constructor.addCarryable(this.entity);
				}
				static constructor_scripts(){
					this.scriptList.push(new mainGame.UpdateScript(v=>mainGame.layers.update.list[3],this.script_update1()));
					this.scriptList.push(new mainGame.UpdateScript(v=>mainGame.layers.update.list[1],this.script_getInput.bind(this)));
				}
				static constructor_refferences(){
					this.armObj.parent=this;
				}
				deRefference(){
					for(let i=0;i<this.scriptList.length;i++){
						this.scriptList[i].detach();
						delete this.scriptList[i];
					}
					this.scriptList=[];
				}
			//--
			//camera={
				camera_canvasRect=[Draw.width/2,0,Draw.width/2,Draw.height];
				get camera_canvasCoords(){return[this.camera_canvasRect[0]+this.camera_canvasRect[2]/2,this.camera_canvasRect[1]+this.camera_canvasRect[3]/2];}
			//}
			//scripts={
				//updateScripts
					scriptList=[];
					*script_onStart(){
						this.getInputs();
						this.actions.mouseDT=[0,0];
					}
					script_getInput(){
						this.getInputs();
					}
					*script_update1(){
						const lastLayer=Symbol("lastLayer");
						this.entity[lastLayer]=NaN;
						while(true){
							if(this.entity[lastLayer]!=this.entity.layer){
								this.getView();
							}
							this.entity[lastLayer]=this.entity.layer;
							this.subScript_movement1();
							this.subScript_arm();
							yield;
						}
					};
				//subscripts:{
					subScript_movement1(){
						let moveVec=[0,0];
						if(this.actions.down-this.actions.up!=0)
							moveVec[1]+=this.actions.down-this.actions.up;
						if(this.actions.right-this.actions.left!=0)
							moveVec[0]+=this.actions.right-this.actions.left;
						this.movementVec1=Math.lerpT2(this.movementVec1,moveVec,0.999,mainGame.time.delta);
						moveVec=Math.scaleVec2(this.movementVec1,this.movement_speed);
						this.entity.velocity=Math.lerpT2(this.entity.velocity,moveVec,0.999,mainGame.time.delta);
						moveVec=Math.scaleVec2(this.entity.velocity,mainGame.time.delta);//Math.addVec2(moveVec,this.entity.velocity);
						if(Math.hypot(...this.entity.velocity)<0.01){
							this.entity.velocity=[0,0];
						}
						this.moveBy(moveVec);
						this.entity.velocity=Math.scaleVec2(this.entity.velocity,0.7**mainGame.time.delta)
					}
					moveVelocity(){

					}
					subScript_arm_holdingScript=this.Script_subScript_arm_holding();
					*Script_subScript_arm_holding(){
						const thisEntity=this.armObj;//arm Object
						let mouseEntity=new Space.RefEntity({coords:[0,0]},this.entity.layer);
						mouseEntity.detach();
						mouseEntity.attach=()=>{};
						let mouse;
						const updateMouse=()=>{
							mouse=Math.addVec2(this.entity.coords,this.actions.mousePos);
							mouseEntity.pos=new Space.Pos(this.entity.pos);
							mouseEntity.obj.coords=Math.vec2(Clone(this.entity.coords));

							mouseEntity.coords=mouse;
						};
						updateMouse();
						while(true){
							updateMouse();
							if(Inputs.mouse.down){
								thisEntity.isGrabbing=true;
								let minObj=null;let minDist=Infinity;
								for(let i=0;i<10 +60*10;i++){
									for(let relPos of mouseEntity.pos.layer.viewSearch(thisEntity.maxDist*4)){
										let obj=relPos.obj;
										if(obj==this.entity)continue;
										if(!this.armObj.detectCarryable(obj))continue;
										let dist=Math.len2(thisEntity.coords,relPos.coords);
										if(dist<thisEntity.maxDist+(obj.size+thisEntity.size)&&dist>0&&dist<minDist){
											minObj=relPos;
											minDist=dist;
										}
									}
									if(minObj!=null)break;
									if(!Inputs.mouse.down)break;
									else yield;
									updateMouse();
								}
								if(minObj!=null){//hold physics
									thisEntity.holding=minObj;
									let relPos=minObj;
									let obj=relPos.obj;
									while(thisEntity.isGrabbing){
										updateMouse();
										let found=false;
										for(let relPos1 of mouseEntity.pos.layer.viewSearch(100)){
											if(relPos1.obj==relPos.obj){
												found=true;
												relPos=relPos1;
												break;
											}
										}
										if(!found)break;
										const cooling=0.9;
										//Math.hypot(Math.addVec2(Math.dif2(this.armObj.coords,relPos.coords),Math.scaleVec2(Math.dif2(this.armObj.coords,relPos.coords),cooling)));
										let part=thisEntity;
										let body=this.entity;
										let dif=Math.vec2(Math.dif2(part.coords,relPos.coords))
										dif=dif.add(Math.scaleVec2(Math.dif2(body.velocity,relPos.velocity),mainGame.time.delta));
										const force=1/(obj.mass+body.mass);//);//0.3
										let difA=Math.scaleVec2(dif,+(force*body.mass));
										let difB=Math.scaleVec2(dif,-(force*obj.mass));
										let forceScale=20*Math.min(1,mainGame.time.delta*10)**2;
										relPos.velocity=Math.addVec2(relPos.velocity,Math.scaleVec2(difA,forceScale));
										body.velocity=Math.addVec2(body.velocity,Math.scaleVec2(difB,forceScale));
										forceScale=0.9*Math.min(1,mainGame.time.delta*10);
										relPos.coords=Math.addVec2(relPos.coords,Math.scaleVec2(difA,forceScale));
										this.moveBy(Math.scaleVec2(difB,forceScale));
										thisEntity.isGrabbing=Inputs.mouse.down;
										yield;
									}
									thisEntity.holding=null;
								}
								else{ do{thisEntity.isGrabbing=Inputs.mouse.down;yield;}while(thisEntity.isGrabbing)
								}
								thisEntity.isGrabbing=false;
							}
							yield;
						}
					}
					subScript_arm(){
						const thisEntity=this.armObj;//arm Object
						let mouse=Math.addVec2(this.entity.coords,this.actions.mousePos);
						thisEntity.coords=mouse;
						this.subScript_arm_holdingScript.next();
						/*if(thisEntity.isGrabbing&&!thisEntity.holding){
							let viewer=this.viewSearch(300);
							for(let relPos of viewer){
								let obj=relPos.obj;
								if(obj==this.entity)continue;
								let dist=Math.len2(thisEntity.coords,relPos.coords);
								if(dist<40&&dist>0){
									const cooling=0.9;
									//Math.hypot(Math.addVec2(Math.dif2(this.armObj.coords,relPos.coords),Math.scaleVec2(Math.dif2(this.armObj.coords,relPos.coords),cooling)));
									if(this.armObj.detectCarryable(obj)){
										let part=thisEntity;
										let body=this.entity;
										let dif=Math.vec2(Math.dif2(part.coords,relPos.coords))
										dif=dif.add(Math.scaleVec2(Math.dif2(body.velocity,relPos.velocity),mainGame.time.delta));
										const force=1/(obj.mass+body.mass);//);//0.3
										let difA=Math.scaleVec2(dif,+(force*body.mass));
										let difB=Math.scaleVec2(dif,-(force*obj.mass));
										let forceScale=2*Math.min(1,mainGame.time.delta*20)**2;
										relPos.velocity=Math.addVec2(relPos.velocity,Math.scaleVec2(difA,forceScale));
										body.velocity=Math.addVec2(body.velocity,Math.scaleVec2(difB,forceScale));
										forceScale=0.9*Math.min(1,mainGame.time.delta*10);
										relPos.coords=Math.addVec2(relPos.coords,Math.scaleVec2(difA,forceScale));
										this.moveBy(Math.scaleVec2(difB,forceScale));
									}
								}
							}
							if(!Inputs.mouse.down){
								thisEntity.isGrabbing=false;
							}
						}
						if(Inputs.mouse.down){
							thisEntity.isGrabbing=true;
						}*/
					}
				//},
			//};
			//vars={
				movementVec1=[0,0];
			//}
			//consts={ //properties
				movement_acceleration=1/0.5;
				movement_speed=200;
			//}
			moveBy=(()=>{
				let goto=Sprite.add.movement.GoTo((oldLayer,layer)=>{
					let last=oldLayer.list.pop();
					if(last!=this.entity){
						oldLayer.list[this.entity.id]=last;
						oldLayer.list[this.entity.id].id=this.entity.id;
					}
					this.entity.id=layer.list.length;
					layer.list.push(this.entity);
					this.entity.layer=layer;
				});
				return (moveVec)=>{
					goto=goto.bind(this.entity);
					this.moveBy=function(moveVec){
						return this.entity.goto(Math.addVec2(this.entity.coords,moveVec));
					}
					return this.moveBy(moveVec);
				}
			})();
			generalMoveTo=(()=>{
				let goto=Sprite.add.movement.GoTo();
				return function(coords){
					this.goto(coords);//goto.call(this,coords);
				}
			})();
			//inputHandleing={
				actions={
					left:0,right:0,down:0,up:0,
					joystick1:[0,0],joystick2:[0,0],
					mousePos:[0,0],mouseDT:[0,0],
				};
				input_oldMousePos=[0,0];
				controls={
					left:"ArrowLeft",
					right:"ArrowRight",
					down:"ArrowDown",
					up:"ArrowUp",
					//left2:"KeyW",
					//right2:"Keyw",
					//down2:"Keyw",
					//up2:"Keyw",
				};
				getInputs(){
					for(let i in this.controls){
						this.actions[i]=Inputs.getKey(this.controls[i]).down;
					}
					this.actions.joystick1=[this.actions.right-this.actions.left,this.actions.down-this.actions.up];
					this.actions.joystick2=[0,0];
					let mouse=Math.minusVec2(Inputs.mouse.vec2,this.camera_canvasCoords);
					this.actions.mouseDT=Math.scaleVec2(Math.dif2(mouse,this.actions.mousePos),1/mainGame.time.delta);
					this.actions.mousePos=mouse;
				};
			//};
			//view={
				*viewSearch(r){
					yield* this.entity.layer.viewSearch(r);
				}
				getView(){};
			//};
			entity=Object.create(Space.RefEntity.prototype,Object.getOwnPropertyDescriptors({
				mass:30,size:10,
				keywords:{player:true,},
				type:{player:true,shape:"circle"},
				coords:[10,10],
				velocity:[0,0],
				Draw:{
					costume:(relPos,drawLayer,script,layerNumber=4)=>{
						return new mainGame.UpdateScript(v=>drawLayer.list[layerNumber],()=>{
							ctx.save();
							Draw.transform(relPos.pos);
							ctx.translate(...this.entity.coords);
							script();
							ctx.restore();
						});
					},
					attachDraw:(relPos,drawLayer)=>{
						let costume=this.entity.Draw.costume.bind(this,relPos,drawLayer);
						let costume1=this.entity.Draw.costume;
						costume(()=>{
							ctx.save();
							ctx.translate(...this.armObj.vec);
							if(this.armObj.isGrabbing){
								Draw.line(-10,0,10,0,3,Draw.hslColour(0.5,0.5,0.5+0.3*Math.sin(mainGame.time.start*3)));
								Draw.line(0,-10,0,10,3,Draw.hslColour(0.5,0.5,0.5+0.3*Math.sin(mainGame.time.start*3)));
							}else{Draw.circle(0,0,5,"#FF4040BB");}
							ctx.restore();
						},7);
						costume(()=>{
							ctx.beginPath();
							ctx.moveTo(...Math.lerp2([0,0],this.armObj.vec,10/(1+Math.len2(this.armObj.vec))));
							ctx.lineTo(...this.armObj.vec);
							if(this.armObj.isGrabbing){
								ctx.strokeStyle="#50448C";
								ctx.lineWidth=7;
							}
							else{
								ctx.strokeStyle="#50448C";
								ctx.lineWidth=4;
							}
							ctx.stroke();
						},5);
						costume(()=>{
							ctx.save();
							ctx.globalAlpha=0.1;
							//insert image here
							ctx.drawImage(Images.icon,-25,-32);
							ctx.restore();
						},6);
						costume(()=>{
							let sz=this.entity.size*1;
							let sz2=0.2;
							let x=0,y=0;
							ctx.lineWidth=3;
							ctx.strokeStyle="purple";
							
							ctx.beginPath();
							ctx.moveTo(x-sz*sz2,y-sz);
							ctx.lineTo(x+sz,y-sz);
							ctx.lineTo(x+sz,y+sz*sz2);
							ctx.quadraticCurveTo(x+sz,y+sz,x+sz*sz2,y+sz);
							ctx.lineTo(x-sz,y+sz);
							ctx.lineTo(x-sz,y-sz*sz2);
							ctx.quadraticCurveTo(x-sz,y-sz,x-sz*sz2,y-sz);
							ctx.stroke();
							ctx.closePath();
							ctx.beginPath();
							ctx.lineWidth=3;
							let col="#CC0000";
							ctx.strokeStyle=col;
							ctx.lineWidth=3;
							ctx.arc(x,y,sz*0.7,Math.PI/2-Math.PI/4,Math.PI/2+Math.PI/4);
							ctx.stroke();
							Draw.circle(x-sz/2,y-sz*0.35,sz*0.2,col);
							Draw.circle(x+sz/2,y-sz*0.35,sz*0.2,col);
						},7);
						//draw Arm
					},
				},
				pos:{vec:[0,0],mat:[[1,0],[0,1]],layer:null},//chunk}
				id:NaN,
				obj:null,//obj=entity i.e this.obj=this;
				proxy:null,
			}));
			armObj={
				parent:null,
				holding:null,
				isGrabbing:false,
				get coords(){return Math.addVec2(this.vec,this.parent.entity.coords);},
				set coords(newCoords){this.vec=Math.minusVec2(newCoords,this.parent.entity.coords);},
				get velocity(){return this.parent.entity.velocity;},
				set velocity(val){this.parent.entity.velocity=val},
				vec:[0,0],
				mat:[[1,0],[0,1]],
				//consts
					mass:5,
					size:10,
					forceTransfer:0.5,
					maxDist:20,
				//--
				carrySymbol:undefined,
				detectCarryable(entity){return entity.type[this.carrySymbol]}
			};
		};
		window.player=playerConstructor;
		let newObj=new playerConstructor();
		//CloneTo([Draw.width/2*0,0,Draw.width/2,Draw.height],newObj.camera_canvasRect);
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
						this.move=Math.scaleVec2(this.move,200);
						CloneTo(Math.lerpT2(this.velocity,this.move,0.99,mainGame.time.delta),this.velocity);
					},
					onMovement1:function(layer,i){
						let gotoPos=Math.addVec2(this.coords,Math.scaleVec2(this.velocity,mainGame.time.delta));
						this.goto(gotoPos);
					},
					onDraw1:[function(layer,i){
						ctx.save();
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
				mainEntRef:{},//not set to null so entity.get layer can be called
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
			{const l=mainGame.layers;
				entity.scripts=[
					bindScript([entity.onStart,(m)=>m.layers.update.list[1]]),
					new mainGame.UpdateScript(()=>l.update.list[4],entity.onUpdate1.bind(entity)),
					bindScript([entity.onMovement1,(m)=>m.layers.physics.list[7]]),
				];
			}
			entity.mainEntRef=new Space.RefEntity(entity);
			entity.layer=world.chunk1;

			playerConstructor.addCarryable(entity);
		}
		let camera;{
			camera=Collider.call({},world.chunk1).addCamera(false);//false == TESTING
			camera.view_rect=[0,0,Draw.width/2,Draw.height];
			camera.size=Math.max(80,10+Math.len2([camera.view_rect[2],camera.view_rect[3]])/2);
			if(DEBUG_UI)if(0){
				new mainGame.UpdateScript(()=>mainGame.layers.update.list[4],()=>{
					//scaleable camera
					camera.matrixPos.mat=[[2*Inputs.mouse.x/Draw.width,0],[0,2*Inputs.mouse.x/Draw.width]];
				});
			}
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
	{
		let makeBaceEntity=function(layer,size){//for creature bigger than ~1 chunk
			let baceEntity={
				//bace_entity:{
					coords:[0,0],
					mass:400,
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
						const self=baceEntity;
						self.setUpRefEnts();
					}),
					moveVelocity:new mainGame.UpdateScript(()=>L.update.list[15],function(){
						const self=baceEntity;
						const friction=2;
						self.goto(Math.addVec2(self.coords,Math.scaleVec2(self.velocity,mainGame.time.delta)));
						self.velocity=Math.scaleVec2(self.velocity,1/friction**mainGame.time.delta);
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
			playerConstructor.addCarryable(baceEntity);
			return baceEntity;
		};
		let makeRock=function(coords=[0,0].map(v=>Math.random()*100)){
			let newObj={};
			let startT=0;
			let baceEntity=makeBaceEntity(world.chunk1,20);
			let camera=Collider.call({}).addCamera(0,0);
			Object.defineProperties(camera,{
				coords:{get:function(){return baceEntity.coords;}},
				velocity:{get:function(){return baceEntity.velocity;}},
				layer:{get:function(){return baceEntity.layer;}},
			});
			camera.size=40;
			newObj.baceEntity=baceEntity;
			let power=0;let a=0;
			let rock1={
				//vars:{
					view:[],
					momentum:[0,0],
					maxPower:0.9999,
					timers:[0,0,0,0,0],
					modes:[0,0,0,0,0,],
					powerAngle:0+Math.random()/2,
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
										dist<=size+2*0?Math.clamp(0,1,dt*20)*(dist-size)/Math.max(1,dist/(0.5*size))/dist
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
							let difTime=Math.random()*0.02;
							self.powerAngle+=dt*0.4+difTime*Math.pow(difTime+1,dt);
							self.powerAngle%=1;
							power=Math.lerp(power,self.powerAngle>0.5?Math.sin(self.powerAngle*Math.PI*2)**2:0,Math.clamp(0,1,4*dt));
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
							//ctx.translate(x,y);
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
							//ctx.translate(-x,-y);
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
		};
		let collisions=function*(){
			let n=0;
			let oldLayer=this.layer;
			for(let relPos of this.layer.viewSearch(100)){
				if(!relPos.obj.type)continue;
				if(relPos.obj.type.shape!="circle")continue;
				let dif=Math.dif2(relPos.coords,this.coords);
				let sizeSum=relPos.obj.size+this.size;
				let dist=Math.hypot(...dif);
				if(dist<sizeSum&&dist>0){
					this.goto(Math.addVec2(this.coords,Math.scaleVec2(dif,(relPos.obj.mass/(this.mass+relPos.obj.mass))*(dist-sizeSum)/dist)));
					relPos.coords=(Math.addVec2(relPos.coords,Math.scaleVec2(dif,-(this.mass/(this.mass+relPos.obj.mass))*(dist-sizeSum)/dist)));
					//yield;
				}
				n++;
				if(n==20){n=0;yield;}
				//if(this.layer!=oldLayer)return;
			}
		}
		let friction=1.5;
		let basicPhysicsScript=function(bindObj){
			return new mainGame.UpdateScript(l=>l.physics.list[6],function*(){
				let collisions1=collisions.bind(this);
				let collisions1Itter=collisions1();
				while(true){
					if(collisions1Itter.next().done){
						collisions1Itter=collisions1();
					}
					this.goto(Math.addVec2(this.coords,Math.scaleVec2(this.velocity,mainGame.time.delta)));
					//this.velocity=Math.scaleVec2(this.velocity,1/friction**mainGame.time.delta);
					yield;
				}
			}.bind(bindObj)());
		};
		let makeRock1=function(coords=[0,0].map(v=>Math.random()*100)){
			let sprite={
				mass:20+Math.random()*40,
			};
			sprite.scripts={
				physics:new basicPhysicsScript(sprite),
				update1:new mainGame.UpdateScript(l=>l.update.list[4],function*(){
					let ang=Math.random();
					let mag=Math.random();
					this.goto(Math.scaleVec2([Math.random()*2-1,Math.random()*2-1],100))
					while(1){yield;
						ang+=(Math.random()*2-1)/20;
						ang%=2;
						mag=1;//Math.lerp(mag,Math.random(),0.4);
						let moveBy=Math.vec2(Math.scaleVec2(
							[Math.sin(ang*Math.PI*2)*mag,mag*Math.cos(ang*Math.PI*2)],
							140,
						));
						this.velocity=Math.lerpT2(this.velocity,moveBy,0.9,mainGame.time.delta);
					}
				}.bind(sprite)()),
			};
			sprite.Draw={scripts:[
				[v=>Draw.circle(0,0,sprite.size,"grey"),d=>d.list[6]],
				[v=>Draw.square(0,0,10,Draw.hslColour((mainGame.time.start/4)%4,0.6,0.4)),d=>d.list[4]]
			]};
			Sprite.addSprite(sprite);
			playerConstructor.addCarryable(sprite);
			return sprite;
		};
		world.creature1=(()=>{//rock?
			
			let rocks=[];
			for(let i=0;i<10;i++){
				rocks.push(makeRock());//[0,0]
				rocks.push(makeRock1());//[0,0]
			}
			return rocks;
		})();
	}
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