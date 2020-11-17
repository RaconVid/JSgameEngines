((parent)=>{
	class Pos extends Position{
		constructor(pos){
			super(pos);
			let len=this.coords.length;
			this.velocity=new Array(len,0);
			this.acceleration=new Array(len,0);
		}
	};
	class Creature extends Sprite{
		constructor({pos=new Pos({}),type="",radius=10,coords,velocity}){
			super({start:true,update:0,draw:0});
			this.pos=pos;
			if(coords!=undefined){
				this.pos.coords=coords;
			}
			if(velocity!=undefined){
				this.pos.velocity=velocity;
			}
			this.type=type;
			this.health=100;
			this.radius=radius;
			this.SpriteList=[];
			this.GetSpriteList=function(){
				const s=this.parent.sprites;
				this.SpriteList=[];
				for (let i = 0; i < s.length; i++) {
					this.SpriteList.push(s[i])
				}
				return this.SpriteList;
			}
			this.creatureUpdate=function(){};
			this.Update=function(){
				this.GetSpriteList();
				this.updateVectors();
				this.processWalls();
				this.creatureUpdate();
			};
			this.updateVectors=function(){
				let dt=this.time.delta;
				this.pos.velocity=Math.scaleVec2(this.pos.velocity,1/Math.pow(100,dt))
				this.pos.coords=Math.addVec2(this.pos.coords,Math.scaleVec2(this.pos.velocity,dt));
				this.pos.coords=[
					(this.pos.coords[0]+Draw.width)%Draw.width,
					(this.pos.coords[1]+Draw.height)%Draw.height
				];
			};
			this.processWalls=function(){
				let len,sprite;
				let c=Math.addVec2(this.pos.coords,Math.scaleVec2(this.pos.velocity,this.time.delta));
				let objs={};
				for (let i in this.parent.sprites) {
					sprite=this.parent.sprites[i];
					if(sprite.isDeleted)continue;
					if(sprite instanceof Creature&&sprite!=this){
						if(sprite.type in objs){
							objs[sprite.type].push(sprite);
						}
						else{
							//objs[sprite.type]=[sprite];
						}
						let dif=Math.minusVec2(c,Math.addVec2(sprite.pos.coords,Math.scaleVec2(sprite.pos.velocity,this.time.delta)));
						len=Math.len2(dif);
						if(len<this.radius+sprite.radius){
							let avgVel=Math.scaleVec2(Math.addVec2(this.pos.velocity,sprite.pos.velocity),0.5);
							let ang=Math.getAngle(dif,0,1);

							let vel2=Math.rotate(Math.minusVec2(this.pos.velocity,avgVel),-ang,0,1);
							vel2[0]=Math.abs(vel2[0]);
							vel2=Math.rotate(vel2,ang,0,1);
							this.pos.velocity=Math.addVec2(vel2,avgVel);

							vel2=Math.rotate(Math.minusVec2(sprite.pos.velocity,avgVel),-ang,0,1);
							vel2[0]=-Math.abs(vel2[0]);
							vel2=Math.rotate(vel2,ang,0,1);
							sprite.pos.velocity=Math.addVec2(vel2,avgVel);
						}
					}
				}
			};
		}
		get velocity(){return this.pos.velocity;}
		set velocity(val){this.pos.velocity=val;}
		get coords(){return this.pos.coords;}
		set coords(val){this.pos.coords=val;}
	}
	class BasicChemical extends Creature{
		constructor(creature){
			super(creature);
			this.colours={starter:"blue",s2:"red",light1:"yellow",decay_1:"#55FF55",decay_2:"green"};
			this.DrawSprite=function(){
				this.moveCanvasToSprite();
				Draw.circle(0,0,this.radius,this.colours[this.state]);
				this.unmoveCanvasToSprite();
			};
			this.Start=function(){
			};
			this.creatureUpdate=function(){
				let closeObjs={};
				let objs=this.SpriteList;
				let dt=this.time.delta;
				for (let i = 0; i < objs.length; i++) {
					if(objs[i]==undefined||objs[i].isDeleted){
						objs.splice(i,1);i--;
						continue;
					}
					if(!(objs[i] instanceof BasicChemical)||objs[i]==this){
						continue;
					}
					let len=Math.len2(objs[i].pos.coords,this.pos.coords)-this.radius-objs[i].radius;
					if(len<5){
						if(!(objs[i].state in closeObjs)){
							closeObjs[objs[i].state]={num:1,list:[objs[i]]};
						}
						else{
							let a=closeObjs[objs[i].state];
							a.num++;
							a.list.push(objs[i]);
						}
					}
					if(len<20&&objs[i].state=="s2"&&this.state=="s2"){
						if(!(objs[i].state in closeObjs)){
							closeObjs[objs[i].state]={num:1,list:[objs[i]]};
						}
						else{
							let a=closeObjs[objs[i].state];
							a.num++;
							a.list.push(objs[i]);
						}
					}
				}
				switch(this.state){
					case "starter":
						if("starter"in closeObjs){
							if("light1"in closeObjs){
								break;
							}
							if(closeObjs.starter.num==1){
								closeObjs.starter.list[0].End();
								this.state="s2";
							}
						}
					break;
					case "s2":
						if("starter"in closeObjs){
							if(closeObjs.starter.num>=1&&!("light1"in closeObjs)){
								let a=[
									new BasicChemical({pos:Clone(this.pos)}),
									new BasicChemical({pos:Clone(this.pos)}),
								];
								a[0].coords=Math.addVec2(this.coords,[Math.random()*10,10*Math.random()]);
								a[1].coords=Math.addVec2(this.coords,[Math.random()*10,10*Math.random()]);
								a[0].state="decay_1";
								a[1].state="decay_1";

								closeObjs.starter.list[0].state="light1";
								this.End();
							}
						}
						if("s2"in closeObjs){
							for (let i = 0; i < closeObjs.s2.list.length; i++) {
								let p1=closeObjs.s2.list[i].pos;
								let dif=Math.addVec2(Math.scaleVec2(Math.minusVec2(this.pos.velocity,p1.velocity),0.5),Math.dif2(this.pos.coords,p1.coords));
								this.pos.velocity=Math.lerp2(this.pos.velocity,dif,-0.5*Math.clamp(0,1,dt*4));
								p1.velocity=Math.lerp2(p1.velocity,dif,0.5*Math.clamp(0,1,dt*4));
							}
						}
					break;
					case"light1":
						if("light1"in closeObjs){
							if(closeObjs.light1.num>=1){
								closeObjs.light1.list[0].state="decay_1";
								this.state="decay_1";
							}
						}
					break;
					case"decay_1":
						if(!("starter"in closeObjs||"decay_2"in closeObjs||"decay_1"in closeObjs)){
							this.timers=[2,0,0];
							this.state="decay_2";
						}
					break;
					case"decay_2":
						if(("starter"in closeObjs||"decay_2"in closeObjs||"decay_1"in closeObjs)){
							this.state="decay_1";
							break;
						}
						this.timers[0]-=dt;
						if(this.timers[0]<=0){
							this.state="starter";
							delete this.timers;
						}
					break;
				}
			};
			this.state=creature.state;
			this.Start();
		}
	}
	class Pig extends Creature{
		constructor(creature){
			super(creature);
			this.phases={
				move:()=>{
					let dt=this.time.delta;
					let mass=10;
					let newV=[0,0];
					switch(this.currentPhase.name){
						case "move1":
							if(this.timers[0]>0){
								newV=Math.minusVec2(Math.lerpT2(this.pos.coords,this.moveTo,0.99999,Math.clamp(0,1,dt*8)),this.pos.coords);
								this.timers[0]-=dt;
								if(this.timers[0]<=0){
									this.timers[0]=0;
								}
							}
						break;
						default:
							//this.pos.velocity=[0,0];
					}
					this.pos.velocity=Math.lerp2(this.pos.velocity,newV,Math.clamp(0,1,dt*mass));
				},
				think:()=>{
					let dt=this.time.delta;
					switch(this.currentPhase.name){
						case "move1":
							if(this.timers[0]<=0){
								this.timers[1]=(Math.random()*0.4+0.2);
								this.currentPhase.name="move1_waiting";
							}
						break;
						case "move1_waiting":
							this.timers[1]-=dt*10*(Math.random()-0.04);
							if(this.timers[1]<=0){
								this.timers[1]=0;
								this.timers[0]=2;
								this.moveTo=Math.addVec2([
									(Math.random()*2-1)*40,
									(Math.random()*2-1)*40
								],this.pos.coords);
								this.currentPhase.name="move1";
							}
						break;
						default:
					}
				},
				react:()=>{},
				other:()=>{},
			};
			this.creatureUpdate=function(){
				this.phases.move();
				this.phases.think();
				this.phases.react();
				this.phases.other();
			};
			this.currentPhase={
				name:"move1",
			};
			this.DrawSprite=function(){
				this.moveCanvasToSprite();
				Draw.circle(0,0,this.radius,"#B85858");
				//ctx.font="arail"
				ctx.fillStyle="white";
				ctx.fillText("pig",-5,0);
				ctx.fillText(this.health,-5,10);
				this.unmoveCanvasToSprite();
			};
			this.Update=function(){
				this.GetSpriteList();
				this.creatureUpdate();
				this.processWalls();
				this.updateVectors();
			}
			this.timers=[0,0,0];
			this.moveTo=[0,0];
			this.moving=false;
			this.health=100;
			//this.Start();
		}
	}
 	class TuringMachine{
 		constructor({allRules={start:function(){}},time=parent.time,currentRules=[],timers=[0],vals=[0]}){
 			this.allRules=rules;
 			this.currentRules=currentRules;
 			this.currentStates={};//names of rules
 			this.timers=[0];
 			this.vals=[0];
 			this.Time=time;
 		}
 		addRule(name){
 			if(!(name in this.currentStates)){
 				this.currentStates[name]=true;
 				return true;
 			}
 			else{
 				return false;
 			}
 		}
 		deleteRule(name){
 			if(name in this.currentStates){
 				delete this.currentStates[name];
 				return true;
 			}
 			else{
 				return false;
 			}
 		}
 		Update(){
 			let oldRules=[],i=0;
 			const len=this.currentRules.length;
 			for(i=0;i<len;i++){
 				oldRules.push(this.currentRules);
 			}
 			for(i=0;i<len;i++){
 				oldRules[i]();
 			}
 		}
 	}
 	for (var i = 0; i < 10; i++) {
		new BasicChemical({state:"starter",coords:[0.2*Math.random()*Draw.width,0.2*Math.random()*Draw.height],velocity:Math.scaleVec2(Math.rotate([0,0],Math.random()*Math.PI*4,0,1),30)})
		///new Pig({radius:10+0*Math.round(Math.random()*0.7),coords:[Math.random()*Draw.width,Math.random()*Draw.height],velocity:Math.scaleVec2(Math.rotate([0,0],Math.random()*Math.PI*4,0,1),30)})
	}
})()