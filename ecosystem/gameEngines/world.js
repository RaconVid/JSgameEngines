var world,World;
{//TheHeydenBro's (clashofclans)
	World=class World extends Function{//euclidian grid
		constructor(worldSize=2,chunkDiamiter=100){
			super();
			this.worldSize=worldSize;
			this.chunkDiamiter=chunkDiamiter;
			this.plane=new Plane([]);//default chunk;
			this.grid=[];
			for(let y=0;y<worldSize;y++){
				this.grid[y]=[];
				for(let x=0;x<worldSize;x++){
					this.grid[y][x]=new Plane([],[x,y],chunkDiamiter);
				}
			}
			this.chunk1=this.grid[worldSize>>1][worldSize>>1];
		};
		static makeEntity(entityRefObj,world=entityRefObj.world??this){
			entityRefObj.coords??=[0,0];
			entityRefObj.chunk??=world.getChunkFromCoords(entityRefObj.coords);
			//entityRefObj.sizeInChunks??=2;
			entityRefObj.world??=world;
			world.updateChunks(entityRefObj);
			return entityRefObj;
		}
		static spawn(entity,world=entity.world??this){
			return world.updateChunks(world.makeEntity(entity));
		};
		static getChunkFromCoords(coords,world=this){
			let mod=world.worldSize;
			let gridCoords=[
				(((coords[0]/world.chunkDiamiter-world.worldSize/2)|0)%mod+mod)%mod,
				(((coords[1]/world.chunkDiamiter-world.worldSize/2)|0)%mod+mod)%mod,
			];
			let chunk=world.grid[gridCoords[1]][gridCoords[0]];
			return chunk;
		};
		static updateChunks(entity,coords=entity.coords,world=entity.world??this){
			let chunk=world.getChunkFromCoords(coords);
			if(chunk==entity.chunk){
				return entity;
			}
			let c1=chunk.coords;
			let chunks=[];
			for(let i=0;i<entity[Plane.chunkListKey];i++){
				entity[Plane.chunkListKey][i].delete(entity);
			}
			for(let i=-1;i<=1;i++){
				for(let j=-1;j<=1;j++){
					let c=Math.addVec2(chunk.coords,[i,j]);
					world.grid[Math.max(0,c[1])]?.[Math.max(0,c[0])]?.add(entity);

				}
			}
			entity.chunk=chunk;
			return entity;
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
		constructor(list=[],coords){//scale=diamiter
			super(list.length);
			this.coords=coords;
			for(let i=0;i<list.length;i++)this[i]=list[i];
			this.idKey=Symbol("id");//"id from chunk"
			this.chunkKey=Symbol("chunkKey");
		}
		get list(){return this;}
		set list(val){this.setList(val)}
		setList(newList){
			let len=newList.length;
			while(len>this.length){
				this.delete(this.length-1);
			}
			for(let i=0;i<newList.length;i++){
				this[i]=newList[i];
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
			if(index<this.length&&lastItem!=obj){
				this[index]=lastItem;
				lastItem[this.idKey]=index;
			}
			const listKey=Plane.chunkListKey;
			if(listKey in obj)
			if(this.chunkKey in obj[listKey]){
				delete obj[listKey][this.chunkKey];
				let index=obj[listKey].indexOf(this);
				obj[listKey].splice(index,1);
			}
		}
	};World.Plane=Plane;
	class Entity{
		coords=[0,0];
		constructor(getWorld=w=>w,parentObj=this,autoAttach=true){
			this.world=getWorld(World);
			this.parentObj=parentObj;
			this.world.makeEntity(parentObj);
			this.chunk=this.parentObj.world.chunk1;
			if(autoAttach){
				this.attach();
			}
		}
		update(){
			this.chunk=this.parentObj.world.getChunkFromCoords(this.parentObj.coords);
			this.world.updateChunks(this.parentObj,this.parentObj.coords,this.world);
			//this.chunk=this.parentObj.chunk;			
			return this;//for pipelineing
		}
		attach(){
			this.chunk.add(this.parentObj);
			this.update();
			return this;//for pipelineing
		}
		detach(){
			this.parentObj[Plane.chunkListKey]??=[];
			let list=this.parentObj[Plane.chunkListKey];
			for(let i=0,len=list.length;i<len;i++){
				list[list.length-1].delete(this.parentObj);
			}
			return this;//for pipelineing
		}
	};World.Entity=Entity;
	Object.assign(World,new World());
	({
		makeEntity:World.prototype.makeEntity,
		spawn:World.prototype.spawn,
		getChunkFromCoords:World.prototype.getChunkFromCoords,
		updateChunks:World.prototype.updateChunks,
	});
}
world=World;