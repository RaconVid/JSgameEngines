//19:16
window. DEBUG_UI=true;
window. TESTING=true;
{
	{
		MainGame;
		Draw;ctx;
		Inputs;
		MainGame.layers={
			update:MainGame.mainLayers.update,
			draw:MainGame.mainLayers.draw,
			chunk:MainGame.mainLayers.chunk,
			//physics:new MainGame.UpdateLayer(16)//use l=>l.physics[0 to 15]
		};
		MainGame.updateOrder=[
			MainGame.layers.update,
			//MainGame.layers.physics,
			MainGame.layers.draw,
		];
	}let mg=MainGame;
	{
		world.chunk1.colliders=[];
		world.chunk1.players=[];
	}
	let trigger=function Trigger(enter,leave){
		this.onTriggerEnter=enter;
		this.onTriggerLeave=leave;
	};
	trigger.prototype={
		onTriggerEnter(sprite){},
		onTriggerLeave(sprite){},
		hasTrigger:true,
		triggerState:true,
	}
	if(Trigger??0)throw "\"Trigger\" already exists";
	var Trigger=trigger;
}
(function setDebug(){if(DEBUG_UI)if(1){
	if(0){//frame by frame testing
		let main1=new MainGame.UpdateLayer(...MainGame.updateOrder);
		MainGame.updateOrder=[
			new MainGame.UpdateScript(({}).a,()=>{
				let t=MainGame.time.real;
				if(Inputs.mouse.onDown){
					main1.onUpdate();
				}
				Inputs.mouse.onDown=false;
			})
		]
	}
	let a=1/60;//debug UI
	if(1)new MainGame.UpdateScript(l=>l.draw,()=>{
		Draw.square(100,100,10,"#AA884040");
		ctx.font="30px Arial";
		ctx.fillStyle="#FFFFFFD0";
		let b=MainGame.time.realDelta??0;
		const m=0.001;
		a=Math.abs(b-a)<m?b:a>b?a-m:a+m;
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
}})()
importJavascriptFromSrc(
	"game/player1.js",
	"game/template.js"
);MainGame.start();