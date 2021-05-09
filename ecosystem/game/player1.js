player1:{for(let III=0;III<2;III++){const II=III;
	let mg=mainGame;
	let sprite={};
	sprite=world.chunk1.newEntity();
	//sprite.chunks=[world.chunk1,world.chunk1.colliders];
	//sprite.attach();
	sprite.coords=[0,II*10];
	Object.assign(sprite,{
		scripts:mg.makeScripts({
			start:{
				layer:l=>l.update[4],
				script(layer,script){
					this.scripts.main.attach();
					this.scripts.camera1.attach();
					this.scripts.collider.attach();
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
							Inputs.joysticks[II].vec2,
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
					let marchData={
					};
					for(let i=0;i<view.length;i++){
						if(view[i]&&view[i].collider&&view[i]!=this){
							marchData=view[i].collider.getRayMarchData(ray);
							if(marchData.intersect){
								this.coords=Math.addVec2(this.coords,Math.scaleVec2(marchData.normal,Math.abs(marchData.dist)/2 ));
								view[i].coords=Math.addVec2(view[i].coords,Math.scaleVec2(marchData.normal,-Math.abs(marchData.dist)/2 ));
							}
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
			rayIn:{
				coords:[0,0],
				size:10,
				direction:[1,0]
			},
			rayOut:{
				dist:Infinity,
				intersect:false,
				normal:[0,1],
				coords:[0,0],
			},
			getRayMarchData:function(ray){
				let dif=Math.dif2(ray.coords,this.coords);
				let dist=Math.len2(dif);
				let normalVector=Math.scaleVec2(dif,1/dist);
				dist-=(ray.size+this.collider.size);
				let normalPosition=Math.addVec2(this.coords,Math.scaleVec2(normalVector,this.collider.size));
				return{
					intersect:dist<0,
					dist:dist,
					normal:normalVector,
					coords:normalPosition,
				};
			}.bind(sprite),
			getIntersect:function(ray){
				return 1;
			}.bind(sprite),
			getDist:function(ray){
				return Math.len2(dif)-(ray.size+this.collider.size);
			}.bind(sprite),
			getNormal:function(ray){
				return [];
			}.bind(sprite),
			getPathDist:function(ray){
				return 1;
			}.bind(sprite),
		},
	});
	sprite.scripts.start.attach();
}}