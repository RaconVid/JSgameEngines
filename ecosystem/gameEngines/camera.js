class PosMatrix extends Array{
	I(){
		super([[1,0],[0,1]],[0,0]);//rotate,translate
	}
}
let Pos=class{
	constructor(){
		this.matrix=new PosMatrix.I();
	}
}
class Camera{
	addCamera(){
		this.pos={
			matrix:new PosMatrix.I(),
			layer:null,
		};
		this.DrawLayer=null;
	}
	onUpdate(layer,layer_i){
		
	}
	drawScript2(){//draw walls and portals
		let layer=this.drawLayers[1];
		let list=layer.list;//list[i]={type:{shape:"line"},pos:[P}
		let carry=0,dist1=0,dist2=0;
		//sort by y (low to high);
		for (let i=0;i<list.length-1;i++){
			dist1=Math.len2(list[i].PosMatrix[1]);
			dist2=Math.len2(list[i+1].PosMatrix[1]);
			if(dist1>y2){
				carry=list[i];
				list[i]=list[i+1];
				list[i+1]=carry;
				i--;
			}
		}
		layer.onUpdate();
	}
	drawScript1(){//draw creatures
		let layer=this.drawLayers[1];
		let list=layer.list;//
		let carry=0,y1=0,y2=0;
		//sort by y (low to high);
		for (let i=0;i<list.length-1;i++){
			y1=list[i].PosMatrix[1][1];
			y2=list[i+1].PosMatrix[1][1];
			if(y1>y2){
				carry=list[i];
				list[i]=list[i+1];
				list[i+1]=carry;
				i--;
			}
		}
		layer.onUpdate();
	}
	drawCamera(canvasMat=new PosMatrix.I()){
		let relPos=0;
		let list=this.DrawLayer.list;
		for (let i=0;i<list.length;i++){
			list[i].onUpdate(this);
		}
	}
};
let portal={
	type:{
		shape:"line",
	},

	pos:new PosMatrix.I,//enterance
	length:10,
	camera:{
		layer:null,
		pos:new PosMatrix.I(),
		drawCamera:function(){
			Draw.undoTransform(this.camera.pos);
			this.layer.onUpdate();
			Draw.transform(this.camera.pos);
		}
	},//camera (i.e. exit)
	drawPortal:function(canvasMat){
		ctx.save();
		ctx.beginPath();//[0,0]=centre of canvas
		let points=[
			[Math.addVec2(this.pos[1][0],this.pos[0][0]),this.pos[1][1]],
			[Math.minusVec2(this.pos[1][0],this.pos[0][0]),this.pos[1][1]],
		];
		points[2]=Math.scaleVec2(points[0],1000/Math.len2(points[0]));
		points[3]=Math.scaleVec2(points[1],1000/Math.len2(points[1]));
		ctx.moveTo(points[0][0],points[0][1]);
		ctx.lineTo(points[1][0],points[1][1]);
		ctx.lineTo(points[2][0],points[2][1]);
		ctx.lineTo(points[3][0],points[3][1]);
		ctx.clip();
		Draw.transform(this.pos);
		this.camera.drawCamera();
		ctx.restore();
	}
}