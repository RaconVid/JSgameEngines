{//Math
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
			var carry = coords[axisA];
			c[axisA] = coords[axisA]*Math.cos(angle)-coords[axisB]*Math.sin(angle);
			c[axisB] = coords[axisB]*Math.cos(angle)+carry*Math.sin(angle);
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
			const d=Math.min(a.length,b.length);
			let ans=[];
			for(let i=0;i<a;i++){
				ans[i]=a[i]+b[i];
			}
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
			var dist=0;
			for (var i = 0; i < coords.length; i++) {
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
				//ans[1][i]=matA[i]+matB[i];
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
						ans[i][j]+=matB[i][j];
					}
				}
				ans[1][i]=Amatrix_vec+Bmatrix_vec;
			}
			return ans;
		}
		//UNFINNISHED
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
				//ans[1][i]=matA[i]+matB[i];
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
						ans[i][j]+=matB[i][j];
					}
				}
				ans[1][i]=Amatrix_vec+Bmatrix_vec;
			}
			return ans;
		}
		//UNFINNISHED
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
				? this.addVec2(vecA,vecB)
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
}