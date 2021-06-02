player1:{//makeSprite
let mg=MainGame;
let player1=new Space.Sprite({
	OnStart(){
		//this.entity.chunks[0].players.push(this);
		let cameraLayer=this.scripts.cameraLayer=MainGame.layers.draw[8];
		let oldLayer=[...cameraLayer];
		cameraLayer.clear();
		cameraLayer.push(...new MainGame.UpdateLayer());
		cameraLayer[8].push(...oldLayer);
		this.scripts.mainDraw.setLayer().attach();
		this.attach();
	},
	...{
		coords:Math.vec2(100,100),
		size:10,
	},
	...{//"private vars"
		acceleration:Math.vec2(0,0),
		movementValues:{
			moveInputs:Inputs.getKey("KeysBoth"),
			maxSpeed:400,
			slowSpeed:1/0.25,
			accelerationSpeed:1/0.12,
			velocity:Math.vec2(0,0),
		},
	},
	scripts:{
		mainUpdate:{attach:true,layer:l=>l.update[8],*script(layer,script){
			while(true){
				movement:{
					let ns=this.movementValues;//nameSpace
					if(ns.moveInputs.down){
						let s=1*(MainGame.time.delta);
						ns.velocity.set(ns.velocity.add(Math.scaleVec2(ns.moveInputs.vec2,s*ns.maxSpeed*(ns.slowSpeed+ns.accelerationSpeed))));
					}
					let len=Math.len2(ns.velocity);
					len=len/len!=1?0:Math.clamp(0,ns.maxSpeed,len-ns.slowSpeed*ns.maxSpeed*MainGame.time.delta)/len;
					if(len==0)ns.velocity.set([0,0]);
					else ns.velocity.set(Math.scaleVec2(ns.velocity,len));
					if(Math.len2(ns.velocity)>0){
						this.coords.set(this.coords.add(Math.scaleVec2(ns.velocity,MainGame.time.delta)));
					}
				}
				for(let chunk of this.entity.chunks){let i=0;
					for(let obj of chunk.list){
						if(obj==this)continue;
						let dist=Math.len2(this.coords,obj.coords);
						let sizeSum=this.size+obj.size,dist1=dist-sizeSum;
						if(obj.hasTrigger){
							if(dist1<-1&&obj.onTriggerEnter&&obj.triggerState){
								obj.onTriggerEnter(this);//for
							}else if(dist1>1&&obj.onTriggerLeave&&!obj.triggerState){
								obj.onTriggerLeave(this);
							}
						}else if(obj.canBePickedUpByPlayer){
							;
						}
					}
				}
				yield;
			}
		}},
		cam1Start:{
			attach:true,layer:l=>l.draw[7],script(layer,script){
				ctx.save();
				ctx.translate(...Math.addVec2(Math.scaleVec2(this.coords,-1),Draw.center));
			},
		},
		cam1End:{
			attach:true,layer:l=>l.draw[9],script(layer,script){
				ctx.restore();
			},
		},
		mainDraw:{
			attach:false,
			layer:l=>l.draw[8][8],
			script(layer,script){
				ctx.save();ctx.translate(...this.coords);{
					Draw.circle(0,0,this.size,"grey");
				}ctx.restore();
				return false;
			},
		},
	},
});
let rockClass =(coords,chunk)=>new Space.Sprite({
	OnStart(){
		this.scripts.mainDraw.text="none";
	},...{
		size:20,
		mass:10,
		coords:new Math.vec2(coords),
		canBePickedUpByPlayer:true,
	},...{
		envioment:rockClass.envioment,
		isAlive:true,
	},
	scripts:{
		moveMent1:{attach:true,layer:l=>l.update[8],*script(){
			let timers=[0,0,0];
			while(this.isAlive){
				{//waiting1
					this.scripts.mainDraw.text="waiting";
					let timer=timers[0]=Math.random()*1.5+0.1;
					while((timer-=MainGame.time.delta)>0){
						yield;
						this.scripts.mainDraw.text="waiting:"+timer.toFixed(3);
					}
				}yield;
				{
					let targetCoords=this.coords;
					this.scripts.searchingScript1.attach();
					//let randSum=0.5;
					searchForGoodSpaceToMoveTo:while(true){
						//for(let i=0;i<1;i++){
							targetCoords=this.envioment.getRandomCoordinates();
							if(Math.len2(this.coords,targetCoords)>this.size*3){
								continue;
							}
							//if((randSum-=(Math.random()*MainGame.time.delta*2))>0)continue
							break searchForGoodSpaceToMoveTo;
						//}
						yield;
					}
					this.scripts.searchingScript1.detach();
					this.scripts.mainDraw.text="moving";
					let moveTime=Math.random()*4+1;
					let moveVec=Math.scaleVec2(Math.dif2(targetCoords,this.coords),1/moveTime);

					while((moveTime-=MainGame.time.delta)>=0){
						this.scripts.mainDraw.text="moving:"+moveTime.toFixed(3);
						this.coords.set(this.coords.add(Math.scaleVec2(moveVec,MainGame.time.delta)));
						yield;
					}this.scripts.mainDraw.text="stoped moving";
					this.coords.set(targetCoords);
					yield;
				}
			}
		}},
		searchingScript1:{attach:false,layer:l=>l.update[8],*script(){
			let setTimer=function*(t){while((t-=MainGame.time.delta)>0){yield t};yield 0;}
			let wait=0.25;
			while(true){
				yield*setTimer(wait);
				this.scripts.mainDraw.text="searching.";
				yield*setTimer(wait);
				this.scripts.mainDraw.text="searching..";
				yield*setTimer(wait);
				this.scripts.mainDraw.text="searching...";
				yield*setTimer(wait);
				this.scripts.mainDraw.text="searching";
			}
		}},
		mainDraw:{
			attach:true,
			layer:l=>l.draw[8][4],
			script(layer,script){if(Math.random()>0.9){this.scripts.delete(script);return true;}
				ctx.save();ctx.translate(...this.coords);{
					Draw.circle(0,0,this.size,"grey");
					ctx.strokeStyle="lightGrey";
					ctx.stroke();
					Draw.Text({text:script.text})();
				}ctx.restore();
				return false;
			},
		},
	},
});
let RPSenvioment = new Space.Sprite({
	OnStart(){
		for(let i of this.sprites){
			i.parentSprite=this;
		}
		this.attach();
		rockClass.envioment=this;
		for(let i=0;i<10000;i++){
			this.sprites.add(rockClass(this.getRandomCoordinates(),this));
		}
	},
	...{//public vars
		coords:Math.vec2(800,300),
		size:500+300,//triggerSize
		innerSize:500,
		hasTrigger:true,
		triggerState:true,//true if player outside trigger
		onTriggerEnter(sprite){
			this.sprites.attach();
			this.triggerState=false;
		},
		onTriggerLeave(sprite){
			this.sprites.detach();
			this.triggerState=true;
		},
		getRandomCoordinates(){
			let c;//coords
			c=[Math.random()*this.innerSize,Math.random()*Math.TAU];//mod arg form
			c=Math.addVec2(this.coords,Math.scaleVec2(Math.rotate([0,1],c[1],0,1),c[0]));
			return c;
		}
	},
	...{//"private" vars
		sprites:new MainGame.UpdateModule([
			new Space.Sprite({
				[Symbol("sprite name")]:"resource handler",
				OnStart(){
					;
				},
				...{
					resources:{//encludes all things in the envioment
						metalRock:0,//~num of rocks
						thinWood:0,//~num of papers
						spikySignals:0,//~num of scissors
					},
					numOf:{
						rocks:11,
						papers:5,
						scissors:3,
					},
					cyclePhase:-1,
					coords:[Infinity,Infinity],
				},...{
					_relCoords:[0,0],
				},
				scripts:{
					onWake:{attach:true,layer:l=>l.update[4],script(l,s){
						this.coords=Math.addVec2(this.parentSprite.coords,this._relCoords);
						return true;await
					}},
					update:{attach:true,layer:l=>l.update[8],async *script(layer,script){
						let killEnviomentTimer=new MainGame.UpdateScript(l=>l.update[4],function*(l,s){
							let t=0;
							while(t+=MainGame.time.delta<1){yield;};
							this.
							return;
						}.bind(this.scripts.update)());killEnviomentTimer.detach();
						let hasYielded=false;
						while(true){
							while(this.cyclePhase==-1){//start envioment
								if(
									this.resources.metalRock>10&&
									this.resources.thinWood>10&&
									this.resources.spikySignals>10
								){
									this.cyclePhase=0;
									break;
								}else{//timer to recreate envioment
									killEnviomentTimer.attach();
									script.detach();//pause script
								}
								yield;
							}
						}
					}},
					draw:{attach:true,layer:l=>l.draw[8][10],script(){
							ctx.save();
							ctx.translate(...this.coords)
							Draw.Text({
								text:"hello world",x:0,y:0,
								color:"white",
								size:10,
								align:"center",
							})();
							ctx.restore();
						}
					}
				},
			}),
			new Space.Sprite({}),
		]),
	},
	scripts:{
		mainDraw:{
			attach:loga,
			layer:l=>l.draw[8][4],
			script(layer,script){if(!player1.canSeeTriggers){return true;}
				ctx.save();ctx.translate(...this.coords);{
					Draw.circle(0,0,this.size,"#00A40040");
					ctx.strokeStyle="88FFAA9F";
					ctx.stroke();
				}ctx.restore();
				return false;
			},
		},
	},
});
}