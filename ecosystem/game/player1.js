player1:{
	let mg=mainGame;
	let sprite={};
	sprite=world.chunk1.newEntity();
	sprite.chunks=[world.chunk1,world.chunk1];
	Object.assign(sprite,{
		scripts:mg.makeScripts({
			start:{
				layer:l=>l.update[4],
				script(layer,script){
					this.scripts.main.attach();
					this.scripts.camera1.attach();
					return true;
				},
			},
			main:{
				layer:l=>l.update[8],
				script(layer,script){
					let speed=80;
					this.coords=Math.addVec2(
						this.coords,
						Math.scaleVec2(
							Inputs.joysticks[1].vec2,
							speed*mg.time.delta
						)
					);
				},
			},
			collider:{
				layer:l=>l.update[10],
				script(layer,script){
					let view=this.chunks[0].list;
					let ray={
						coords:this.coords,
						size:this.collider.size,
						direction:[0,1],
					};
					for(let i=0;i<view.length;i++){
						if(view[i]&&view[i].collider&&view[i]!=this){
							view[i].collider.getDist(ray);
						}else continue;
					}
				},
			},
			camera1:{
				layer:l=>l.draw[8],
				script(layer,script){
					for(let i of this.chunks[0].list){
						Draw.circle(...i.coords,15,"blue");
					}
				},
			},
			template1:{
				layer:l=>l.update[8],
				script(layer,script){
					return true;//end script
				},
			},
			template2:{
				layer:l=>l.update[8],
				*script(layer,script){
					while(true){
						yield;
						return;//end script
					}
				},
			},
		},sprite),
		collider:{
			size:10,
			//ray={coords:[0,0],size:10,direction:[1,0]}
			getIntersect(ray):function(ray){
				return 1;
			}.bind(sprite),
			getDist:function(ray){
				return Math.len2(this.coords,ray.coords)-(ray.size+this.collider.size);
			}.bind(sprite),
			getNormal(ray):function(ray){
				return 1;
			}.bind(sprite),
			getPathDist(ray):function(ray){
				return 1;
			}.bind(sprite),
		},
	});
	sprite.scripts.start.attach();
}