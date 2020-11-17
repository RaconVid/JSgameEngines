(function(){
	let parent=new MainGame();
	Sprite.setParent(parent);
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
			this.radius=radius;
		}
		//get velocity(){return this.pos.velocity;}
		//set velocity(val){this.pos.velocity=val;}
		//get coords(){return this.pos.coords;}
		//set coords(val){this.pos.coords=val;}
 	}
	class BasicChemical extends Creature{
		constructor(creature){
			super(creature);
			this.DrawSprite=function(){
				this.moveCanvasToSprite();
				Draw.circle(0,0,this.radius,"blue");
				this.unmoveCanvasToSprite();
			}
			this.Update=function(){
				let dt=this.time.delta;
				this.pos.velocity=Math.scaleVec2(this.pos.velocity,1/Math.pow(1.001,dt))
				this.pos.coords=Math.addVec2(this.pos.coords,Math.scaleVec2(this.pos.velocity,dt));
				this.pos.coords=[
					(this.pos.coords[0]+Draw.width)%Draw.width,
					(this.pos.coords[1]+Draw.height)%Draw.height
				];
				this.processWalls();
			}
			this.processWalls=function(){
				let len,sprite;
				let c=Math.addVec2(this.pos.coords,Math.scaleVec2(this.pos.velocity,this.time.delta));
				let objs={};
				for (let i in this.parent.sprites) {
					sprite=this.parent.sprites[i];
					if(sprite instanceof Creature&&sprite!=this){
						if(sprite.type in objs){
							objs[sprite.type].push(sprite);
						}else{

						}
						let dif=Math.minusVec2(c,Math.addVec2(sprite.pos.coords,Math.scaleVec2(sprite.pos.velocity,sprite.time.delta)));
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
				
			}
			this.Start=function(){
			}
			this.Start();
		}
	}

	new Player({start:false,run:(sprite)=>{
		sprite.pos=new Pos(sprite.pos);
		sprite.Update=function(){
			this.getInputs();
			const dt=this.time.delta;
			let speed=300;
			this.pos.velocity=Math.lerpT2(this.pos.velocity,Math.scaleVec2(this.Inputs.joystick1,speed),0.9999,dt);
			this.pos.coords=Math.addVec2(this.pos.coords,Math.scaleVec2(this.pos.velocity,dt));
			this.pos.coords=[
				(this.pos.coords[0]+Draw.width)%Draw.width,
				(this.pos.coords[1]+Draw.height)%Draw.height
			];
		};
		sprite.Start=function(){
			this.pos.coords=[Draw.width/2,Draw.height/2];
		};
		(new Creature({pos:sprite.pos,type:"player",radius:10}));

		sprite.type="player";
		sprite.name="player1"
		sprite.Start();
	}})
	for (var i = 0; i < 400; i++) {
		new BasicChemical({radius:5+5*Math.round(Math.random()*0.7),coords:[Math.random()*Draw.width,Math.random()*Draw.height],velocity:Math.scaleVec2(Math.rotate([0,1],Math.random()*Math.PI*4,0,1),30)})
	}

	parent.start()
})()