window. DEBUG_UI=true;
window. TESTING=true;
function setDebug(){if(DEBUG_UI)if(1){
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
			const col1= Draw.hslaColour(Math.clamp(0,1,(fps-10)/(60-15))*0.33,0.5,0.66,0.8);
			ctx.fillStyle=col1;
			//ctx.fillStyle="#FFFFFFD0";
			let modulo=10;
			let fpsDIV=(fps-fps%modulo)/modulo;
			for(let i=0;i<fpsDIV;i++){
				let x=i;
				ctx.fillRect(100+14*x,60,10,10);
			}
			
			ctx.fillRect(100+14*fpsDIV,60,10*(fps%modulo)/modulo,10);
			ctx.fillStyle="#FFFFFFD0";
		}
		if(0)ctx.fillText("view:"+world.player2.camera.cameraObj.viewList.length,100,140);
		ctx.font="15px Arial";
		if(0){
			ctx.fillText("P1 chunk:"+world.player1.entity.layer.coords,100,240);
			ctx.fillText("P2 chunk:"+world.player2.entity.layer.coords,100,255);
		}
	})
}}
(function(){//load main game
	{
		window.mainGame=new MainGame();
		window. world=new World();
		{//set up maingame UpdateLayers
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
		{//Sprite extensions
			let friction=1.5;
			function newPlayerCamera(entity){};
			function basicPhysicsScript(bindObj){};
			function costume(drawLayerNumber,script){};
			{
				function newPlayerCamera(entity,rect=[0,0,1,1]){
					let camera=Collider.call({},world.chunk1).addCamera(true);
					camera.view_rect=rect.map((v,i)=>v*[Draw.width,Draw.height][i%2]);
					camera.size=Math.max(0,10+Math.len2([camera.view_rect[2],camera.view_rect[3]])/2);
					Object.defineProperties(camera,{
						coords:{get(){return entity.coords;}},
						velocity:{get(){return entity.velocity;}},
						layer:{get(){return entity.layer;}},
					});
					return camera;
				}
				function basicPhysicsScript(bindObj){
					let collisions1=collisions.bind(bindObj);
					bindObj.scripts.basicPhysicsScript=new mainGame.UpdateScript(l=>l.physics.list[6],function*(){
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
				let collisions=function*(){
					let n=0;
					let oldLayer=this.layer;
					for(let relPos of this.viewSearch(this.size*4)){
						if(!relPos.obj.type)continue;
						if(relPos.obj.type.shape!="circle")continue;
						let dif=Math.vec2(Math.dif2(relPos.coords,this.coords))
						.add(Math.scaleVec2(Math.dif2(relPos.velocity,this.velocity),mainGame.time.delta));
						let sizeSum=relPos.obj.size+this.size;
						let dist=Math.hypot(...dif);
						if(dist<sizeSum&&dist>0){
							let massSum=(this.mass+relPos.obj.mass);
							let forces=[
								relPos.obj.mass/massSum,
								-this.mass/massSum,
							];
							forces=[
								(isNaN(forces[0])?!isNaN(forces[1]):forces[0]),
								(isNaN(forces[1])?!isNaN(forces[0]):forces[1]),
							];
							let coordsScale=(dist-sizeSum)/dist;
							this.goto(Math.addVec2(this.coords,Math.scaleVec2(dif,forces[0]*coordsScale)));
							relPos.coords=(Math.addVec2(relPos.coords,Math.scaleVec2(dif,forces[1]*coordsScale)));
							//yield;
						}
						n++;
						if(n==20){n=0;yield;}
						//if(this.layer!=oldLayer)return;
					}
				};
				function costume(drawLayerNumber=10,script=10){//convension of drawlayers.length=20
					if(typeof(script)=="number"){
						return [drawLayerNumber,draw=>draw.list[script]];
					}
					return [script,draw=>draw.list[drawLayerNumber]];
				}
				function* trackTarget(targetRelPos=this){//unfinnished
					let newRelPos=new Space.RelPos(targetRelPos);
					while(true){
						let view=newRelPos.pos.layer.viewSearch();
						for(let i of view){
							if(i.obj==relPos.obj){
								relPos
								return i;
							}
						}
						yield newRelPos;
					}
				}
			}
		}
	}
	player1={};let newPlayer1=()=>{
		player1={
			coords:[0,0],
			velocity:[0,0],
			mass:10,
			size:10,
			deleteList:[
				()=>{
	
				}
			],
			Draw:{scripts:[]},
			type:{scissors:true},
		};
		player1.Draw.scripts=[
			costume(function drawing(){
				Draw.circle(0,0,this.size,"blue");
			}.bind(player1),15),
		]
		player1.scripts={
			main:new mainGame.UpdateScript(l=>l.update.list[4],function*(){
				let speed=200;
				let moveForce=200*1/0;
				while(true){
					let joystick=Math.vec2(Inputs.getKey("d").down-Inputs.getKey("a").down,Inputs.getKey("s").down-Inputs.getKey("w").down);
					let targetMoveVelocity=Math.scaleVec2(joystick,speed);
					let len=Math.len2(this.velocity,targetMoveVelocity);
					if(len!=0){
						let forceNeeded=len;// *this.mass
						let force=Math.min(moveForce*mainGame.time.delta,forceNeeded);
						this.velocity=Math.lerp2(this.velocity,targetMoveVelocity,force/forceNeeded);
					}
					yield;
				}
			}.bind(player1)()),
		};
		Space.Sprite.addSprite(player1);
		let camera=newPlayerCamera(player1);
		basicPhysicsScript(player1);
		player1.deleteList.push(()=>camera.detachScripts());
	}
	newPlayer1();
	{//Rock
		function rock_Paper_Scissors(){
			let newObj=new Space.Sprite({
				coords:[0,0],
				velocity:[0,0],
				mass:10,
				size:10 *-1,
				deleteList:[
					()=>{

					},
				],
				type:{rock:true},
				keywords:{metalic1:1},
				...{
					energy:10,
				}
			});
			delete newObj.type.shape;
			basicPhysicsScript(newObj);
			let targetFunc=function*targetFunc(targetObj){
				let startTime=mainGame.time.start;
				let time1=0;
				let gotoCoords;
				while((time1=mainGame.time.start-startTime)<2 *100*TESTING){
					gotoCoords=Math.vec2(Math.dif2(targetObj.coords,this.coords));
					let neededForce=Math.len2(Math.dif2(targetObj.coords,this.coords),this.velocity);
					let force=10;
					force=Math.min(force,neededForce);
					this.velocity=Math.lerp2(this.velocity,Math.dif2(targetObj.coords,this.coords),Math.min(10,force*mainGame.time.delta));
					yield;
				}
				if(Math.len2(targetObj.coords,this.coords)-this.size-targetObj.obj.size<60){
					//add kill animations
					//delete target
					new mainGame.UpdateScript(l=>l.update.list[3],function*(){
						let obj1=costume(12,
							()=>Draw.circle(0,0,targetObj.obj.size+20+5*Math.sin(mainGame.time.start-time1),"#FF408080")
						);
						targetObj.obj.Draw.scripts.push(obj1);
						this.Draw.scripts.push(obj1);
						let startTime=mainGame.time.start;
						while(mainGame.time.start-startTime<1){yield;}
						this.energy+=1;
						let index=targetObj.obj.Draw.scripts.indexOf(obj1);
						targetObj.obj.Draw.scripts.splice(index,1);
						targetObj.obj.delete();
						index=this.Draw.scripts.indexOf(obj1);
						this.Draw.scripts.splice(index,1);
						return;
					}.bind(this)());
				}
				else{
					new mainGame.UpdateScript(l=>l.update.list[3],function*(){
						let obj1=costume(12,()=>{
							Draw.line(-10,-10,10,10,3,"red");
							Draw.line(10,-10,-10,10,3,"red");
						}
						);
						this.Draw.scripts.push(obj1);
						let startTime=mainGame.time.start;
						while(mainGame.time.start-startTime<1){yield;}
						let index=this.Draw.scripts.indexOf(obj1);
						this.Draw.scripts.splice(index,1);
					}.bind(this)());
				}
				while((time1=mainGame.time.start-startTime)<0.25){

					yield;
				}
				return;
			}.bind(newObj);
			newObj.scripts={
				script1:new mainGame.Script(layers=>layers.update.list[5],function*(){
					let view=this.viewSearch();
					let typesFound={rock:[],paper:[],scissors:[]};
					while(true){
						rockLoop:{
							hunting:while(true){
								this.type.rock=true;
								let minObj=null;let minDist=Infinity;
								view=this.viewSearch();
								for(let relPos of view){
									if(!relPos.obj.type)continue;
									//if(!relPos.obj.keywords)continue;
									let dist=Math.len2(relPos.coords,this.coords);
									if(dist<minDist&&dist<300){
										let type;
										if(type=relPos.obj.type)
										if(type.scissors){
											minObj=relPos;typesFound.scissors.push(relPos);
											minDist=dist;
										}
									}
									if(minObj){//if(Math.random()<0.2+0.2*minDist/100){
										break;
									}
								}
								if(minObj){//if(Math.random()<0.2+0.2*minDist/100){
									//chase target
									let targetObj=new Space.RelPos(minObj);
									let itter=targetFunc(targetObj);
									let oldLayer=targetObj.obj.layer;
									let oldThisLayer=this.layer;
									while(!itter.next().done){
										if(TESTING||(oldThisLayer!=this.layer||oldLayer!=targetObj.obj.layer)){//refind object
											let found=false;
											let view=this.layer.viewSearch();
											oldThisLayer=this.layer;
											oldLayer=targetObj.obj.layer;
											for(let relPos of view){//BUGGY WHEN >=2 chunks away
												if(!TESTING){
													if(!relPos.obj.type.chunk){}//view.next(false);
													else{
														let index=relPos.obj.list.indexOf(targetObj.obj.refEntity);
														if(index!=-1){
															targetObj.pos=relPos.obj.list[index].pos.add(relPos.pos);
															found=true;break;
														}
													}
													continue;
												}
												else{
													if(relPos.obj==targetObj.obj){
														targetObj.pos=relPos.pos;
														found=true;break;
													}
												}
											}
											if(!found)break;
										}
										//this.velocity=[0,0];
										yield;
									}
									yield;
								}
								if(this.energy>14){
									break hunting;
								}
								yield;
							}
							while(this.energy>10){
								if(Math.random()<=1-Math.pow(1-0.5,mainGame.time.delta)){
									let newObj=rock_Paper_Scissors();
									newObj.coords=Math.addVec2(this.coords,[40,40]);
									newObj.refEntity.pos=new Space.Pos(this.refEntity.pos);
								}
							}
						}
						yield;
					}
				}.bind(newObj)()),
			};
			newObj.Draw.scripts=[
				//...newObj.Draw.scripts,
				[function(p){
					Draw.circle(0,10,this.size*0+10,"green");
				}.bind(newObj),draw=>draw.list[15]],
			];
			return newObj;
		}
		window.rock_Paper_Scissors=rock_Paper_Scissors;
		rock_Paper_Scissors();
	}
	{
		new Sprite({
			coords:[20,40],
			Draw:{scripts:[[()=>{ctx.drawImage(Images.icon,0,-50)},draw=>draw.list[15]]]}
		})
		new Sprite({
			coords:[0,0],
			Draw:{scripts:[[()=>{ctx.drawImage(Images.icon,0,-50)},draw=>draw.list[15]]]}
		})
	}
})()
setDebug();
mainGame.start();