player1:{for(let III=0;III<2;III++){const II=III;
	let mg=MainGame;
	let sprite=new Space.Sprite({
		get chunks(){return this.entity.chunks;},
		set chunks(v){this.entity.chunks=v;},
		coords:[200,200+1*II],
		get size(){return this.collider.size},
		set size(val){this.collider.size=val},
		scripts:{
			start:{
				layer:l=>l.update[4],
				script(layer,script){
					this.scripts.main.attach();
					this.scripts.camera1.attach();
					this.scripts.collider.attach();
					this.scripts.add(
						this.scripts.main,
						this.scripts.camera1,
						this.scripts.collider,
					);
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
				script(layer,script){return 1;
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
								this.coords=Math.addVec2(this.coords,Math.scaleVec2(marchData.normal,Math.abs(marchData.dist)/2+1 ));
								view[i].coords=Math.addVec2(view[i].coords,Math.scaleVec2(marchData.normal,-Math.abs(marchData.dist)/2-1 ));
								view[i].collider.onCollide?.(ray,this);
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
		},
	});
	let spriteKeys={
		damaging1:Symbol("damage draw"),
	};
	Object.assign(sprite,{
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

			onCollide:function(ray,sprite){
				let self=this;
				if(self.collider[spriteKeys.damaging1])return;
				else{
					self.collider[spriteKeys.damaging1]=true;
				}
				let rot=mg.time.start;
				let damaging1=new mg.UpdateScript(l=>l.draw[8],()=>{
					ctx.save();
					ctx.translate(...self.coords);
					ctx.rotate(rot%Math.TAU);
					Draw.square(0,0,15+5*Math.sin(mg.time.start*Math.TAU/2),"#FF000080");
					ctx.restore();
				}).attach();
				this.scripts.add(new mg.UpdateScript(l=>l.update[8],function*damaging1_t1(){
					self.scripts.add(damaging1)
					let t=2;while((t-=mg.time.delta)>0){yield;}
					self.scripts.delete(damaging1.detach());
					delete self.collider[spriteKeys.damaging1];
				}).attach());
			}.bind(sprite),
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
	sprite.scripts.add(sprite.scripts.start);
	sprite.entity.chunks=[world.chunk1];
	sprite.attach();
}};
{
	let addColider=function collider(sprite){
		let self=collider;
		const proto=new Space.Sprite({
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
				onCollide:function(ray,sprite){
					let self=this;
					if(self.collider[spriteKeys.damaging1])return;
					else{
						self.collider[spriteKeys.damaging1]=true;
					}
					let rot=mg.time.start;
					let damaging1=new mg.UpdateScript(l=>l.draw[8],()=>{
						ctx.save();
						ctx.translate(...self.coords);
						ctx.rotate(rot%Math.TAU);
						Draw.square(0,0,15+5*Math.sin(mg.time.start*Math.TAU/2),"#FF000080");
						ctx.restore();
					}).attach();
					this.scripts.add(new mg.UpdateScript(l=>l.update[8],function*damaging1_t1(){
						self.scripts.add(damaging1)
						let t=2;while((t-=mg.time.delta)>0){yield;}
						self.scripts.delete(damaging1.detach());
						delete self.collider[spriteKeys.damaging1];
					}).attach());
				}.bind(sprite),
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
		sprite[self.keys.collider]=proto.collider;
		let scripts=MainGame.makeScripts(self.prototype.scripts,sprite);
		for(let i in scripts){
			sprite.scripts.add(scripts[i]);
		}
	};
	addColider.prototype={
		keys:{
			collider:Symbol("collider"),	
		},
		scripts:{
			collider:{
				attach:true,
				layer:l=>l.update[10],
				script(layer,script){return 1;
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
								this.coords=Math.addVec2(this.coords,Math.scaleVec2(marchData.normal,Math.abs(marchData.dist)/2+1 ));
								view[i].coords=Math.addVec2(view[i].coords,Math.scaleVec2(marchData.normal,-Math.abs(marchData.dist)/2-1 ));
								view[i].collider.onCollide?.(ray,this);
							}
						}else continue;
					}
				},
			},
		},
	}
}