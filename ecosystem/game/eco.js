{
	var mainGame;{
		mainGame = new MainGame();
		//
		mainGame.layers={
			update:mainGame.mainLayers.update,
			draw:mainGame.mainLayers.draw,
			//physics:new mainGame.UpdateLayer(16)//use l=>l.physics[0 to 15]
		};
		mainGame.updateOrder=[
			mainGame.layers.update,
			//mainGame.layers.physics,
			mainGame.layers.draw,
		];
	}let mg=mainGame;
	{
		world.chunk1.colliders=[];
	}
	Inputs.joysticks;{
		let joysticks=[];
		let joysticksKeys=[
			['ArrowUp','ArrowLeft','ArrowDown','ArrowRight'],
			['KeyW','KeyA','KeyS','KeyD'],
			[],
		];
		for(let i=0;i<joysticksKeys.length;i++){
			joysticksKeys[i]=joysticksKeys[i].map(v=>Inputs.getKey(v));
			joysticks[i]={
				keys:joysticksKeys[i],
				lastValue:[0,0],
				get vec2(){
					return Math.vec2(this.keys[3].down-this.keys[1].down,-(this.keys[0].down-this.keys[2].down));
				},
			};
		}
		joysticks[2]={
			keys:[...joysticks[0].keys,...joysticks[1].keys],
			lastValue:[0,0],
			get vec2(){
				let vec0=joysticks[0].vec2;
				let vec1=joysticks[1].vec2;
				return [
					Math.clamp(vec0[0]+vec1[0],-1,1),
					Math.clamp(vec0[1]+vec1[1],-1,1),
				];
			},
		};
		Inputs.joysticks=joysticks;
	};

}
importJavascriptFromSrc(
	"game/player1.js"
);mainGame.start();