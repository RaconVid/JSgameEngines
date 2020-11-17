(function(){
	mainGame=new MainGame();
	mainGame.menuLayers={};
	function loadNewGame(mainGame){
		{//set up MainGame();
			mainGame.layers={
				update:mainGame.mainLayers.update,
				physics:new mainGame.UpdateLayer(),
				draw:new mainGame.UpdateLayer(),
				mainDraw:mainGame.mainLayers.draw,
				detectors:new mainGame.UpdateLayer(),
			}
			for (let i = 0; i < 10; i++) {
				mainGame.layers.update.list[i]=new mainGame.UpdateLayer();
			}
			for (let i = 0; i < 10; i++) {
				mainGame.layers.physics.list[i]=new mainGame.UpdateLayer();
			}
			for (let i = 0; i < 10; i++) {
				mainGame.layers.draw.list[i]=new mainGame.UpdateLayer();
			}
			for (let i = 0; i < 10; i++) {
				mainGame.layers.mainDraw.list[i]=new mainGame.UpdateLayer();
			}
			for (let i = 0; i < 4; i++) {
				mainGame.layers.detectors.list[i]=new mainGame.UpdateLayer();
			}
			mainGame.updateOrder=[
				mainGame.layers.detectors,
				mainGame.layers.update,
				mainGame.layers.physics,
				mainGame.layers.mainDraw,
			];
			let layers=mainGame.layers;
		}
		//sprites
			const layers=mainGame.layers;
			let mySprite=(()=>{
				let sprite={

				};
				sprite.update=new mainGame.UpdateScript(sprite,layers.update.list[4],undefined,function(layer,layer_i){
					const s=this.sprite;
				})
				sprite.draw=new mainGame.UpdateScript(sprite,layers.draw.list[4],undefined,function(layer,layer_i){
					const s=this.sprite;

				})
				return sprite;
			})();
			let firstPlane={
				list:[
				],
			};
			
			let player=(()=>{newPlayer=()=>{//6:30
				let sprite=Detachable.call({});
				sprite.body=Collider.call(Detachable.call(new Space.Entity(sprite,firstPlane),1),firstPlane).addDrawing().addPhysics().addCamera();
				sprite.body.coords=[300,100];
				sprite.speed=200;
				sprite.body.update=new mainGame.UpdateScript(sprite,layers.update.list[4],undefined,function(){
					const sprite=this.sprite;
					const body=this.sprite.body;
					if(Inputs.getKey("4").onDown){//die
						Inputs.keys["4"].onDown=false;
						sprite.detachScripts();
						body
					}
					//movement
						let moveIputs=[
							1*((Inputs.getKey("d").down||Inputs.getKey("ArrowRight").down)-(Inputs.getKey("a").down||Inputs.getKey("ArrowLeft").down)),
							1*((Inputs.getKey("s").down||Inputs.getKey("ArrowDown").down)-(Inputs.getKey("w").down||Inputs.getKey("ArrowUp").down)),
						];
						let moveVec=Math.lerpT2(body.velocity,Math.scaleVec2(moveIputs,sprite.speed*mainGame.time.delta),0.999,mainGame.time.delta);//Math.len2(this.velocity)
						body.velocity=Clone(moveVec);
					//-------
				},1);
				sprite.updateScriptList.push(sprite.body);
				sprite.body.hand=Collider.call({
					joinedTo:sprite.body,
					relCoords:[1,0],
					distFromBody:30,
					holdingCreature:null,
					jointUpdate:new mainGame.UpdateScript(sprite,layers.physics.list[6],undefined,function(){
						const part=this.sprite.body.hand;
						const body=this.sprite.body;
						let mousePos=Math.minusVec2(Inputs.mouse.vec2,[Draw.width/2,Draw.height/2]);
						if(Math.len2(mousePos)>0){
							part.relCoords=Math.scaleVec2(mousePos,part.distFromBody/Math.len2(mousePos))
						}
						part.coords=Math.addVec2(body.coords,part.relCoords);
						for (var i = 0; i < part.objsInHitbox.length; i++) {
							if(part.objsInHitbox[i] ==body){part.objsInHitbox.splice(i,1);i--}
						}
						if(part.objsInHitbox.length>0){
							if(part.holdingCreature==null){
								part.holdingCreature=part.objsInHitbox[0];
								part.col=part.holdingCreature.colour;
							}
							part.colour="#BB88556F";
						}
						else{
							part.colour="#00FF88";
						}
						if(part.holdingCreature!=null){//holding
							part.holdingCreature.colour=Draw.hslColour(mainGame.time.start%1,0.7,0.7);
							let i=0;
							for (; i < part.objsInHitbox.length; i++) {
								if(part.holdingCreature==part.objsInHitbox[i])break;
							}
							if(i==part.objsInHitbox.length){//detach held creature
								part.holdingCreature.colour=part.col;
								part.holdingCreature=null;
							}
							else{//holding.Update
								let obj=part.holdingCreature;
								if(Inputs.getKey("Space").down||Inputs.mouse.down){//space to use force
									//if obj has Physics
									if("physical" in obj.type)if(obj.Physics.movable!==false){//console.log(obj);alert();
										let dif=Math.dif2(part.coords,obj.coords);
										const force=0.3;
										let difA=Math.addVec2(Math.scaleVec2(dif, 0.6),body.velocity);
										let difB=Math.addVec2(Math.scaleVec2(dif,-0.6),obj.velocity);
										obj.velocity=Math.lerp2(obj.velocity,difA,force/obj.mass,mainGame.time.delta);
										body.velocity=Math.lerp2(body.velocity,difB,force/body.mass,mainGame.time.delta);
									}
								}
							}
						}
					}),
					onRemoveVars:{//undo things
						sprite:sprite,
						detachScripts:function(){
							const part=this.sprite.body.hand;
							if(part.holdingCreature!=null){//detach held creature
								part.holdingCreature.colour=part.col;
								part.holdingCreature=null;
							}
						},
					}
				},firstPlane).addDrawing().addDetector();
				const hand=sprite.body.hand;
				((updateObj)=>{
					let i=0;
					for (;i<updateObj.layer.list.length; i++) {
						if(updateObj.layer.list[i]==updateObj)break;
					}
					updateObj.layer.list.splice(i,1);

				})(sprite.body.hand.Drawing);
				hand.updateScriptList.push(hand.jointUpdate,hand.onRemoveVars);
				sprite.body.updateScriptList.push(sprite.body.hand,sprite.body.update,{//undo things
						sprite:sprite.body,
						attachScripts:function(){
							this.sprite.attachLayer();
						},
						detachScripts:function(){
							this.sprite.detachLayer();
						},
				});
				sprite.body.hand.Drawing.attachLayer(layers.draw.list[7]);
				sprite.body.hand.size=8;
				sprite.body.hand.relCoords=[sprite.body.hand.distFromBody,0];
				sprite.body.hand.coords=Math.addVec2(sprite.body.coords,sprite.body.hand.relCoords);

				sprite.body.draw_view.onUpdate=function(){
					const sprite=this.sprite;
					ctx.translate(Draw.width/2,Draw.height/2);
					Draw.undoTransform(sprite.matrixPos);
					sprite.viewLayer.onUpdate();
					Draw.transform(sprite.matrixPos);
					ctx.translate(-Draw.width/2,-Draw.height/2);
				};
				return sprite;
			};return newPlayer();} )();
			let sprite1=(()=>{
				let sprite={}//Collider.call(new Space.Entity(undefined,firstPlane),firstPlane).addDrawing().addPhysics(firstPlane);
				sprite.coords=[300,200];
				sprite.velocity=[0,0];
				sprite.colour="#00FF88";
				return sprite;
			})();
			let sprite2=(()=>{
				let sprite=Collider.call(new Space.Entity(undefined,firstPlane),firstPlane).addDrawing().addPhysics(firstPlane);
				sprite.coords=[350,200];
				sprite.mass=Infinity;
				sprite.type.movable=false;
				sprite.velocity=[-0,0];
				sprite.colour="#00FF88";
				return sprite;
			})();
			let sprite3=(()=>{
				let sprite=Collider.call(new Space.Entity(undefined,firstPlane),firstPlane).addDrawing().addPhysics(firstPlane);
				sprite.coords=[400,200];
				let KEnergy=1;
				sprite.mass=1;
				sprite.velocity=[-Math.sqrt(KEnergy/sprite.mass),0];
				sprite.colour="#00FF88";
				return sprite;
			})();
			let sprite4=(()=>{
				let sprite=Collider.call(new Space.Entity(undefined,firstPlane),firstPlane).addDrawing().addPhysics(firstPlane);
				sprite.coords=[400,160];
				sprite.mass=4;
				sprite.velocity=[0,0.5];
				sprite.colour="#00FF88";
				return sprite;
			})();
		//----
		//add meter bars
			for (let i = 0; i < 1; i++) {
				let idkBar=new GUI.Meterbar();
				idkBar.sprite=player;
				idkBar.getValue=function(){
					return [
						Math.abs(this.sprite.body.coords[0])/1000,
						Math.abs(this.sprite.body.coords[1])/1000,
						Math.abs(this.sprite.body.velocity[0])/10,
						Math.abs(this.sprite.body.velocity[1])/10,
						Math.abs(sprite3.coords[0])/1000,
						Math.abs(Math.sin(mainGame.time.start*1+Math.sqrt(i))+1)/2,
						Math.pow(Math.sin(mainGame.time.start*1+Math.sqrt(i)),2),
					][i%6];
				}
				idkBar.coords=[Math.random()*2-1,Math.random()*2-1];
			}
			let barmeter=new GUI.Meterbar();
			barmeter.getValue=()=>Math.len2(player.body.coords)/10000;
			barmeter=new GUI.Meterbar();//coords=[-0.98,0.98];
			barmeter.getValue=()=>(Math.len2(player.body.hand.coords)-Math.len2(player.body.coords))/100+0.5;
			barmeter.coords=[-0.98,0.98-0.06];
			barmeter=new GUI.Meterbar();
			barmeter.getValue=()=>Math.len2(player.body.velocity)/10;
			barmeter.coords=[-0.98,0.98-0.06*2];
			barmeter=new GUI.Meterbar();
			barmeter.getValue=()=>(Math.sin(mainGame.time.start*Math.PI*2/60)+1)/2;
			barmeter.coords=[-0.98,0.98-0.06*3];
			barmeter=new GUI.Meterbar();
			barmeter.getValue=()=>(1/mainGame.time.delta)/100;
			barmeter.coords=[-0.98,0.98-0.06*4];
		//----
	};
	loadNewGame(mainGame);
	//move to maingame list of layers
	mainGame.menuLayers.mainGame={updateOrder:mainGame.updateOrder,layers:mainGame.layers};
	mainGame.updateOrder=[];
	mainGame.layers={};
	//menus
		{//set up MainGame();
			mainGame.layers={
				update:new mainGame.UpdateLayer(),
				draw:new mainGame.UpdateLayer(),
			}
			mainGame.layers.draw.onUpdate=function(){
				Draw.clear();
				this.layerScript();
				mainGame.time.startLoop();
			};
			for (let i = 0; i < 10; i++) {
				mainGame.layers.update.list[i]=new mainGame.UpdateLayer();
			}
			for (let i = 0; i < 10; i++) {
				mainGame.layers.draw.list[i]=new mainGame.UpdateLayer();
			}
			mainGame.updateOrder=[
				mainGame.layers.update,
				mainGame.layers.draw,
			];
		}
		let layers=mainGame.layers;
		let mousePointer={
			size:4,
		}
		mousePointer.endUpdate=new mainGame.UpdateScript(mousePointer,layers.draw.list[9],undefined,function(){
			Inputs.mouse.onDown=false;
		},true)
		mousePointer.draw=new mainGame.UpdateScript(mousePointer,layers.draw.list[7],undefined,function(){
			Draw.circle(Inputs.mouse.x,Inputs.mouse.y,mousePointer.size,"#40A0FF80")
		},true)

		let menuScreen=(()=>{
			let button=class{
				constructor(){

				}
			};
			let menu_Main=Detachable.call({
				goToMenu:function(menu){
					mainGame.updateOrder=[{onUpdate:()=>{//reset and load maingame
						mainGame.orderLength=0;
						let menuObj=mainGame.menuLayers[menu];
						mainGame.updateOrder=menuObj.updateOrder;
						mainGame.layers=menuObj.layers;
					}}];
				},
				buttons:Detachable.call({
					start:(()=>{
						let newObj=Detachable.call({
							coords:[400,100],
							size:[100,50],
							isHover:false,
							onClick:function(){
								menu_Main.goToMenu("mainGame");
							},
						});
						newObj.update=new mainGame.UpdateScript(newObj,layers.update.list[4],undefined,function(){
							const s=this.sprite;
							let mouse=Inputs.mouse.vec2;
							let dist=Math.len2([
								Math.max(0,Math.abs(mouse[0]-s.coords[0]-s.size[0]/2)-s.size[0]/2),
								Math.max(0,Math.abs(mouse[1]-s.coords[1]-s.size[1]/2)-s.size[1]/2)
							])-mousePointer.size;
							if(dist<0){
								s.isHover=true;
								if(Inputs.mouse.onDown){
									Inputs.mouse.onDown=false;
									s.onClick();
								}
								
							}
							else{
								s.isHover=false;
							}
						},true);
						newObj.draw=new mainGame.UpdateScript(newObj,layers.draw.list[4],undefined,function(){
							const s=this.sprite;
							ctx.translate(s.coords[0],s.coords[1]);
							ctx.fillStyle="blue";
							ctx.textAlign = "center"; 
							ctx.font="30px Arial";
							if(s.isHover){
								ctx.fillStyle="green";
								ctx.fillText("*click*",s.size[0]/2,-2);
								ctx.fillRect(0,0,s.size[0],s.size[1]);
							}
							else{
								ctx.fillText("start",s.size[0]/2,-2);
								ctx.fillRect(0,0,s.size[0],s.size[1]);
							}
							
							ctx.translate(-s.coords[0],-s.coords[1]);
						},true);
					})(),
					options:Detachable.call({
						coords:[200,200],
						size:[100,50],
						onClick:function(){
							alert("hello");
						},
					}),
				}),
				drawScript:function(){
					{
						ctx.save();
						ctx.translate(Draw.width/2,80)
						ctx.rotate((mainGame.time.start)%(2*Math.PI));
						ctx.textAlign = "center"; 
						ctx.font="30px Arial";
						let text="Ecosystem!!!";
						var gradient = ctx.createLinearGradient(-ctx.measureText(text).width/2, 0, ctx.measureText(text).width/1.4,0);
						gradient.addColorStop("0"," magenta");
						gradient.addColorStop("0.5", "blue");
						gradient.addColorStop("1.0", "red");
						// Fill with gradient
						ctx.fillStyle = gradient;

						ctx.fillText(text,0,0);
						ctx.restore();
					}
				},
				draw:new mainGame.UpdateScript(mousePointer,layers.draw.list[7],undefined,()=>{
					menu_Main.drawScript();
				},true),
			});

			menu_Main.updateScriptList.push(menu_Main.buttons);
			for (let i in menu_Main.buttons) {
				menu_Main.buttons.updateScriptList.push(menu_Main.buttons[i]);
			}
			console.log(menu_Main)
			return menu_Main;
		})();
	//----
	mainGame.start();
})()