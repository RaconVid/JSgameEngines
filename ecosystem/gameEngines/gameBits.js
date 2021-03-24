Space={
	Pos:class{},
	RelPos:class{},
	Entity:class{},
};
{
	Space.Pos=class{
		vec=[0,0];//new Math.Vector2();
		mat=[[1,0],[0,1]];//new Math.Matrix2();
		obj=null;
		rel=null;//relitiveObject (useraly null) add(pos) = rel->obj;
		constructor(pos){
			Object.assign(this,pos);
		}
		get(){

		}
		set(pos=Space.Pos.prototype){
			Object.assign(this,pos);
		}
		add(pos){
			//this.vec=this.vec.add(pos.mat).add(pos.vec);
			//this.mat=this.mat.add(pos.mat);
			return new Space.Pos({
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
				let det=this.mat[0][0]*this.mat[1][1]-this.mat[0][1]*this.mat[1][0];
				return new Space.Pos({
					vec:[-this.vec[0],-this.vec[1]],
					mat:[
						[-this.mat[1][1]/det,this.mat[0][1]/det,],
						[-this.mat[1][1]/det,this.mat[0][1]/det,],
					],
					obj:null,
					rel:this.obj,
				});
			}
			else{
				let det=this.mat[0][0]*this.mat[1][1]-this.mat[0][1]*this.mat[1][0];
				return new Space.Pos({
					vec:[
						( (this.vec[0]-pos.vec[0])*pos.mat[1][1]-(this.vec[1]-pos.vec[1])*pos.mat[1][0])/det,
						(-(this.vec[0]-pos.vec[0])*pos.mat[0][1]+(this.vec[1]-pos.vec[1])*pos.mat[0][0])/det,
					],//vec:this.vec.sub(pos.vec).sub(pos.mat);
					mat:[
						[
							( this.mat[0][0]*pos.mat[1][1]-this.mat[0][1]*pos.mat[1][0])/det,
							(-this.mat[0][0]*pos.mat[0][1]+this.mat[0][1]*pos.mat[0][0])/det,
						],
						[
							( this.mat[1][0]*pos.mat[1][1]-this.mat[1][1]*pos.mat[1][0])/det,
							(-this.mat[1][0]*pos.mat[0][1]+this.mat[1][1]*pos.mat[0][0])/det,
						],
					],
					obj:this.obj,
					rel:pos.obj,
				});
			}
		}
	};
}
Space.RelPos=class extends Space.Pos{
	vec=new Math.Vector2();
	mat=[[1,0],[0,1]];
	objA=null;
	objB=null;
	constructor(){

	}
	AtoB(){
		return new Space.Pos()
	}

}