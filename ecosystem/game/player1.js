player1:{//makeSprite
let mg=MainGame;
let cameraLayer;{
	cameraLayer=MainGame.layers.draw[8];
	let oldLayer=[...cameraLayer];
	cameraLayer.clear();
	cameraLayer.push(...new MainGame.UpdateLayer());
	cameraLayer[8].push(...oldLayer);
}
let player1=new Space.Sprite({
	OnStart(){
		//this.entity.chunks[0].players.push(this);
		this.scripts.cameraLayer=cameraLayer;
		for(let i=0;i<cameraLayer.length;i++){
			cameraLayer[i].parentSprite=this;
		}
		cameraLayer.parentSprite=this;
		//this.scripts.add(cameraLayer);
		//this.scripts.mainDraw.setLayer().attach();
		this.attach();
	},
	...{
		coords:Math.vec2(100,100),
		size:10,
		mouseSize:3,
	},
	get mouseCoords(){return this.coords.add(Inputs.mouse.vec2).sub(Draw.center);},
	...{//"private vars"
		acceleration:Math.vec2(0,0),
		movementValues:{
			moveInputs:Inputs.getKey("KeysBoth"),
			maxSpeed:400,
			slowSpeed:1/0.25,
			accelerationSpeed:1/0.12,
			velocity:Math.vec2(0,0),
		},
		isCarrying:null,
		carryButton:Inputs.getKey("Space"),
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
				for(let obj of this.entity.chunk){
					if(obj==this)continue;
					let dist=Math.len2(this.coords,obj.coords);
					let sizeSum=this.size+obj.size,dist1=dist-sizeSum;
					if(obj.hasTrigger){
						if(dist1<-1&&obj.onTriggerEnter&&obj.triggerState){
							obj.onTriggerEnter(this);//for
						}else if(dist1>1&&obj.onTriggerLeave&&!obj.triggerState){
							obj.onTriggerLeave(this);
						}
					}else if(obj.canBePickedUpByPlayer&&this.carryButton.down&&(!this.isCarrying)){
						//dist=Math.len2(this.mouseCoords,obj.coords);
						//let sizeSum=obj.size+this.mouseSize;
						if(dist-sizeSum<0){
							this.isCarrying=obj;
							obj.carriedBy=this;
							obj.onCarryStart?.();
						}
					}
				}
				if(!this.carryButton.down&&this.isCarrying){
					this.isCarrying.carriedBy=null;
					this.isCarrying=null;
				}else if(this.isCarrying){
					this.isCarrying.coords.set(this.coords);
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
		drawMouse:{attach:true,layer:l=>l.draw[8][10],script(layer,script){
			ctx.save();ctx.translate(...this.mouseCoords);{
				let col="#FFFFFF88"
				Draw.line(5,0,-5,0,1.5,col);
				Draw.line(0,-5,0,5,1.5,col);//Draw.Text({text:this.mouseCoords.map(v=>v.toFixed(2))})();
			}ctx.restore();
		}},
		mainDraw:{//player
			attach:true,
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
		canBePickedUpByPlayer:true,carriedBy:null,
	},...{
		envioment:rockClass.envioment,
		isAlive:true,
	},
	scripts:{
		collider1:{attach:true,layer:l=>l.update[8],*script(l,s){
			while(true){
				let chunk=this.entity.chunk;
				for(let i=0;i<chunk.length;i++){
					let obj=chunk[i];
					let dif=Math.dif2(obj.coords,this.coords);
					let d=Math.len2(dif);
					let sizeSum=this.size+(obj.size??10);
					if(d<sizeSum&&d>0){
						dif=Math.scaleVec2(dif,(d-sizeSum)/d/2);
						this.coords=Math.vec2(Math.addVec2(this.coords,dif));
						obj.coords=Math.vec2(Math.dif2(obj.coords,dif));
					}
				}
				this.entity.update();
				yield;
			}
		}},
		moveMent1:{attach:true,layer:l=>l.update[8],*script(l,s){
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
					this.scripts.add(this.scripts.searchingScript1.attach());
					//let randSum=0.5;
					let enviomentBackup={
						getRandomCoordinates:()=>{return Math.addVec2(this.coords,Math.scaleVec2(Math.rotate([1,0],Math.random()*Math.TAU,0,1),Math.random()*this.size*3));}
					};
					let envioment=this.envioment;
					searchForGoodSpaceToMoveTo:while(true){
						if(!this.envioment)envioment=enviomentBackup;
						for(let i=0;i<1;i++){
							targetCoords=envioment.getRandomCoordinates();
							if(Math.len2(this.coords,targetCoords)>this.size*3){
								yield;continue;
							}
							//if((randSum-=(Math.random()*MainGame.time.delta*2))>0)continue
							break searchForGoodSpaceToMoveTo;
						}
						yield;
					}
					this.scripts.delete(this.scripts.searchingScript1.detach());
					this.scripts.mainDraw.text="moving";
					let moveTime=Math.random()*4+1;
					let moveVec=Math.scaleVec2(Math.dif2(targetCoords,this.coords),1/moveTime);

					while((moveTime-=MainGame.time.delta)>=0){
						this.scripts.mainDraw.text="moving:"+moveTime.toFixed(3);
						this.coords.set(this.coords.add(Math.scaleVec2(moveVec,MainGame.time.delta)));
						yield;
					}this.scripts.mainDraw.text="stoped moving";
					//this.coords.set(targetCoords);
					yield;
				}
			}
		}},
		borderCheckWhileInside:{attach:true,layer:l=>l.update[8],script(l,s){
			if(Math.len2(this.coords,this.envioment.coords)>this.envioment.innerSize+4*this.size+1){
				this.envioment.sprites.delete(this);
				MainGame.layers.chunk[0].add(this);
				this.scripts.delete(s.detach());
				this.scripts.add(this.scripts.borderCheckWhileOutside.attach());
				this.envioment=false;
				return true;
			}
		}},
		borderCheckWhileOutside:{attach:true,layer:l=>l.update[8],script(l,s){

		}},
		searchingScript1:{attach:false,layer:l=>l.update[8],*script(l,s){
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
			script(layer,script){
				const player=layer.parentSprite;
				const c=player.coords,c1=this.coords,cBox=Draw.center;
				if(//if outside view box : dont draw
					(Math.abs(c[0]-c1[0])>cBox[0]*2+this.size*3)||
					(Math.abs(c[1]-c1[1])>cBox[1]*2+this.size*3)
				){
					return false;
				}
				//if(Math.random()>0.5){this.scripts.delete(script);return true;}
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
let RPSenviomentTrigger = new Space.Sprite({
	OnStart(){
		for(let i of this.sprites){
			i.parentSprite=this;
		}
		this.attach();
		rockClass.envioment=this;
		for(let i=0;i<40;i++){
			let obj=rockClass(this.getRandomCoordinates(),this);
			this.sprites.add(obj);
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
					this.attach();
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
						return true;
					}},
					update:{attach:true,layer:l=>l.update[8],*script(layer,script){
						let killEnviomentTimer=new MainGame.UpdateScript(l=>l.update[4],function*(l,s){
							let t=0;
							while(t+=MainGame.time.delta<1){yield;};
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
							while(this.cyclePhase>=0&&this.cyclePhase<1){

							}
						}
					}},
					draw:{attach:true,layer:l=>l.draw[8][10],script(){
							ctx.save();
							ctx.translate(...this.coords);
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
			attach:true,
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
let baseEnvioment=new Space.Sprite({
	OnStart(){
		this.ownChunk={
			rock:11,metal:0,
			paper:10,wood:0,
			scissor:10,
		};
		this.attach();
	},
	scripts:{
		update1:{attach:true,layer:l=>l.update[8],script(layer,script){
			let randTime=(p,t=1)=>Math.random()>1-(1-p)**(MainGame.time.delta*t);
			let chunk=this.ownChunk;
			let carry=0;
			if(chunk.rock>15){
				if(randTime(1-(1-0.01)**chunk.rock,0.2)){
					carry=Math.min(chunk.rock,((Math.random()**2)*3)|0);
					chunk.rock-=carry;
					chunk.paper+=carry;
				}
			}else if(chunk.rock>15){
				if(randTime(1-(1-0.01)**chunk.rock,0.2)){
					carry=((Math.random()**2)*3)|0;
					chunk.rock-=carry;
					chunk.paper+=carry;
				}
			}
		}},
	},
});
}
