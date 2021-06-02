"use strict";
{//Math
	Math.TAU=Math.PI*2;
	window.Maths=Math;
	//Maths.toString=function(){return "Math but better"}
	{//getAngle
		Math.getAngle=function(coords,axisA,axisB){
			/*while(coords.length-Math.max(axisA,axisB)>0){
				coords.push(0);
			}*/
			if(coords[axisA]==0&&coords[axisB]==0){
				return(0);
			}else{
				return(Math.acos(
					coords[axisA]/Math.pow(
						Math.pow(coords[axisA],2)+Math.pow(coords[axisB],2),0.5)
					)*((coords[axisB]>0)*2-1
				));
			}
		}
	}
	{//rotate
		Math.rotate=function(coords,angle,axisA,axisB){
			let c=[];
			for(let i=0;i<coords.length;i++){
				c.push(coords[i]);
			}
			let carry = coords[axisA];
			c[axisA] = coords[axisA]*Math.cos(angle)-coords[axisB]*Math.sin(angle);
			c[axisB] = coords[axisB]*Math.cos(angle)+carry*Math.sin(angle);
			return(c);
		}
		Math.rotateh=function(coords,angle,axisA,axisB){
			let c=[];
			for(let i=0;i<coords.length;i++){
				c.push(coords[i]);
			}
			let carry = coords[axisA];
			c[axisA] = coords[axisA]*Math.cosh(angle)+coords[axisB]*Math.sinh(angle);
			c[axisB] = coords[axisB]*Math.cosh(angle)+carry*Math.sinh(angle);
			return(c);
		}
		Math.timesMat=function(a,b){//unfinished
			let ans=[];
			for (let i = 0; i < b.length; i++) {
				a[i]
			}
			return(c);
		}
	}
	{//addVec
		Math.addVec2=function(a,b){
			return [a[0]+b[0],a[1]+b[1]];
		}
		Math.addVec=function(a,b){
			const d=Math.max(a.length,b.length);
			const ans=[];
			for(let i=0;i<d;i++){
				ans[i]=a[i]+b[i];
			}
			return ans;
		}
	}
	{//scaleVec
		Math.scaleVec2=function(a,scale){
			return [a[0]*scale,a[1]*scale];
		}
		Math.scale=function(a,scale){
			let c=[];
			for (let i = 0; i < a.length; i++) {
				c[i]=a[i]*scale;
			}
			return c;
		}
	}
	{//minusVec2
		Math.minusVec=function(a,b){
			let c=[];
			for (let i = 0; i < a.length; i++) {
				c[i]=a[i]-b[i];
			}
			return c;
		}
		Math.minusVec2=function(a,b){
			return [a[0]-b[0],a[1]-b[1]];
		}
		Math.dif2=function(a,b){
			return [a[0]-b[0],a[1]-b[1]];
		}
	}
	{//len
		Math.len=function(coords){
			let dist=0;
			for (let i = 0; i < coords.length; i++) {
				dist +=Math.pow(coords[i],2);
			}
			return(Math.pow(dist,0.5));
		}
		Math.lenSwitch=function(coords){
			switch(coords.length){
				case 1:return coords;break;
				case 2:return Math.len2(coords);break;
				case 3:return Math.len3(coords);break;
				default:return Math.len(coords);break;
			}
		}
		Math.len2=function(coords,coordsB){
			let a=coords;
			if(coordsB!=undefined){
				a=Math.minusVec2(coords,coordsB);
			}
			return(Math.pow(a[0]*a[0]+a[1]*a[1],0.5));
		}
		Math.len3=function(coords){
			return(Math.pow(coords[0]*coords[0]+coords[1]*coords[1]+coords[2]*coords[2],0.5));
		}
	}
	{//lerp
		Math.lerp=function(a,b,t){
			return a+t*(b-a);
		};
		Math.lerpV=function(a,b,t){
			let c=[];
			for (let i = 0; i < a.length; i++) {
				c[i]=a[i]+t*(b[i]-a[i]);
			}
			return c;
		};
		Math.lerp2=function(a,b,t){
			return [
				a[0]+t*(b[0]-a[0]),
				a[1]+t*(b[1]-a[1])
			];
		};
	}
	{//lerpT (lerp over time)
		Math.lerpT=function(a,b,s,t1){
			return b+(a-b)*Math.pow(1-s,t1);
		};
		Math.lerpTV=function(a,b,s,t1){
			let c=[];
			let l=Math.pow(1-s,t1);
			for (let i = 0; i < a.length; i++) {
				c[i]=b[i]+(a[i]-b[i])*l;
			}
			return c;
		};
		Math.lerpT2=function(a,b,s,t1){
			return [
				b[0]+(a[0]-b[0])*Math.pow(1-s,t1),
				b[1]+(a[1]-b[1])*Math.pow(1-s,t1),
			];
		};
	}
	{//clamp
		Math.clamp=function(floor,ceil,val){
			return(Math.min(ceil,Math.max(floor,val)));
		};
		Math.clampV=function(floor,ceil,val){
			const d=floor.length;
			let ans=[];
			for(let i=0;i<d;i++){
				ans[i]=this.clamp(floor[i],ceil[i],val[i]);
			}
		};
	}
	{//matrix
		Math.transform=function(matA,matB){//A by B (matrix); boths lengths >0
			let ans=[];
			for (let i = 0; i < matA.length; i++) {
				ans[i]=[];
				for (let j = 0; j < matB[0].length; j++) {
					ans[i][j]=0;
					for (let k = 0; k < matB.length; k++) {
						if(k>=matA[i].length&&k==i){
							ans[i][j]+=matB[k][j];
						}
						else if(k<matA[i].length){
							ans[i][j]+=matA[i][k]*matB[k][j];
						}
					}
				}
				ans[1][i]=matA[i]+matB[i];
			}
			return ans;
		}
		Math.undotransform=function(matA,matB){//A by B (matrix); boths lengths >0
			return ans;
		}
		Math.timesMatrix=function(matA,matB){//A by B (matrix); boths lengths >0
			let ans=[];
			for (let i = 0; i < matA.length; i++) {
				ans[i]=[];
				for (let j = 0; j < matB[0].length; j++) {
					ans[i][j]=0;
					for (let k = 0; k < matA[0].length; k++) {
						ans[i][j]+=matA[i][k]*matB[k][j];
					}
				}
				//ans[1][i]=Amatrix_vec+Bmatrix_vec;
			}
			return ans;
		}
		//UNFINISHED
		Math.inverseMatrix=function(matA){//A by B (matrix); boths lengths >0
			if(matrixA.length==2&&matrixA[0].length==2){
				return [[matA[1][1],-matA[0][1]],[-matA[1][0],matA[0][0]]];
			}
			if(matrixA.length==3&&matrixA[0].length==2){
				return [[matA[1][1],-matA[0][1]],[-matA[1][0],matA[0][0]],[-matA[2][0],-matA[2][2]]];
			}
			else{

			}
		}
		Math.matrix_minors=function(matA){//A by B (matrix); boths lengths >0
			
		}
		Math.matrix_det=function(matA){
			let det=0;
			if(minorMat.length==1&&minorMat[0].length==1){
				minors[y][x]=minorMat[0][0];
			}
			else{

			}
			for(let x=0;x<matA[0].length;x++){
				let minorMat=[];
				for(let y1=0;y1<matA.length;y1++){
					if(y1==y)continue;
					minorMat.push([]);
					for(let x1=0;x1<matA[y1].length;x1++){
						if(x1==x)continue;
						minorMat[y1].push(matA[y1][x1]);
					}
				}
				//find det of min
				if(minorMat.length==1&&minorMat[0].length==1){
					det+=minorMat[0][0]*(x%2==0?1:-1);
				}
				else{
					Math.matrix_det()
				}
			}
		}
		Math.inverseMatrix=function(matA){
			let minors=[];
			for(let y=0;y<matA.length;y++){
				minors.push([]);
				for(let x=0;x<matA[y].length;x++){
					minors[y].push(undefined);
					let minorMat=[];
					for(let y1=0;y1<matA.length;y1++){
						if(y1==y)continue;
						minorMat.push([]);
						for(let x1=0;x1<matA[y1].length;x1++){
							if(x1==x)continue;
							minorMat[y1].push(matA[y1][x1]);
						}
					}
					//find det of min
					if(minorMat.length==1&&minorMat[0].length==1){
						minors[y][x]=minorMat[0][0];
					}
					else{

					}
				}
			}
		}
	}
}
{//classes
	Math.vec2=function(){
		return new Math.Vector2(...arguments);
	};
	Math.Vector2=class extends Array{
		constructor(x=0,y=0){
			if(x instanceof Array)super(...x);//new vec2([x,y]);
			else {
				super(0,0);
				this[0]=x;	
				this[1]=y;
			}
		}
		set(val){
			this[0]=val[0];
			this[1]=val[1];
			return this;
		}
		//add
			static add(vecA,vecB){
				return (typeof vecB[0]=="number")
				? this.addVec2(vecA,vecB)
				: this.addMat2x2(vecA,vecB);
			}add(vec){return this.constructor.add(this,vec)}
			
			static addVec2(vecA,vecB){
				return new this(vecA[0]+vecB[0],vecA[1]+vecB[1]);
			}addVec2(vec){return this.constructor.addVec2(this,vec)}

			static addMat2x2(vec,mat){
				return new this(vec[0]*mat[0][0]+vec[1]*mat[1][0],vec[0]*mat[0][1]+vec[1]*mat[1][1]);
			}addMat2x2(mat){return this.constructor.addMat2x2(this,mat)}
		//sub
			//(sub==subtract==minus)
			static sub(vecA,vecB){
				return (typeof vecB[0]=="number")
				? this.subVec2(vecA,vecB)
				: (()=>{throw "vec2.sub(Mat2x2) isnt supported.. yet"});
			}sub(vec){return this.constructor.sub(this,vec);}
			static subVec2(vecA,vecB){
				return new this(vecA[0]-vecB[0],vecA[1]-vecB[1]);
			}sub(vec){return this.constructor.sub(this,vec);}
			static get minus(){
				return this.sub;
			}get minus(){return this.sub;}
		//[0]=0;[1]=0;
	};
	Math.mat2=function(){
		return new Math.Matrix2x2(arguments);
	};
	Math.Matrix2x2=class extends Array{//new mat2x2([[xx,xy],[yx,yy]]);
		constructor(array2D=[[1,0],[0,1]]){
			super(...array2D);
			/*super([1,0,0,1]);
			if(arguments.length==4){//new mat2x2(xx,xy,yx,yy);
				super(arguments);
			}
			else if(arguments.length==2){//new mat2x2([xx,xy],[yx,yy]);
				//arguments
				this[0]=x;	
				this[1]=y;
				this[2]=x;	
				this[3]=y;
				*/
		}
	};
	{let mat=class Mat extends Array{
		constructor(length){
			//new mat(length);
			if(arguments.length==1&&typeof arguments[0]=='number'){
				super(length);
				for(let i=0;i<this.length;i++){
					this[i]=new Array(this.length).fill(0);
					this[i][i]=1;
				}
			}
			//new mat(a,b) => a by b matrix;
			else if(arguments.length==2&&typeof arguments[0]=='number'&&typeof arguments[1]=='number'){
				super(length);
				for(let i=0;i<this.length;i++){
					this[i]=new Array(arguments[1]).fill(0);
					this[i][i]=1;
				}
			}
			else{
				super(...arguments);
			}
		}
		determinant(){
			if(this.length==0)return 0;
			if(this.length==1&&this[0].length==1)return this[0][0];
			return this.inverse_findDet(this.inverse_findC());
		}
		inverse_findDet(minorsC){//returns number
			return minorsC[0].reduce((s,v,i)=>s+v*this[0][i],0);
		}
		inverse_findC(){//returns array
			if(this.length==1)return this.map(v=>v.map(v=>v));
			let minors=[];
			for(let i=0;i<this.length;i++){
				minors[i]=[];
				for(let j=0;j<this[i].length;j++){
					minors[i][j]=0;
					let minorMat=new this.constructor(0);
					for(let y1=0;y1<this.length;y1++){
						if(y1==i)continue;
						minorMat.push([]);
						for(let x1=0;x1<this[y1].length;x1++){
							if(x1==j)continue;
							minorMat[minorMat.length-1].push(this[y1][x1]);
						}
					}
					minors[i][j]=minorMat.determinant()*([1,-1][(i+j)%2]);
				}
			}
			return minors;
		}
		inverse(){
			let ansMat=this.inverse_findC();//+/- C
			let det=this.inverse_findDet(ansMat);
			for(let i=0;i<this.length;i++){//ansMat=C^T
				for(let j=i+1;j<this.length;j++){
					let carry=ansMat[i][j];
					ansMat[i][j]=ansMat[j][i]/det;
					ansMat[j][i]=carry/det;
				}
			}
			return (new this.constructor(...ansMat));
		}
		div(mat){
			return this.mul(mat instanceof Mat?mat.inverse():new Mat(...mat).inverse());
		}
		mul(mat){
			let matA=this,matB=mat,ans=[];
			if(typeof mat == "number"){//scalar
				for(let i=0;i<matA.length;i++){
					ans[i]=[];
					for(let j=0;j<matA[i].length;j++){
						ans[i][j]=matA[i][j]*mat;
					}
				}
			}
			else {
				for(let i=0;i<matB.length;i++){
					ans[i]=[];
					for(let j=0;j<matA[i].length;j++){
						ans[i][j]=0;
						for(let j1=0;j1<matA.length;j1++){
							ans[i][j]+=matB[i][j1]*matA[j1][j];
						}
					}
				}
			}
			return (new this.constructor(...ans))//.add(ans);
		}
		rot(angle,axisA,axisB){
			let ans=Math.Mat(this.length);
			for(let i=0;i<this.length;i++){
				ans[i]=Math.rotate(this[i],angle,axisA,axisB);
			}return ans;
		}
		roth(angle,axisA,axisB){
			let ans=Math.Mat(this.length);
			for(let i=0;i<this.length;i++){
				ans[i]=Math.rotateh(this[i],angle,axisA,axisB);
			}
		}
	};Math.Mat=function(){return new mat(...arguments);}}
	let thisVal=this;
	Math.Gvec=function Gvec(vec,curve=Gvec.curve){
		let len=Math.len(vec);
		let lenScale=Math.sqrt(Math.abs(curve));
		if(curve!=0)len*=lenScale;
		let ans;
		ans=new Math.Mat(vec.length+1);
		let vec1=vec;
		let rots=[];
		for(let i=0;i<vec.length-1;i++){
			let angle=Math.getAngle(vec1,0,i+1);
			for(let j=0;j<ans.length;j++){
				ans[j]=Math.rotate(ans[j],angle,i+2,1);
			}
			vec1=Math.rotate(vec1,angle,i+1,0);
			rots.unshift(angle);
		}
		for(let j=0;j<ans.length;j++){
			if(curve<0)ans[j]=Math.rotateh(ans[j],len,0,1);
			else if(curve>0)ans[j]=Math.rotate(ans[j],len,0,1);
			else ans[j][1]+=len*ans[j][0];//[[1,len],[0,1]]
		}if(curve!=0)ans[0][1]/=lenScale;
		for(let i=0;i<vec.length-1;i++){
			let angle=rots[i];
			for(let j=0;j<ans.length;j++){
				ans[j]=Math.rotate(ans[j],angle,1,i+2);
			}
			vec1=Math.rotate(vec1,angle,0,i+1);
		}
		let det=ans.determinant();
		let det1=(Math.abs(det)**(-1/ans.length))*[-1,1][+(det>0)];
		//ans=ans.mul(det1);
		if(this.constructor==Gvec){//is called by new;
			ans=Object.assign(this,ans);
			Object.assign(this,{
				curve:curve,
				len:Gvec.len(ans,curve),
			});
		}
		//round answer
		//ans=ans.map(v=>v.map(v=>(v*(1<<16)|0)/(1<<16)))
		return ans;
	};
	{let constructor=Math.Gvec;
		Object.assign(Math.Gvec,{
			curve:-1,
			len(matA,curve=this.curve){
				if(curve==0){
					let ans=matA[0].map(v=>v);ans.shift();
					return Math.hypot(...ans);
				}
				return(curve<0?Math.acosh(matA[0][0]):Math.acos(matA[0][0]))/Math.sqrt(Math.abs(curve));
			},
			prototype:{
				//len(){return constructor.len(this,this.curve);}
				...Math.Mat.prototype,
			},
			
		});
	}
	Math.aGvec=function aGvec(mat,curve=-1){
		let ans=[];
		for(let i=1;i<mat[0].length;i++)ans[i-1]=mat[0][i];
		if(curve==0){
			return ans;
		}
		let h=curve<0;//is curve hyperbolic?
		if(mat[0][0]==1)return ans;//if dist==0
		let lenScale=Math.sqrt(Math.abs(curve));
		let dist=h?Math.acosh(mat[0][0]):Math.acos(mat[0][0]);
		dist=dist/lenScale;
		let len=Math.hypot(...ans);
		for(let i=0;i<ans.length;i++)ans[i]=ans[i]/len*dist;
		return ans;
	}
}