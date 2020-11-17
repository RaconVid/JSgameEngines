{
	class Tile{
		constructor(){
			this.objs={};
			this.Position=class{//vector2
				constructor(parent,coords=[0,0]){//Sprite parent=null;
					this.id=0;
					this.coords=coords;
					this.parent=parent;
					this.isAttached=false;
				}
				clone(){
					let obj=new this(this.parent,this.coords);
					obj.id=
					return 
				}
				tile=this;
				findObjs(radius){
					let objs=[];
					for (let i in this.tile.objs) {

						for (let i = 0; i < .length; i++) {
							[i]
						}
					}
					return this.tile.objs;
				}
				attach(){

				}
				unattach(){
				}
			}
		}
	}
}