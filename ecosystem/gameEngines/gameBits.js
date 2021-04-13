//"use strict";//can disable this "use strict"
function gameBitsTester(){
	with(Math){with(Space){
		let mainGame=new MainGame();
		window.mainGame=mainGame;
		//mainGame.layers.draw[3].add(()=>{ctx.fillStyle="white";ctx.fillRect(-Draw.width,-Draw.height,Draw.width*3,Draw.height*3);});
		mainGame.layers.update[4].add(()=>Object.assign(nullPoint.vec,Inputs.mouse.vec2));
		let pointEnt=class extends Space.RelPos{
			constructor(pos,rel_obj){
				super(pos);
				if(rel_obj==undefined)rel_obj={obj:this.obj};
				this.rel_obj=rel_obj;
				mainGame.layers.update[4].add(()=>{});
				mainGame.layers.draw[5].add(()=>{
					ctx.save();
					ctx.lineWidth=2;
					ctx.strokeStyle="#C0C0C0";
					ctx.beginPath();
					let relVector=new RelPos(this.rel).find({obj:this}).vec;//.sub(this).vec;
					let vector=Math.dif2(this.find({obj:this.obj}).vec,relVector);
					ctx.translate(...relVector);
					ctx.moveTo(0,0);
					ctx.translate(...vector);
					ctx.lineTo(0,0);
					if(len2(vector)!=0){
						let ang=TAU*(1/10);
						let scale=-15/(1+len2(vector));
						ctx.translate(...Math.scaleVec2(vector,-0.5-scale/2));
						ctx.moveTo(0,0);
						ctx.lineTo(
							...scaleVec2(
									rotate(vector,ang,0,1),
									scale
							)
						);
						ctx.moveTo(0,0);
						ctx.lineTo(
							...scaleVec2(
									rotate(vector,-ang,0,1),
								scale
							)
						);
					}
					ctx.stroke();
					ctx.restore();
				});
				mainGame.layers.draw[4].add(()=>{
					ctx.save();
					Draw.transform(this.find({obj:this.obj}));
					let size=6;
					Draw.square(size,-size,size,"cyan");
					ctx.font=8/3*size+"px sans-serif";
					ctx.fillStyle="#666666";
					ctx.fillText("G",0,0);
					ctx.restore();
				});
			}
		}
		let nullPoint=new pointEnt();
		nullPoint.set({vec:[Draw.width/2,Draw.height/2]});
		nullPoint.name="nullPoint";
		let points=[nullPoint]
		for(let i=0;i<0;i++){
			points.push(new pointEnt({
				rel:points[(random()*points.length)|0],
				vec:[(random()*2-1)*40,(random()*2-1)*40],
				mat:[[1,0],[0,1]],
			}));
		}
		{
			let relPosA=new pointEnt({
				rel:nullPoint,
				vec:[60,20],
				mat:[[1,1],[0,1]],
			});
			let relPosB=new pointEnt({
				rel:nullPoint,
				vec:[0,90],
				mat:[[1,0],[0,1]],
			});//OA + OB -0A
			{
				let relPosC=new pointEnt({
					rel:relPosA,
					vec:[80,0],
					mat:[[1,0],[0,1]],
				});
			}
			let pos_A_to_B=new Pos({rel:relPosA})
				.add(relPosA.sub())
				.add(relPosB)
				//.set({rel:relPosA})
			let RelPos_A_to_B=new pointEnt().set(pos_A_to_B);
		}
	}}
	mainGame.start();
};
const Space={
	Pos:class{add;sub;},
	RelPos:class{},
	Chunk:class{},
	Entity:class{},
};
{//position vectors
	//Space.Pos() Notes:
		//pos has: {mat,vec,rel,obj};
		//has: add,sub,get,set;
		//AB + CA = BC
		//objectVectors:{
			//AB + CA = BC
			//(ignored rule) only moves rel to obj, ignors other chunks
			//rel->obj : an object in the Set() "rel" that points to the Object() "obj"
		//}
	//-----
	class Pos{
		static nullObject=new Set();
		constructor(pos={}){
			//Object.assign(this,pos);return;
			if(pos.hasOwnProperty('obj'))this.obj=pos.obj;
			if(pos.hasOwnProperty('rel'))this.rel=pos.rel;
			if(pos.hasOwnProperty('vec'))this.vec=pos.vec;//new Math.Vector2(pos.vec);
			if(pos.hasOwnProperty('mat'))this.mat=pos.mat;
		}
		getR(pos=new Pos()){return pos.get(this);}
		setR(pos=new Pos()){return pos.set(this);}
		get(){//clone this
			return this;
		}
		set(pos=Pos.prototype){//assign this
			//Object.assign(this,pos);
			if(pos.hasOwnProperty('obj'))this.obj=pos.obj;
			if(pos.hasOwnProperty('rel'))this.rel=pos.rel;
			if(pos.hasOwnProperty('vec'))this.vec=pos.vec;
			if(pos.hasOwnProperty('mat'))this.mat=pos.mat;
			return this;
		}
		//addR == reversed add; A.addR(B) == B.add(A)
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
			if(pos.obj||ans.obj){//AB + BC = AC
				if(ans.obj==pos.rel||ans.obj===null||pos.rel==null){//||(!pos.obj||!this.rel)
					ans.obj=pos.obj;//ans.rel=pos.rel;
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
		toString(){
			return "Pos{ "
				+(this.hasOwnProperty('rel')||this.hasOwnProperty('obj')?"obj:("+this.rel+" -> "+this.obj+") *":"")
				+(this.hasOwnProperty('obj')?" mat:["+this.mat+"] +":"")
				+" vec:["+this.vec+"] }"
		}
	};
	//note (void 0) == undefined it just is
	Pos.prototype.vec=[0,0];//new Math.Vector2();
	Pos.prototype.mat=[[1,0],[0,1]];//new Math.Matrix2();
	Pos.prototype.rel=undefined;//relitiveObject (useraly (void 0)) add(pos) = rel->obj;
	Pos.prototype.obj=undefined;
	Space.Pos=Pos;
	class RelPos extends Pos{
		//+pos = rel->obj; entity->chunk
		constructor(pos){
			super(pos);//rel and obj are Pos or RelPos
			this.pos=pos;
		}
		find(rel_obj,ans=new Pos(this),n=0){//Pos rel_obj;
			if(n>10000)throw "RelPos error: possible infinite loop of Objects";
			if(rel_obj===undefined)rel_obj=new Pos;

			if(this.rel&&ans.rel!=rel_obj.rel&&ans.rel==this.rel){
				ans.add(this.rel).set({rel:this.rel.rel}).setR(ans);
				if(rel_obj.rel!=ans.rel){
					this.rel.find(rel_obj,ans,n+1);
				}
			}
			if(this.obj&&ans.obj!=rel_obj.obj&&ans.obj==this.obj){
				ans.addR(this.obj).set({obj:this.obj.obj}).setR(ans);
				if(rel_obj.obj!=ans.obj){
					this.obj.find(rel_obj,ans,n+1);
				}
			}
			return ans;
			//return this.rel.add(this).add(this.obj);
		}
		//set(pos){
		//	return this.obj.set(pos.sub(this.rel));
		//}
	};Space.RelPos=RelPos;
}{
	Space.Chunk=class Chunk extends Set{//array of Space.Pos({rel:chunk,obj:entity});
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
	};
	class Sprite{
		constructor(){

		}
	}Space.Sprite=Sprite;
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