//19:16
{
	{
		MainGame;
		Draw;ctx;
		Inputs;
		MainGame.layers={
			update:MainGame.mainLayers.update,
			draw:MainGame.mainLayers.draw,
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
importJavascriptFromSrc(
	"game/player1.js",
	"game/template.js"
);MainGame.start();