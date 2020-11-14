(function(){
	mainGame=new MainGame();
	(()=>{//set up MainGame();
		mainGame.layers={
			update:mainGame.mainLayers.update,
			physics:new mainGame.UpdateLayer(),
			draw:mainGame.mainLayers.draw,
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
		for (let i = 0; i < 4; i++) {
			mainGame.layers.detectors.list[i]=new mainGame.UpdateLayer();
		}
		mainGame.updateOrder=[
			mainGame.layers.detectors,
			mainGame.layers.update,
			mainGame.layers.physics,
			mainGame.layers.draw,
		];
		let layers=mainGame.layers;
	})();
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
	
	let player=(()=>{//6:30
		let sprite={};
		sprite.body=Collider.call(new Space.Entity(sprite,firstPlane),firstPlane).addDrawing().addPhysics();
		sprite.body.coords=[300,100];
		sprite.speed=200;
		sprite.body.update=new mainGame.UpdateScript(sprite,layers.update.list[4],undefined,function(){
			const sprite=this.sprite;
			const body=this.sprite.body;
			let moveIputs=[
				1*((Inputs.getKey("d").down||Inputs.getKey("ArrowRight").down)-(Inputs.getKey("a").down||Inputs.getKey("ArrowLeft").down)),
				1*((Inputs.getKey("s").down||Inputs.getKey("ArrowDown").down)-(Inputs.getKey("w").down||Inputs.getKey("ArrowUp").down)),
			];
			let moveVec=Math.lerpT2(body.velocity,Math.scaleVec2(moveIputs,sprite.speed*mainGame.time.delta),0.999,mainGame.time.delta);//Math.len2(this.velocity)
			body.velocity=Clone(moveVec);
		});
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
								dif=Math.addVec2(Math.scaleVec2(dif,0.6),body.velocity);
								obj.velocity=Math.lerp2(obj.velocity,dif,force/obj.mass,mainGame.time.delta);
							}
						}
					}
				}
			}),
		},firstPlane).addDrawing().addDetector();
		((updateObj)=>{
			let i=0;
			for (;i<updateObj.layer.list.length; i++) {
				if(updateObj.layer.list[i]==updateObj)break;
			}
			updateObj.layer.list.splice(i,1);

		})(sprite.body.hand.Drawing)
		//sprite.body.hand.Drawing.detachLayer();
		//mainGame.mainLayers.draw.onUpdate();
		sprite.body.hand.Drawing.attachLayer(layers.draw.list[7]);
		sprite.body.hand.size=8;
		sprite.body.hand.relCoords=[sprite.body.hand.distFromBody,0];
		sprite.body.hand.coords=Math.addVec2(sprite.body.coords,sprite.body.hand.relCoords);
		sprite.Camra={
			ScriptA:new mainGame.UpdateScript(sprite,layers.draw.list[2],undefined,function(){
				Draw.undoTransform(sprite.body.matrixPos);
				ctx.translate(Draw.width/2-sprite.body.coords[0],Draw.height/2-sprite.body.coords[1]);
			}),
			ScriptB:new mainGame.UpdateScript(sprite,layers.draw.list[9],undefined,function(){
				ctx.translate(sprite.body.coords[0]-Draw.width/2,sprite.body.coords[1]-Draw.height/2);
				Draw.transform(sprite.body.matrixPos);
			}),
		}
	})();
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
		sprite.coords=[370,150];
		sprite.mass=4;
		sprite.velocity=[0,0.5];
		sprite.colour="#00FF88";
		return sprite;
	})();
	mainGame.start();
})()