{//makeSprite
	let mg=MainGame;
	let sprite=new Space.Sprite({
		OnStart(){
			this.attach();
		},
		...{
			coords:[100,0],
			size:20,
		},
		scripts:{
			mainUpdate:{attach:true,layer:l=>l.update[8],*script(layer,script){
					while(true){
						yield;
					}
				},
			},
			mainDraw:{attach:true,layer:l=>l.draw[8],script(layer,script){
					ctx.save();ctx.translate(...this.coords);{
						Draw.circle(0,0,this.size,"#37FF3760");//
					}ctx.restore();
					return false;
				},
			},
		},
	});
}