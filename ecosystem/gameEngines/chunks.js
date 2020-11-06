{
	class circle{
		nullConstuctor(){
			this.coords=[0,0];//Vector
			this.rot=[[1,0],[0,1]];//Matrix
			this.type="circle";
		}
		isTouching(obj){
			let norm={
				coords:(()=>{
					const b=[];
					for(let i=0;i<this.coords.length;i++){
						b[i]=obj.coords[i]-this.coords[i];
					}
					return b;
				})(),
				rot:(()=>{
					const b=[[1,0],[0,1]];//I

				})(),

			};
		}
		constructor({size=20}){
			
		}
	}
	class ModelObj{};
	class linePlane extends ModelObj{
		constructor({lineWidth=0}){
			super();
			this.lineWidth=lineWidth;
			this.nodes=[
				new SpacePos(),
				new SpacePos()
			];
			this.getRaycast.hitBox=(modelObj,)=>{

			};
		}
	}
	class ObjectsArray{
		constructor(){
			this.list=[];
		}
		add(obj){//return ID;
			this.list.push(obj);
			return this.list.length-1;
		}
		opperator(){}
		delete(objID){
			this.list[objID]=this.list.pop();
		}
	};
	class SpacePos{//2D
		constructor(){
			this.coords=[[0,0],[0,0],[0,0]];//coords,velocity,acceleration
			this.rot=[[0,0],[0,0]];//matrix
			this.plane=null;//
		}
	};
	class Plane{//e.g. 2D Plane
		constructor(){
			this.sprites={
				all:new ObjectsArray(),
				generalRayCasting:null,
			};
			this.sprites.generalRayCasting=this.sprites.all;
		}
	}
}