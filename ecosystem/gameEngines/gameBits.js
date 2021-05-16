//"use strict";//can disable this "use strict"
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
		//reversed arguments: a.addR(b)==b.add(a)
		//AB + CA = BC
		//OA->OB = OB.sub(OA) => A + (B-A) = B
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
		get objVec(){return new Pos({rel:this.rel,obj:this.obj});}
		get matVec(){return new Pos({mat:this.rel,vec:this.obj});}

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
				if(det==0)det=1;
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
				+(this.hasOwnProperty('mat')?" mat:["+this.mat+"] +":"")
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
}
{
	let mg=window.mainGame||MainGame;
	function Sprite(sprite={}){//UpdateModule == EntityModule
		//entity;entities;scripts,coords;
		Object.defineProperties(this,Object.getOwnPropertyDescriptors(sprite));
		Object.defineProperties(this,Object.getOwnPropertyDescriptors(this.values||{}));
		let spriteData1=this;
		this.entity=new Entity(this);
		this.entity.chunks.push(world.chunk1);
		this.entities=new mg.UpdateModule([this.entity]);
		const parsed=(objs)=>{//parseScripts
			let parsed=mg.makeScripts(objs||{},this);
			scriptsSet=new mg.UpdateModule();
			for(let i in parsed){
				if(parsed[i].isAttached){
					scriptsSet.add(parsed[i].detach());
				}
			}
			Object.assign(scriptsSet,parsed);
			return scriptsSet;
		}
		this.scripts=parsed(this.scripts);
		this.costumes=parsed(this.costumes);
		this.parts=new mg.UpdateModule([
			this.scripts,
			this.entities,
			this.costumes,
		]);
		let start=this.scripts.Start;
		this.OnStart?.();
	};
	Sprite.prototype={
		attach(){for(let i of this.parts)i.attach();return this;},
		detach(){for(let i of this.parts)i.detach();return this;},

	};
	Sprite.dataPrototype={//contains keywords
		OnStart(){

		},
		scripts:{
			
		},
		costumes:{
			
		},
	};
	Space.Sprite=Sprite;
}