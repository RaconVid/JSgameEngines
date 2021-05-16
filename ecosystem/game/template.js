{//makeSprite
	let mg=MainGame;
	let sprite=new Space.Sprite({
		OnStart(){
			let s=this.scripts;
			s=this.entity;
			//s.chunks.push();
			this.attach();
		},
		values:{
			coords:[0,0],
			size:20,
		},
		scripts:{
			mainUpdate:{
				attach:true,
				layer:l=>l.update[8],
				*script(layer,script){
					while(true){
						yield;
					}
				},
			},
			mainDraw:{
				attach:true,
				layer:l=>l.draw[4],
				script(layer,script){
					ctx.save();ctx.translate(...this.coords);{
						Draw.circle(0,0,this.size,"grey");
					}ctx.restore();
					return false;
				},
			},
		},
	});
}