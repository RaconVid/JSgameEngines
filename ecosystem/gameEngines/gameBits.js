function gameBitsTester(){
	window.mainGame=new MainGame();
	let mg=mainGame;
	let entity={
		subEnt:{colour:"green"},
		colour:"red",
		pos1:new Space.Pos,
		pos2:new Space.Pos,
		onload(){  
			let setPos=()=>{
				const tau=Math.PI*2;
				let t=mainGame.time.start/3;
				let vec=(new Math.Vector2(Inputs.mouse.vec2)).sub([Draw.width/2,Draw.height/2]);
				vec=Math.scaleVec2(vec,1/10);
				this.pos1.set((new Space.Pos({obj:this,vec:[Math.cos(t*tau)*40,Math.sin(t*tau)*40]})));
				this.pos2.set(//this.pos1.sub()
					(new Space.Pos({obj:this.subEnt,mat:[[1,0],[0,1]],vec:vec}))
					.add(new Space.Pos({rel:this}))
					.add(this.pos1)
				);
			}
			setPos();
			this.scripts=[
				setPos
			];
			{
				let reff=new WeakRef(setPos);
				mainGame.layers.draw.set(reff,()=>reff.deref()());
			}
		}
	};
	entity.onload();
	let pos,ent;
	let chunk1=new Space.Chunk();
	chunk1.set(entity.pos1.obj,entity.pos1);
	chunk1.set(entity.pos2.obj,entity.pos2);
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
				Draw.square(0,0,10,entity.colour);
				ctx.restore();
			}
			ctx.restore();
		}
	];
	for(let i of drawScripts){
		mainGame.layers.draw.set(i,i);
	}
	mainGame.start()
};
Space={
	Pos:class{},
	RelPos:class{},
	Entity:class{},
};
{
	//pos has: {vec,mat,rel,obj};
	//only moves rel to obj, ignors other chunks
	Space.Pos=class Pos{
		static nullObject=new Set();
		constructor(pos={}){
			Object.assign(this,pos);
		}
		get(){
			return new Pos(this);
		}
		set(pos=Pos.prototype){
			Object.assign(this,pos);
			return this;
		}
		//addR == reversed A.add(B)->B.add(A)
		addR(pos){return pos.add(this);}
		subR(pos){return pos.sub(this);}
		add(pos){let ans=new Pos();
			if(pos==undefined){
				ans.set(this);
				ans.rel=undefined;
				return ans;
			}
			if(!(pos instanceof Pos))pos=new Pos(pos);
			//this.vec=this.vec.add(pos.mat).add(pos.vec);
			//this.mat=this.mat.add(pos.mat);
			if(this.rel!=pos.obj&&(pos.obj!=undefined&&this.rel!=undefined)){return new Pos(this)};
			
			if(!pos.hasOwnProperty('mat'))return new Pos({
				...this,
				vec:[pos.vec[0]+this.vec[0],pos.vec[1]+this.vec[1]],
				obj:this.obj,
				rel:pos.rel
			});
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
				obj:this.obj,
				rel:pos.rel,
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
	};
	//note (void 0) == undefined it just is
	Space.Pos.prototype.vec=[0,0];//new Math.Vector2();
	Space.Pos.prototype.mat=[[1,0],[0,1]];//new Math.Matrix2();
	Space.Pos.prototype.rel=undefined;//relitiveObject (useraly (void 0)) add(pos) = rel->obj;
	Space.Pos.prototype.obj=undefined;
}
Space.RelPos=class RelPos extends Space.Pos{
	//+pos = rel->obj; entity->chunk
	constructor(){//
		super(...arguments);
	}
	get(posRel=undefined,posObj=undefined){
		if(posRel==this){

		}
	}
};
Space.Chunk=class Chunk extends Map{//array of Space.Pos({rel:chunk,obj:entity});
	static chunkSymbol=Symbol("chunk");
	chunkSymbol=this.constructor.chunkSymbol;
	constructor(setAry){
		super(setAry);
	}
	*viewSearch(radius,camPos=new Space.Pos()){
		//let pos =new Space.Pos({obj:this});
		for(let [entity,pos] of this){
			let newPos=camPos.add().add(pos);
			yield [entity,newPos];
			if(this.chunkSymbol in entity){//viewSearch entity
				yield*viewSearch(radius,newPos)
			}
		}
	}
};
gameBitsTester();