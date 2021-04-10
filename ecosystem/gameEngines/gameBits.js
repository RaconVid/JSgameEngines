"use strict";//can disable this "use strict"
function gameBitsTester(){
	window.mainGame=new MainGame();
	let mg=mainGame;
	let entity={
		subEnt:{colour:"green"},
		colour:"red",
		pos1:new Space.Pos,
		pos2:new Space.Pos,
		onload(){
			const addScript=function(layer=l=>l.update.get(4),funcGen,entity={}){
				let layerSet=layer(mainGame.layers);
				let iter;
				let entsymbol=Symbol([layer,funcGen.name]);
				let deleter=function(){
					//iter.return();
					delete entity[entsymbol];
					return layerSet.delete(iter);
				};
				iter=funcGen(deleter,layerSet,funcGen);
				layerSet.push(iter);
				entity[entsymbol]=iter;
				return deleter;
			}
			let setPos=()=>{
				const tau=Math.PI*2;
				let t=mainGame.time.start/3;
				let vec=(new Math.Vector2(Inputs.mouse.vec2)).sub([Draw.width/2,Draw.height/2]);
				vec=Math.scaleVec2(vec,1);
				this.pos1.set((new Space.Pos({obj:this.subEnt,mat:[[1,1],[0,1]],vec:[Math.cos(t*tau)*40,Math.sin(t*tau)*40]})));
				this.pos2.set(//this.pos1.sub()
					(new Space.Pos({rel:this.subEnt,obj:this,mat:[[1,0],[0,1]],vec:vec}))
					.add(this.pos1)
					//.set({rel:null,obj:this})
				);
			}
			setPos();
			this.scripts=[
				setPos
			];
			{
				let reff=new WeakRef(setPos);
				mainGame.layers.draw.add(()=>{reff.deref()()});
				entity[Symbol("draw square script")]=reff;
			}
			addScript(l=>l.draw[4],function*(thisDeleter,thisLayer,thisGenerator){
				let mainFunc=function*(){
					const tau=Math.PI*2;
					const delta=1/1000;
					function*waitTime(t){
						while((t-=mainGame.time.delta)>0)yield t;
					};
					function reset(){
						mainDir=startDir1.get();//main direction
						mainPos=startPos1.get();
						time=0;
					}
					const startDir1=new Space.Pos({vec:[-3,-4]});
					const startPos1=new Space.Pos({
						vec:[1,2],
						mat:[[1,0],[0,1]]
					});
					let mainDir;
					let mainPos;
					let time;
					reset();
					function drawPos(pos=mainPos){const scale=20;
						ctx.save();
						ctx.translate(Draw.width/2,Draw.height/2);
						ctx.save();
						ctx.translate(...Math.scaleVec2(pos.vec,scale));
						Draw.circle(1/2,0,1,"white");
						ctx.restore();

						ctx.save();
						const sv=startDir1.vec;
						const ss=startPos1.vec;
						let posB=new Space.Pos({vec:[
							ss[0]*Math.cosh(time)+sv[0]*Math.sinh(time),
							ss[1]*Math.cosh(time)+sv[1]*Math.sinh(time)
						]});
						ctx.translate(...Math.scaleVec2(posB.vec,scale));
						Draw.circle(-1/2,0,1,"red");
						ctx.restore();
						ctx.restore();
					}
					function processStep(t=time){
						let v=Math.vec2(mainPos.vec);
						mainDir.set(mainDir.add({vec:Math.scaleVec2(mainPos.vec,delta)}));
						mainPos.set(mainPos.add({vec:Math.scaleVec2(mainDir.vec,delta)}));
						time+=delta;
					};
					let deleter;
					while(true){
						reset();
						drawPos(new Space.Pos());
						for(time=0;time<2;){
							for(let i=0;i<300;i++){
								for(let i=0;i<1;i++)processStep();
								drawPos();
							}
							yield;
						}
						for(let i of waitTime(0)){
							drawPos();
							yield;
						}
					}
					return;
				};
				let itter=mainFunc();
				let done=false;
				while(!done){
					ctx.save()
					done=itter.next().done;
					ctx.restore();
					yield;
				}
				thisDeleter();
			},this)
		}
	};
	entity.onload();
	let pos,ent;
	let chunk1=new Space.Chunk();
	chunk1.add(entity.pos1);
	chunk1.add(entity.pos2);
	function drawPos(pos){
		ctx.translate(...pos.vec);
		ctx.transform(...pos.mat[0],...pos.mat[1],0,0);
	}
	let drawScripts=[
		()=>{
			ctx.save();
			ctx.translate(Draw.width/2,Draw.height/2);
			for(let [entity,pos] of chunk1.viewSearch()){
				ctx.save();
				drawPos(pos);
				Draw.square(0,0,10,entity.colour?entity.colour:"#005555");
				ctx.restore();
			}
			ctx.restore();
		}
	];
	for(let i of drawScripts){
		mainGame.layers.draw.add(i);
	}
	mainGame.start()
};
const Space={
	Pos:class{add;sub;},
	RelPos:class{},
	Chunk:class{},
	Entity:class{},
};
{//position and chunks
	//pos has: {mat,vec, rel,obj};
	//only moves rel to obj, ignors other chunks
	class Pos{
		static nullObject=new Set();
		constructor(pos={}){
			//Object.assign(this,pos);return;
			if(pos.hasOwnProperty('obj'))this.obj=pos.obj;
			if(pos.hasOwnProperty('rel'))this.rel=pos.rel;
			if(pos.hasOwnProperty('vec'))this.vec=pos.vec;
			if(pos.hasOwnProperty('mat'))this.mat=pos.mat;
		}
		get(){//clone this
			return new Pos(this);
		}
		set(pos=Pos.prototype){//assign this
			//Object.assign(this,pos);
			if(pos.hasOwnProperty('obj'))this.obj=pos.obj;
			if(pos.hasOwnProperty('rel'))this.rel=pos.rel;
			if(pos.hasOwnProperty('vec'))this.vec=pos.vec;
			if(pos.hasOwnProperty('mat'))this.mat=pos.mat;
			return this;
		}
		//addR == reversed A.add(B)->B.add(A)
		addR(pos){let ans=new Space.Pos(pos);return ans.add(this,ans);}
		subR(pos){let ans=new Space.Pos(pos);return ans.sub(this);}
		add(pos,ans=new Pos(this)){
			//this.obj=pos.obj;
			//this.vec=this.vec.add(pos.mat).add(pos.vec);
			//this.mat=this.mat.add(pos.mat);
			if(pos==undefined){
				ans.rel=undefined;
				return ans;
			}
			//if(!(pos instanceof Pos))pos=new Pos(pos);
			if(pos.obj||pos.rel){//AB + CA = BC
				if(this.rel==pos.obj||(!pos.obj||!this.rel)){
					ans.rel=pos.rel;
				}
				//else return ans;//ignore rule
			}
			if(pos.hasOwnProperty('mat')){
				if(pos.hasOwnProperty('vec')){
					ans.vec=[
						pos.vec[0]+this.vec[0]*pos.mat[0][0]+this.vec[1]*pos.mat[1][0],
						pos.vec[1]+this.vec[0]*pos.mat[0][1]+this.vec[1]*pos.mat[1][1],
					];
				}
				ans.mat=[
					[
						this.mat[0][0]*pos.mat[0][0]+this.mat[0][1]*pos.mat[1][0],
						this.mat[0][0]*pos.mat[0][1]+this.mat[0][1]*pos.mat[1][1],
					],
					[
						this.mat[1][0]*pos.mat[0][0]+this.mat[1][1]*pos.mat[1][0],
						this.mat[1][0]*pos.mat[0][1]+this.mat[1][1]*pos.mat[1][1],
					],
				];
			}
			else{
				if(pos.hasOwnProperty('vec')){
					ans.vec=[pos.vec[0]+this.vec[0],pos.vec[1]+this.vec[1]];
				}
			}
			return ans;
		}
		addFull(pos){
			if(pos.rel!=this.obj&&!(pos.rel||this.obj))
				return new Pos(this);
			return new Pos({
				vec:[
					pos.vec[0]+this.vec[0]*pos.mat[0][0]+this.vec[1]*pos.mat[1][0],
					pos.vec[1]+this.vec[0]*pos.mat[0][1]+this.vec[1]*pos.mat[1][1],
				],
				mat:[
					[
						this.mat[0][0]*pos.mat[0][0]+this.mat[0][1]*pos.mat[1][0],
						this.mat[0][0]*pos.mat[0][1]+this.mat[0][1]*pos.mat[1][1],
					],
					[
						this.mat[1][0]*pos.mat[0][0]+this.mat[1][1]*pos.mat[1][0],
						this.mat[1][0]*pos.mat[0][1]+this.mat[1][1]*pos.mat[1][1],
					],
				],
				obj:pos.obj,
				rel:this.rel,
			});
		}
		toString(){return "Pos{ obj:("+this.rel+" -> "+this.obj+") * mat:["+this.mat+"] + vec:["+this.vec+"] }"}
		sub(pos){
			if(pos==undefined){//inverse
				if(!this.hasOwnProperty('mat'))return new Pos({
					...this,
					vec:[-this.vec[0],-this.vec[1]],
					obj:this.rel,
					rel:this.obj
				});
				let det=this.mat[0][0]*this.mat[1][1]-this.mat[0][1]*this.mat[1][0];
				return new Pos({
					vec:[
						(-this.vec[0]*this.mat[1][1]+this.vec[1]*this.mat[1][0])/det,
						( this.vec[0]*this.mat[0][1]-this.vec[1]*this.mat[0][0])/det
					],
					mat:[
						[ this.mat[1][1]/det,-this.mat[0][1]/det,],
						[-this.mat[1][0]/det, this.mat[0][0]/det,],
					],
					obj:this.rel,
					rel:this.obj,
				});
			}
			else{
				if(!(pos instanceof Pos))pos=new Pos(pos);
				return this.add(pos.sub())
			}
		}
	};Space.Pos=Pos;
	//note (void 0) == undefined it just is
	Pos.prototype.vec=[0,0];//new Math.Vector2();
	Pos.prototype.mat=[[1,0],[0,1]];//new Math.Matrix2();
	Pos.prototype.rel=undefined;//relitiveObject (useraly (void 0)) add(pos) = rel->obj;
	Pos.prototype.obj=undefined;
	class RelPos extends Pos{
		//+pos = rel->obj; entity->chunk
		constructor(pos){
			super(pos);//rel and obj are Pos or RelPos
			this.pos=pos;
		}
		get(){
			return this.add(this.rel);
		}
		set(pos){
			return this.obj.set(pos.sub(this.rel));
		}
	};Space.RelPos=RelPos;
	class Chunk extends Set{//array of Space.Pos({rel:chunk,obj:entity});
		chunkSymbol=this.constructor.chunkSymbol;
		constructor(setAry){
			super(setAry);
		}
		*viewSearch(radius,camPos=new Pos({obj:null,rel:this})){
			//let pos =new Pos({obj:this});
			for(let pos of this){
				let newPos=camPos.addR(pos);
				yield [newPos.obj,newPos];
				if(this.chunkSymbol in newPos){//viewSearch entity
					yield*viewSearch(radius,newPos)
				}
			}
		}
		static chunkSymbol=Symbol("chunk");
	};Space.Chunk=Chunk;
}if(0){//HyperbolicSpace extends Space
	class PosH extends Space.Pos{
		constructor(){

		}
		static getPos(coords,velocity,hyperbolicness=1){
			let len=Math.hypot(...velocity);
			if(len==0)return coords;
			let hyp=hyperbolicness*len;
			return [
				[
					[Math.cosh(hyp)*coords[0]+Math.sinh(hyp)*velocity[0]/len],
					[Math.cosh(hyp)*coords[1]+Math.sinh(hyp)*velocity[1]/len]
				],
				[
					[Math.sinh(hyp)*coords[0]+Math.cosh(hyp)*velocity[0]/len],
					[Math.sinh(hyp)*coords[1]+Math.cosh(hyp)*velocity[1]/len]
				],
			];
		}
	}
}
gameBitsTester();