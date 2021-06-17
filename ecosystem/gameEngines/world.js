var world,World;
{//TheHeydenBro's (clashofclans)
	let makingWorld=true;
	World=class World{//euclidian grid
		constructor(worldSize=10,chunkDiamiter=100){
			this.worldSize=worldSize;
			this.chunkDiamiter=chunkDiamiter;
			this.plane=new Plane([]);//default chunk;
			this.grid=[];
			let finalSelf=makingWorld?World:this;
			if(makingWorld)makingWorld=false;
			for(let y=0;y<worldSize;y++){
				this.grid[y]=[];
				for(let x=0;x<worldSize;x++){
					this.grid[y][x]=new Plane([],[x,y],finalSelf);
				}
			}
			this.chunk1=this.grid[worldSize>>1][worldSize>>1];
		};
		setSize(worldSize=this.worldSize,chunkDiamiter=this.chunkDiamiter){
			this.grid??=[];
			let finalSelf=makingWorld?World:this;
			if(makingWorld)makingWorld=false;
			for(let y=0;y<worldSize;y++){
				this.grid[y]??=[];
				for(let x=0;x<worldSize;x++){
					this.grid[y][x]??=new Plane([],[x,y],finalSelf);
				}
			}
			this.chunk1=this.grid[worldSize>>1][worldSize>>1];
		};
		static spawn(entity,world=entity.world??this){
			return world.updateChunks(world.extendIntoEntity(entity));
		};
		static makeEntity(...args){return this.Entity.makeEntity(...args)}
		static extendIntoEntity(entityRefObj,world=entityRefObj.world??this){
			entityRefObj.coords??=[0,0];
			entityRefObj.chunk??=world.getChunkFromCoords(entityRefObj.coords);
			entityRefObj.size??=0;
			entityRefObj.world??=world;
			world.updateChunks(entityRefObj);
			return entityRefObj;
		};
		static getIndexFromCoords(coords,world=this){
			let gridCoords=[
				(((coords[0]/world.chunkDiamiter-world.worldSize/2)|0)%mod+mod)%mod,
				(((coords[1]/world.chunkDiamiter-world.worldSize/2)|0)%mod+mod)%mod,
			];return gridCoords;
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
		static updateChunks(entity,refEntity=entity){
			let world=refEntity.world??entity.world;
			let chunk=world.getChunkFromCoords(refEntity.coords??entity.coords);
			let gridSize=(((refEntity.size??entity.size)/world.chunkDiamiter)|0)+1;
			if(chunk==(refEntity.chunk)){
				return entity;
			}
			let c1=chunk.coords;
			let chunks=[];
			for(let i=0;i<entity[Plane.chunkListKey];i++){
				entity[Plane.chunkListKey][i].delete(entity);
			}
			for(let i=-gridSize;i<=gridSize;i++){
				for(let j=-gridSize;j<=gridSize;j++){
					let c=Math.addVec2(chunk.coords,[i,j]);
					world.grid[Math.max(0,c[1])]?.[Math.max(0,c[0])]?.add(entity);
				}
			}
			refEntity.chunk=chunk;
			//entity[World.Entity.key_chunk]=chunk;//to send to sprite.refEntity
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
	World.constructor=World;
	class Plane extends Array{//Set (cos Set is slow)
		static chunkListKey=Symbol("chunkList");
		constructor(list=[],coords,world=World){//scale=diamiter
			super(list.length);
			this.coords=coords;
			for(let i=0;i<list.length;i++)this[i]=list[i];
			this.idKey=Symbol("["+this.coords+"]id");//"id from chunk"
			this.chunkKey=Symbol("chunkKey");
			this.world=world;
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
	class Entity{//is basicly RefEntity
		static key_chunk=Symbol(".chunk");
		//coords=[0,0];
		static makeEntity(dataObj,parentObj){
			let newObj=new this(dataObj.world??(w=>w),dataObj.obj??parentObj??dataObj,dataObj.attach??false);
			let dataObj1=Object.defineProperties({},Object.getOwnPropertyDescriptors(dataObj));
			delete dataObj1.world;
			delete dataObj1.obj;
			delete dataObj1.attach;
			Object.defineProperties(newObj,Object.getOwnPropertyDescriptors(dataObj1));
			return newObj
		}
		constructor(getWorld=w=>w,parentObj=this,autoAttach=false){
			if(parentObj==this){}//if not a reference entity
			this.world??=getWorld(World);
			this.obj??=parentObj;
			this.world.extendIntoEntity(parentObj);
			this.chunk??=this.world.chunk1;
			if(autoAttach){
				this.attach();
			}
		}
		get parentObj(){return this.obj;}
		set parentObj(val){this.obj=val;}
		get isAttached(){return this.chunk?(this.chunk.idKey in this):false;};
		set isAttached(val){
			if(val!=this.isAttached){
				if(val)this.attach();
				else this.detach();
			}
		}
		onUpdate(){
			this.update();
		}
		update(){
			this.world.updateChunks(this.obj,this);
			return this;//for pipelineing
		}
		attach(){
			this.chunk.add(this.parentObj);
			this.update();
			return this;//for pipelineing
		}
		detach(){
			this.obj[Plane.chunkListKey]??=[];
			let list=this.obj[Plane.chunkListKey];
			for(let i=0,len=list.length;i<len;i++){
				list[list.length-1].delete(this.obj);
			}
			return this;//for pipelineing
		}
		bind(newParentObj){
			this.obj=newParentObj;
			this.chunk=this.world.getChunkFromCoords(this.newParentObj.coords);
		}
	};World.Entity=Entity;
	Object.assign(World,new World());
	let desc=Object.getOwnPropertyDescriptors(World);
	Object.defineProperties(
		Object.defineProperties(
			World,
			Object.getOwnPropertyDescriptors(
				World.prototype
			)
		),desc
	);//World is also an instance of itself
}
world=World;