(()=>{
	class Field{
		constructor(){
			class grass extends Creature{
				constructor(creature){
					super(creature);
					this.tags={};
					this.GetSpriteList=function(){
						const s=this.parent.sprites;
						this.SpriteList=[];
						for (let i = 0; i < s.length; i++) {
							this.SpriteList.push(s[i]);
						}
						return this.SpriteList;
					}
					this.creatureUpdate=function(){

					};
				}
			}
			class creeper extends Creature{
				constructor(creature){
					super(creature);
					this.tags={};
				}
			}
		}
	}
	class Pos extends Position{
		constructor(pos){
			super(pos);
			let len=this.coords.length;
			this.velocity=new Array(len,0);
			this.acceleration=new Array(len,0);
		}
	};
	class Creature extends Sprite{
		constructor({pos=new Pos({}),type="",coords,velocity}){
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
					if(sprite.isDeleted)continue;
					if(sprite instanceof Creature&&sprite!=this){
					if(sprite.type in objs){
						objs[sprite.type].push(sprite);
					}
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
		}
		get velocity(){return this.pos.velocity;}
		set velocity(val){this.pos.velocity=val;}
		get coords(){return this.pos.coords;}
		set coords(val){this.pos.coords=val;}
	}
})()