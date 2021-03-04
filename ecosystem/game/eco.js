window. DEBUG_UI=true;
window. TESTING=true;
(function(){//load main game
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
			return new mainGame.UpdateScript(l=>l.physics.list[6],function*(){
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
		function costume(drawLayerNumber=10,script=10){//convension of drawlayers.length=20
			if(typeof(script)=="number"){
				return [drawLayerNumber,draw=>draw.list[script]];
			}
			return [script,draw=>draw.list[drawLayerNumber]];
		}
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
	}
	let player1;let newPlayer1=()=>{
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
		newPlayerCamera(player1);
		basicPhysicsScript(player1);
	}
	newPlayer1();
	player1.coords=[0,10];
	newPlayer1();
	{
		new mainGame.UpdateScript(l=>l.update.list[4],function*thing(){
			let speed=200;
			let moveForce=2;
			while(true){
				let joystick=Math.vec2(Inputs.getKey("d").down-Inputs.getKey("a").down,Inputs.getKey("s").down-Inputs.getKey("w").down);
				let targetMoveVelocity=Math.scaleVec2(joystick,speed);
				let len=Math.len2(this.velocity,targetMoveVelocity);
				if(len!=0){
					let forceNeeded=len*this.mass;
					let force=Math.min(moveForce*mainGame.time.delta,forceNeeded);
					this.velocity=Math.lerp2(this.velocity,targetMoveVelocity,force/forceNeeded);
				}
				yield;
			}
		}.bind(Space.Sprite.addSprite({mass:100}))());
	}
})()
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
		if(0)ctx.fillText("view:"+world.player2.camera.cameraObj.viewList.length,100,140);
		ctx.font="15px Arial";
		if(0){
			ctx.fillText("P1 chunk:"+world.player1.entity.layer.coords,100,240);
			ctx.fillText("P2 chunk:"+world.player2.entity.layer.coords,100,255);
		}
	})
}
mainGame.start();