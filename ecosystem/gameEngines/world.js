var world;
//{
	class World {
		constructor(){
			this.chunk1=new Plane([]);//default chunk;
		}
		get Chunk(){return Chunk;}
		get Entity(){return Entity;}
		get Portal(){return Portal;}
		static Chunk;
		static Plane;
		static Entity;
		static Portal;
	};
	class Plane extends Array{//Set (cos Set is slow)
		get list(){return this;}
		set list(val){
			let len=val.length;
			while(len>this.length){
				this.delete(this.length-1);
			}
			for(let i=0;i<val.length;i++){
				this[i]=val[i];
			}
		}
		constructor(list=[],coords=0){//scale=diamiter
			super(list.length);
			for(let i=0;i<list.length;i++)this[i]=list[i];
			this.idKey=Symbol("idKey");//"id from chunk"
		}
		newEntity(coords){
			let newObj=new Entity();
			newObj.chunks.push(this);
			newObj.coords=[...this.coords];
			this.attach(newObj);
			return newObj;
		}
		add(obj){
			if(!(this.idKey in obj)){//||!this.list.includes(obj)){
				obj[this.idKey]=this.length;//is a private variable
				this.push(obj);
			}
			else{
				console.error({chunk:this,obj:obj});
				//throw "object already has an id for this chunk";
			}
		}
		delete(obj){//item or itemIndex
			let index;
			if(typeof obj=="number"){
				index=obj;
			}
			else if(this.idKey in obj){
				index=obj[this.idKey];
				delete obj[this.idKey];
			}
			else{
				console.error(this,obj);
				throw "object does not have an id for this chunk";
			}
			let lastItem=this.shift();
			if(index<this.length-1){
				this[index]=lastItem;
				lastItem[this.idKey]=index;
			}
		}
	};
	class Chunk{
		static chunkKey=Symbol("chunkKey");
		constructor(coords=undefined,scale=400){//scale=diamiter
			if(coords)this.debug_XY=[...coords];
			this.coords=coords.map(v=>v*scale);
			this.scale=scale;
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
		constructor(getChunk=[],getParentObj=this){
			if(typeof getChunk=="function"){
				this.chunks=getChunk();
			}
			else{
				this.chunks=getChunk;
			}
			this.getChunk=getChunk;
			this.parentObj=getParentObj;
		}
		attach(chunk=undefined){
			if(chunk){
				chunk.add(this.parentObj);
			}
			else{
				for(let i=0;i<this.chunks.length;i++){
					if(this.chunks[i].add)// if instance of Chunk
						this.chunks[i].add(this.parentObj)
					else if(this.chunks[i].push)//if instance of Array
						this.chunks[i].push(this.parentObj)
				}
			}
			return this;//for pipelineing
		}
		detach(chunk=undefined){
			if(chunk){
				chunk.delete(this.parentObj);
			}
			else{
				for(let i=0;i<this.chunks.length;i++){
					if(this.chunks[i] instanceof Array){//layer on chunk
						let index=this.chunks[i].indexOf(this);
						if(index!=-1){
							this.chunks[i].splice(index,1);
						}
					}
					else this.chunks[i].delete(this.parentObj);
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