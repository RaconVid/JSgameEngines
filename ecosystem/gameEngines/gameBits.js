class Position{
	constructor({coords=[0,0],rotation=0,size=[1,1],direction=0,tile=undefined,flipped=false}){
		this.coords=coords;
		this.direction=direction;
		this.tile=tile;
		this.rotation=rotation;
		this.flipped=flipped;
		this.size=size;//diamiter, [width,height]
	}
};
let spriteParent;
class Sprite{
	static setParent(parent){
		spriteParent=parent;
	}
	constructor({parent=spriteParent,start=false,run=()=>{},update=0,draw=0}){
		this.DrawSprite=function(){};//draws this Sprite
		this.Start=function(){};
		this.Update=function(){};
		this.End=function(){
			this.removeSprite();
		};
		this.Inputs={
			actions:{

			},
			keyCodes:{

			},
		};
		this.pos=new Position({});//coods,rotation
		this.parent=parent;//parent=maingame (normaly);
		this.coords=this.pos.coords;
		try{
			this.time=parent.time;
			this.time.real;
		}
		catch(error){
			this.time=new Time();
		}
		this.hasDrawVal=false;
		this.hasUpdateVal=false;
		this.hasUpdate=update;//layer
		this.hasDraw=draw;//layer
		this.id=this.parent.addId(this);
		run(this);
		if(start)this.Start();
	}
	//get velocity(){return this.pos.velocity;}
	//set velocity(val){this.pos.velocity=val;}
	//get coords(){return this.pos.coords;}
	//set coords(val){this.pos.coords=val;}
	moveCanvasToSprite(){
		ctx.translate(this.pos.coords[0],this.pos.coords[1]);
		ctx.rotate(this.pos.rotation);
		ctx.scale(1/this.pos.size[0],1/this.pos.size[1]);
	}
	unmoveCanvasToSprite(){
		ctx.scale(this.pos.size[0],this.pos.size[1]);
		ctx.rotate(-this.pos.rotation);
		ctx.translate(-this.pos.coords[0],-this.pos.coords[1]);
	}
	removeSprite(){
		this.hasUpdate=false;
		this.hasDraw=false;
		this.time=null;
		this.parent.deleteId(this.id);
	}
	get hasUpdate(){
		return this.hasUpdateVal!==false;
	}
	set hasUpdate(value=0){
		if(value!==this.hasUpdate){
			if(value===false){
				this.hasUpdateVal=false;
			}
			else{
				this.parent.updates.update.addSpriteToLayer(this,value);
				this.hasUpdateVal=value;
			}
		}
	}
	get hasDraw(){
		return this.hasDrawVal!==false;
	}
	set hasDraw(value=0){
		if(value!==this.hasDraw){
			if(value===false){
				this.hasDrawVal=false;
			}
			else{
				this.parent.updates.draw.addSpriteToLayer(this,value);
				this.hasDrawVal=value;
			}
		}
	}
	setupInputs(keyCodesObj){//e.g.{up:"ArrowUp",shoot:"a"}
		for(let i in keyCodesObj){
			this.Inputs.keyCodes[i]=keyCodesObj[i];
		}
		for(let i in this.Inputs.keyCodes){
			this.Inputs.actions[i]=false;
			Inputs.newKey(this.Inputs.keyCodes[i]);
		}
	}
	getInputs(){
		for(let i in this.Inputs.keyCodes){
			this.Inputs.actions[i]=Inputs.keys[this.Inputs.keyCodes[i]];
			//console.log(this.Inputs.actions[i]);alert()
		}
	}
}
class Player extends Sprite{
	constructor({parent=spriteParent,start=false,update=0,draw=0,run=()=>{}}){
		super({
			parent:parent,
			run:function(sprite){
				sprite.setupInputs({up1:"w",down1:"s",right1:"d",left1:"a"});
				sprite.setupInputs({up2:"ArrowUp",down2:"ArrowDown",right2:"ArrowRight",left2:"ArrowLeft"});
				sprite.setupInputs({up:"none",down:"none",right:"none",left:"none"});
				sprite.baceDraw=function(){
					Draw.square(0,0,10,"#0FA8C7");
				};
				sprite.DrawSprite=function(){
					this.moveCanvasToSprite();
					this.baceDraw();
					this.unmoveCanvasToSprite();
				};
				sprite.Inputs.lerpSpeed=0.999;
				sprite.Inputs.joystick=[0,0];
				sprite.Inputs.joystick1=[0,0];
				sprite.Inputs.joystick2=[0,0];
				sprite.getInputKeys=sprite.getInputs;
				delete sprite.getInputs;
				sprite.getExtraInputs=function(){}
				sprite.getInputs=function(){
					this.getInputKeys();
					this.getJoysticks();
					this.getExtraInputs();
				}
				run(sprite);
			},update:update,draw:draw,start:start
		});
	}
	getJoysticks(){
		const input=this.Inputs;
		const ac=input.actions;
		let merge=(key,key1,key2)=>{
			key.down=key1.down||key2.down;
		}
		merge(ac.up,ac.up1,ac.up2);
		merge(ac.down,ac.down1,ac.down2);
		merge(ac.right,ac.right1,ac.right2);
		merge(ac.left,ac.left1,ac.left2);
		let dt=this.parent.time.delta;
		input.joystick=[
			Math.lerpT(input.joystick[0],ac.right.down-ac.left.down,input.lerpSpeed,dt),
			Math.lerpT(input.joystick[1],ac.down.down-ac.up.down   ,input.lerpSpeed,dt),
		];
		input.joystick1=[
			Math.lerpT(input.joystick1[0],ac.right1.down-ac.left1.down,input.lerpSpeed,dt),
			Math.lerpT(input.joystick1[1],ac.down1.down-ac.up1.down   ,input.lerpSpeed,dt),
		];
		input.joystick2=[
			Math.lerpT(input.joystick2[0],ac.right2.down-ac.left2.down,input.lerpSpeed,dt),
			Math.lerpT(input.joystick2[1],ac.down2.down-ac.up2.down   ,input.lerpSpeed,dt),
		];
	};
}