const showChunksDebug_UI=true;//DEBUG_UI
class World{
	constructor(){
		this.chunkSize=400;//diamiter
		let mapScale=20;
		let mapSize=[mapScale,mapScale];
		let mapChunks=[];
		this.chunk1=new Space.Chunk();
		for(let y=0;y<mapSize[1];y++){
			mapChunks[y]=[];
			for(let x=0;x<mapSize[0];x++){
				mapChunks[y][x]=this.makeChunk();
				mapChunks[y][x].coords=x+","+y;
			}
		}
		mapChunks[0][0]=this.makeChunk(this.chunk1);
		let neighbours=[[0,0],[0,1],[1,0],[1,1]]
		for(let y=0;y<mapSize[1];y++){
			for(let x=0;x<mapSize[0];x++){
				mapChunks[y][x].coords=[x,y];//chunk.coords only used for debugging
				for(let i=0;i<neighbours.length;i++){
					let joinCoords=[
						(x+(neighbours[i][0]==0)*(neighbours[i][1]*2-1)+mapSize[0])%mapSize[0],
						(y+(neighbours[i][0]==1)*(neighbours[i][1]*2-1)+mapSize[1])%mapSize[1],
					];
					mapChunks[y][x].setSide(neighbours[i].join(""),mapChunks[joinCoords[1]][joinCoords[0]]);
				}
			}
		}
		for(let y=0;y<mapSize[1];y++){
			for(let x=0;x<mapSize[0];x++){
				mapChunks[y][x].camera.getView();
			}
		}
		let newObj={
			gridChunks:mapChunks,
		};
		this.worldChunks1=newObj;
	}
	makeChunk(newChunk=new Space.Chunk()){//adjacentLayers
		newChunk.size=this.chunkSize;
		const world=this;
		let makeSide=function(){
			this.portal;
			this.chunk;
			//this.vec;
			//this.mat;
			this.isActive=false;
		}
		newChunk.camera=new this.Camera();
		newChunk.camera.mainChunk=newChunk;
		newChunk.sides={
			"00":new makeSide(),//(-x)left
			"01":new makeSide(),//(+x)right
			"10":new makeSide(),//(-y)up
			"11":new makeSide(),//(+y)down (+z)="21" (-z)="20"
		}
		newChunk.setSide=function(side,chunk=makeChunk()){
			const size=this.size;
			const size1=this.size*1.2;
			let newPortal=null;
			let opposite="";//opposite side
			switch(side){
				case"00":opposite="01";
				newPortal=world.makePortal(
					[-size/2,-size1/2],[0, size1],this,
					[ size/2,-size1/2],[0, size1],chunk,
				);
				break;
				case"01":opposite="00";
				newPortal=world.makePortal(
					[ size/2, size1/2],[0,-size1],this,
					[-size/2, size1/2],[0,-size1],chunk,
				);
				break;
				case"10":opposite="11";
				newPortal=world.makePortal(
					[ size1/2,-size/2],[-size1,0],this,
					[ size1/2, size/2],[-size1,0],chunk,
				);
				break;
				case"11":opposite="10";
				newPortal=world.makePortal(
					[-size1/2, size/2],[ size1,0],this,
					[-size1/2,-size/2],[ size1,0],chunk,
				);
				break;
			}
			let isOldPortalGone=false;
			let setter1=function(side,chunk){
				if(side.isActive&&(!isOldPortalGone)){
					side.portal.destructor();
					isOldPortalGone=true;
					side.isActive=false;
				}
				side.portal=newPortal;
				side.isActive=true;
				side.chunk=chunk;
			}
			setter1(this.sides[side],chunk);
			setter1(chunk.sides[opposite],this);
		}
		if(DEBUG_UI)if(showChunksDebug_UI)if(1){
			//debugger;loga()
			Space.addDrawUpdates.call((new Space.Entity(newChunk)),[
				[new mainGame.UpdateScript(undefined,function(layer,id){
					ctx.fillStyle="#002020";
					ctx.fillRect(-newChunk.size/2,-newChunk.size/2,newChunk.size,newChunk.size);
				}),(draw)=>draw.list[0]],
				[new mainGame.UpdateScript(undefined,function(layer,id){
					ctx.textAlign="center";
					ctx.fillStyle="#8585CC";
					ctx.fillText(newChunk.coords,0,0);
				}),(draw)=>draw.list[3]],
			]);
		}
		Object.defineProperties(newChunk,{
			viewSearch:{get(){return this.camera.viewSearch.bind(this.camera)}},
			chunks:{get(){return this.camera.chunks}},
		})
		return newChunk;
	}
	makePortalType={
		shape:"wall",
		portal:{
			basic_v1:true,
			oneFace:true,
		},
		wall:{
			basic_v1:true,
			vector:true,
		},
	};
	makePortal(c1,v1,l1,c2,v2,l2){
		let newObj={
			entityRefs:[],
			portalA:null,
			portalB:null,
			type:this.makePortalType,
			destructor:function(){
				this.entityRefs[0].detach();
				this.entityRefs[1].detach();
				this.entityRefs[2].detach();
				this.entityRefs[3].detach();
			},
		};
		let portals=[null,null];
		let itters=[
			this.makePortalSide(c1,v1,l1,c2,v2,l2,0,newObj,portals),
			this.makePortalSide(c2,v2,l2,c1,v1,l1,1,newObj,portals),
		];
		for(let i=0;i<10;i++){
			let done=true;
			for(let i=0;i<itters.length;i++){
				let state=itters[i].next();
				portals[i]=state.value;
				done&=state.done;
			}
			if(done)break;
		}
		newObj.portalA=portals[0];
		newObj.portalB=portals[1];
		return newObj;
	}
	*makePortalSide(c1,v1,l1,c2,v2,l2,side,newObj,portalSides){
		const portalFilter=new Space.Camera().portalFilter;
		//----
			const cameraA=new Space.Camera().addDraw();
			cameraA.type.portal={camera_v1:true,};
			cameraA.pos.layer=l2;
			cameraA.pos.vec=Math.minusVec2(c1,c2);
			const portalA={
				type:newObj.type,
				side:side,
				vec1:c1,
				vec2:v1,
				layer:l1,
				//posB:{layer:l2,vec:[Math.minusVec2(c1,c2)],mat:[[1,0],[0,1]]}
			};
			portalA["temperyCamera"]=cameraA;
			newObj
			cameraA.parent=function(){return portalA;};
			yield portalA;
			const portalB=portalSides[1-side];
			const cameraB=portalB["temperyCamera"]=cameraA;
			portalA.portalB=function(){return portalB;};
			cameraA.portalFilter=function(relPos){
				return portalFilter(relPos)&&relPos.obj!=cameraB;
			}
			delete portalA["temperyCamera"];
		//----
		if(DEBUG_UI)if(showChunksDebug_UI)if(1){//add drawScripts
			Space.addDrawUpdates.call(cameraA,[
				[new mainGame.UpdateScriptV1_0(undefined,undefined,undefined,function(layer,id){
					Draw.line(
						portalA.vec1[0],
						portalA.vec1[1],
						portalA.vec1[0]+portalA.vec2[0],
						portalA.vec1[1]+portalA.vec2[1],
					4,["#FF8800","#0088FF88"][side]);
				}),(draw)=>draw.list[2]],
			]);
		}
		newObj.entityRefs.push(new Space.RefEntity(portalA,portalA.layer.portals));
		yield portalA;
		newObj.entityRefs.push(new Space.RefEntity(cameraA,l1));
		return portalA;
	}
	makeWall(c1,v1,l1){
		let portalA={
			type:{
				shape:"wall",
				wall:{
					basic_v1:true,
					vector:true,
				},
			},
			vec1:c1,
			vec2:v1,
			layer:l1,
			coords:c1,
			camera:cameraA,
			velocity:[0,0],
		};
	}	
};
{
	let itemSearch=Symbol("chunkSearch");
	World.prototype.Camera=class{
		chunks=[];//note: chunks[i]=relPos:{chunk,vec,mat}; (for basic_v1 portals)
		distLevels=[];
		mainChunk=null;
		*viewSearch(radius,coords){//how far to search
			let distanceLevel=Math.ceil(radius/this.mainChunk.size);
			let distLevel=this.distLevels[distanceLevel];
			let maxChunks;
			if(distLevel==undefined)maxChunks=this.chunks.length;
			else maxChunks=distLevel;
			let relChunk={},list;
			let relPos1=new Space.RelPos(this.mainChunk);
			let yielded=yield relPos1;
			if(yielded==undefined||yielded)yield* this.mainChunk.list;
			for(let l=0;l<maxChunks;l++){
				relChunk=this.chunks[l];
				list=relChunk.layer.list;
				for(let i=0;i<list.length;i++){
					const relPos=list[i];
					relPos1=new Space.RelPos(relPos,relChunk);
					yielded=yield relPos1;
					if(yielded==undefined||yielded){
						let temp=relPos.obj.type;
						if(relPos.obj.type.chunk){
							yield*this[itemSearch](radius,relPos1);
							continue;
						}
						if(temp=temp.portal)if(temp.camera_v1){
							yield*this[itemSearch](
								radius,
								new Space.RelPos(relPos1,relPos1.pos.add(relPos1.obj.pos)),
								relPos1.obj.pos.layer
							);
							continue;
						}
					}
				}
				list=relChunk.layer.portals.list;

			}
		};
		*[itemSearch](radius,relPos,chunkObj=relPos.obj,objList=[]){
			let relPos1;
			let pos=new Space.Pos(relPos.pos);
			let yielded;
			pos.vec=Clone(relPos.coords);
			for(let i of chunkObj.list){
				if(objList.includes(i))continue;
				objList.push(i);
				relPos1=new Space.RelPos(i,pos);
				yielded=yield relPos1;
				if(yielded==undefined||yielded){
					if(relPos1.obj.type.chunk)yield*this[itemSearch](radius,relPos1,objList);
				}
				objList.pop();
			}
		}
		//typeof RelChunk=class
		RelChunk({layer,vec}){this.layer=layer;this.vec=vec;return this;};
		getChunk(n,side,vec){
			return new Space.Pos({
				layer:this.chunks[n].layer.sides[side].chunk,
				vec:Math.addVec2(this.chunks[n].vec,Math.scaleVec2(vec,this.chunks[n].layer.size)),
			});
		};
		getView(refEntity){
			/*+ve y = up; #=0;
				 628
				08464
				91#20
				35379
				 715
			*/
			{//minumum radius=1
				//"10" = "y,-1" = [0,-1]
				//"00" = "x,-1" = [-1,0]
				this.chunks=[new Space.Pos({layer:this.mainChunk,vec:[0,0]})];//[this.RelChunk.call({},refEntity)];
				this.distLevels.push(this.chunks.length);
				this.chunks.push(
					this.getChunk(0,"00",[-1,0]),
					this.getChunk(0,"01",[1,0]),
					this.getChunk(0,"10",[0,-1]),
					this.getChunk(0,"11",[0,1]),
				);
				this.chunks.push(
					this.getChunk(1,"10",[0,-1]),
					this.getChunk(2,"11",[0,1]),
					this.getChunk(3,"01",[1,0]),
					this.getChunk(4,"00",[-1,0]),
				);
				this.distLevels.push(this.chunks.length);
			}
			{//minumum radius=2
				this.chunks.push(
					this.getChunk(1,"00",[-1,0]),
					this.getChunk(2,"01",[1,0]),
					this.getChunk(3,"10",[0,-1]),
					this.getChunk(4,"11",[0,1]),

					this.getChunk(5,"00",[-1,0]),
					this.getChunk(6,"01",[1,0]),
					this.getChunk(7,"10",[0,-1]),
					this.getChunk(8,"11",[0,1]),

					this.getChunk(5,"10",[0,-1]),
					this.getChunk(6,"11",[0,1]),
					this.getChunk(7,"01",[1,0]),
					this.getChunk(8,"00",[-1,0]),
				);
				this.chunks.push(//corners 2
					this.getChunk(13,"10",[0,-1]),
					this.getChunk(14,"11",[0,1]),
					this.getChunk(15,"01",[1,0]),
					this.getChunk(16,"00",[-1,0]),
				);
				this.distLevels.push(this.chunks.length);
			}
		};
	};
}