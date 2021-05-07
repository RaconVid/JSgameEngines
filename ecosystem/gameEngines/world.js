let world;
//{
	class World {
		constructor(){
			this.chunk1=new Chunk();
		}
		get Chunk(){return Chunk;}
		get Entity(){return Entity;}
		get Portal(){return Portal;}
		static Chunk;
		static Entity;
		static Portal;
	};
	class Chunk{
		constructor(coords=[0,0],scale=400){//scale=diamiter
			this.debug_XY=[...coords];
			this.coords=coords.map(v=>v*scale);
			//this.freeIds=[];
			//this.usedIds=[];//using lazy way
			this.list=[];//list of all objects in chunk
			this.idKey=Symbol("chunk("+coords+")_id");
		}
		newEntity(coords){
			let newObj=new Entity();
			newObj.chunks.push(this);
			newObj.coords=[...this.coords];
			this.attach(newObj);
			return newObj;
		}
		attach(obj){
			//if is unbound entity
			if(!(this.idKey in obj)){//||!this.list.includes(obj)){
				this.list.push(obj);
				obj[this.idKey]=this.list.length;
			}
			else if(obj!=this.list[obj[this.idKey]]){//if id changed
				let index=this.list.indexOf(obj);
				obj[this.idKey]=index;
			}
			else{

			}
			return obj;
		}
		detach(obj){
			if(this.idKey in obj){
				let index=-1;
				if(obj==this.list[obj[this.idKey]])
					index=obj[this.idKey];
				else
					index=this.list.indexOf(obj);
				if(index!=-1){
					this.list.splice(index,1);
				}
				delete obj[this.idKey];
			}
			return obj;
		}
	}
	class Entity{
		chunks=[];
		coords=[0,0];
		constructor(){
			this.parentObj=this;
		}
		attach(chunk=undefined){
			if(chunk){
				chunk.attach(this.parentObj);
			}
			else{
				for(let i=0;i<this.chunks.length;i++){
					this.chunks[i].attach(this.parentObj);
				}
			}
			return this;//for pipelineing
		}
		detach(chunk=undefined){
			if(chunk){
				chunk.detach(this.parentObj);
			}
			else{
				for(let i=0;i<this.chunks.length;i++){
					this.chunks[i].detach(this.parentObj);
				}
			}
			return this;//for pipelineing
		}
	}
	class Portal extends Entity{
		pos=new Space.Pos();
		constructor(pos){
			super();
			this.pos=pos||this.pos;
		}
		moveThrough(entity){
			let newPos=this.pos.add({vec:entity.coords})
			entity.coords=newPos.vec;
			entity.detach(this.pos.rel);
			entity.attach(this.pos.obj);
			return entity;
		}
	}
//}
world=new World();