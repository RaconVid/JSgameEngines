var world;
//{
	class World {//euclidian grid
		constructor(worldSize=4,chunkDiamiter=16){
			this.worldSize=4;
			this.chunkDiamiter=16;
			this.plane=new Plane([]);//default chunk;
			this.grid=[];
			for(let y=0;y<worldSize;y++){
				this.grid[y]=[];
				for(let x=0;x<worldSize;x++){
					this.grid[y][x]=new Chunk([x,y],chunkDiamiter,[]);
				}
			}
			this.chunk1=this.grid[0][0];
		};
		updateChunks(entity){
			const c=entity.coords;
			let gridCoords=[
				(c[0]/this.chunkDiamiter|0)%this.worldSize,
				(c[1]/this.chunkDiamiter|0)%this.worldSize,
			];
			let chunk=this.grid[gridCoords[1]][gridCoords[0]];
			let chunks=[];
			for(let i=0;i<entity[Plane.chunkListKey];i++){
				entity[Plane.chunkListKey][i].delete(entity);
			}
			this.grid[gridCoords[1]][gridCoords[0]]
		};
		//get Chunk(){return Chunk;};
		//get Entity(){return Entity;};
		//get Portal(){return Portal;};
		static Chunk;
		static Plane;
		static Entity;
		//static Portal;
	};
	class Plane extends Array{//Set (cos Set is slow)
		static chunkListKey=Symbol("chunkList");
		constructor(list=[]){//scale=diamiter
			super(list.length);
			for(let i=0;i<list.length;i++)this[i]=list[i];
			this.idKey=Symbol("id");//"id from chunk"
			this.chunkKey=Symbol("chunkKey");
		}
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
		add(obj){
			if(!(this.idKey in obj)){//||!this.list.includes(obj)){
				obj[this.idKey]=this.length;//is a private variable
				this.push(obj);
			}
			else{
				//console.error({chunk:this,obj:obj});
				//throw "object already has an id for this chunk";
			}
			const key=Plane.chunkListKey;
			if(!(key in obj))obj[key]=[];
			if(!(this.chunkKey in obj[key])){
				obj[key][this.chunkKey]=this;
				obj[key].push(this);
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
			const listKey=Plane.chunkListKey;
			if(listKey in obj)
			if(this.chunkKey in obj[listKey]){
				delete obj[listKey][this.chunkKey];
				obj[listKey].splice(obj[listKey].indexOf(this),1);
			}
		}
	};
	class Chunk extends Plane{
		constructor(coords){
			super();
			this.worldCoords=coords;
		}
	};
	class Entity{
		chunks=[];
		currentChunkVal=null;
		get chunk(){return this.currentChunkVal;}
		set chunk(chunk){
			if(chunk!=this.currentChunkVal){
				this.currentChunkVal=chunk;
			}
		}
		coords=[0,0];
		constructor(getChunks=()=>World.chunk1,getParentObj=()=>this,autoAttach=true){
			if(typeof getChunks=="function"){
				this.chunks=getChunks();
			}
			else{
				this.chunks=getChunks;
			}
			this.getChunks=getChunks;
			this.parentObj=getParentObj;
			if(autoAttach){
				this.attach();
			}
		}
		update(){
			World.updateChunks(this);
		}
		attach(chunks=undefined){
			if(chunks){
				//chunk.add(this.parentObj);
				for(let i=0;i<chunks.length;i++){
					chunks[i].add(this.parentObj)
				}
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
		detach(chunks=undefined){
			if(chunks){
				//chunk.add(this.parentObj);
				for(let i=0;i<chunks.length;i++){
					chunks[i].delete(this.parentObj)
				}
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
		updateChunks(){

		}
		static updateChunks(entity){

		}
		static attach(entity){
		}
	};
	Object.assign(World,new World);
//}
world=World;