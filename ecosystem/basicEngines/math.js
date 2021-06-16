"use strict";
{//Math
	Math.TAU=Math.PI*2;
	vector:{
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
	}
}
{//classes
	vec2_mat2:{
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
			get(){
				return new this.constructor(this);
			}
			//add
				static add(vecA,vecB){
					return (typeof vecB[0]=="number")
					? this.addVec2(vecA,vecB)
					: this.addMat2x2(vecA,vecB);
				};add(vec){return this.constructor.add(this,vec)};
				addR(vec){return this.constructor.add(vec,this)};
				static addVec2(vecA,vecB){
					return new this(vecA[0]+vecB[0],vecA[1]+vecB[1]);
				};addVec2(vec){return this.constructor.addVec2(this,vec)};

				static addMat2x2(vec,mat){
					return new this(vec[0]*mat[0][0]+vec[1]*mat[1][0],vec[0]*mat[0][1]+vec[1]*mat[1][1]);
				};addMat2x2(mat){return this.constructor.addMat2x2(this,mat)};
			//sub
				//(sub==subtract==minus)
				static sub(vecA,vecB){
					return (typeof vecB[0]=="number")
					? this.subVec2(vecA,vecB)
					: (()=>{throw "vec2.sub(Mat2x2) isnt supported.. yet"});
				};sub(vec){return this.constructor.sub(this,vec);};
				subR(vec){return this.constructor.sub(vec,this)};
				static subVec2(vecA,vecB){
					return new this(vecA[0]-vecB[0],vecA[1]-vecB[1]);
				};sub(vec){return this.constructor.sub(this,vec);};
				static get minus(){
					return this.sub;
				};get minus(){return this.sub;};
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
	mat:{
		let lastMatAns;//use this to store temp matricies for pipelining without using constructor
		const matClass=class Matrix extends Array{
			constructor(length,length2,argsLength=arguments.length){
				//new mat(length);
				if(argsLength==1 && typeof length =='object'){//mat([[1,0],[0,1]])
					const mat=length;
					//assume mat isn't reference
					super(mat.length);
					for(let i=0;i<mat.length;i++){
						this[i]=mat[i];
						//this[i]=new Array(mat[i].length);
						//for(let j=0;j<mat[i].length;j++){
						//	this[i][j]=mat[i][j];
						//}
					}
				}
				else if(argsLength==1&&typeof length=='number'){
					super(length);
					for(let i=0;i<this.length;i++){
						this[i]=new Array(this.length).fill(0);
						this[i][i]=1;
					}
				}
				//new mat(a,b) => a by b matrix;
				else if(argsLength==2 && typeof length=='number' && typeof length2=='number'){
					super(length);
					for(let i=0;i<this.length;i++){
						this[i]=new Array(length2).fill(0);
						if(length2-1>=i)this[i][i]=1;
					}
				}
				else{
					super(...arguments);
				}
			}
			static determinant(matA){
				if(matA.length==0)return 0;
				if(matA.length==1&&matA[0].length==1)return matA[0][0];
				return this.inverse_findDet(matA,this.inverse_findC(matA));
			}determinant(){return matClass.determinant(this);}
			static inverse_findDet(matA,minorsC){//returns number
				return minorsC[0].reduce((s,v,i)=>s+v*matA[0][i],0);
			}
			static clone(mat){
				return new this(mat);
			}clone(){return matClass.clone(this);}
			static inverse_findC(matA){//returns array
				if(matA.length==1)return matA.map(v=>v.map(v=>v));
				let minors=[];
				for(let i=0;i<matA.length;i++){
					minors[i]=[];
					for(let j=0;j<matA[i].length;j++){
						minors[i][j]=0;
						let minorMat=[];//new this(0)
						for(let y1=0;y1<matA.length;y1++){
							if(y1==i)continue;
							minorMat.push([]);
							for(let x1=0;x1<matA[y1].length;x1++){
								if(x1==j)continue;
								minorMat[minorMat.length-1].push(matA[y1][x1]);
							}
						}
						minors[i][j]=this.determinant(minorMat)*([1,-1][(i+j)%2]);
					}
				}
				return minors;
			}
			static inverse(matA){
				let ansMat=this.inverse_findC(matA);//+/- C
				let det=this.inverse_findDet(matA,ansMat);
				for(let i=0;i<matA.length;i++){//ansMat=C^T
					for(let j=i;j<matA.length;j++){
						let carry=ansMat[i][j];
						ansMat[i][j]=ansMat[j][i]/det;
						ansMat[j][i]=carry/det;
					}
				}
				return (new this(ansMat));
			}
			inverse(){return matClass.inverse(this);}
			static div(matA,matB){
				return this.mul(matA,this.inverse(matB));
			}div(mat){return matClass.div(this,mat)}
			static mul(matA,matB){
				let ans=[];
				if(typeof mat == "number"){//scalar
					for(let i=0;i<matA.length;i++){
						ans[i]=[];
						for(let j=0;j<matA[i].length;j++){
							ans[i][j]=matA[i][j]*mat;
						}
					}
				}
				else {
					for(let i=0;i<matA.length;i++){
						ans[i]=[];
						for(let j=0;j<matB[0].length;j++){
							ans[i][j]=0;
							for(let j1=0;j1<matB.length;j1++){//if matA.length==matB[i].length
								ans[i][j]+=matA[i][j1]*matB[j1][j];
							}
						}
					}
				}
				return (new this(ans))//.add(ans);
			}mul(mat){return matClass.mul(this,mat);}
			static rot(mat,angle,axisA,axisB){
				let ans=Math.Mat(mat.length);
				for(let i=0;i<mat.length;i++){
					ans[i]=Math.rotate(mat[i],angle,axisA,axisB);
				}return ans;
			}rot(angle,axisA,axisB){return matClass.rot(this,angle,axisA,axisB);}
			static roth(angle,axisA,axisB){
				let ans=Math.Mat(this.length);
				for(let i=0;i<this.length;i++){
					ans[i]=Math.rotateh(this[i],angle,axisA,axisB);
				}
			}roth(angle,axisA,axisB){return matClass.roth(this,angle,axisA,axisB);}
		};
		for(let i of ['mul','div']){
			let operation=i+"R";
			matClass.prototype[operation]=function(mat){return matClass[operation](this,mat)};
			matClass[operation]=function(matA,matB){return this[i](matB,matA)};
		}
		const matClass1_1=function Mat(){return new matClass(...arguments);}
		const matClass1=Object.defineProperties(
			function Mat(len1,len2){return new matClass(len1,len2,arguments.length);},
		Object.getOwnPropertyDescriptors(matClass))
		Math.Mat=matClass1;
	}
	let thisVal=this;
	//Gmat : Gyro-matrix (curved rotation)
	//Rmat : rotation-matrix 
	{
		Math.getAngles=function matArgs(mat){
			let matA=[];
			for(let i=0;i<mat.length;i++){
				matb[i]=[];
				for(let j=0;j<mat[i].length;j++){
					matb[i][j]=mat[i][j];
				}
			}
			let angles=[];
			for(let i=0;i<mat.length;i++){//0,1
				for(let j=i+1;j<mat.length;j++){//
					angles.push(matA);
				}
			}
		};
	}
	{
		Math.Gmat=function Gmat(vec,curve=Gmat.curve){
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
			if(this.constructor==Gmat){//is called by new;
				ans=Object.assign(this,ans);
				Object.assign(this,{
					curve:curve,
					len:Gmat.len(ans,curve),
				});
			}
			//round answer
			//ans=ans.map(v=>v.map(v=>(v*(1<<16)|0)/(1<<16)))
			return ans;
		};
		let constructor=Math.Gmat;{
			Object.assign(Math.Gmat,{
				curve:-1,
				len(matA,curve=this.curve){
					if(curve==0){
						let ans=matA[0].map(v=>v);ans.shift();
						return Math.hypot(...ans);
					}
					let dist=(curve<0?Math.acosh(matA[0][0]):Math.acos(matA[0][0]))/Math.sqrt(Math.abs(curve));
					if(isNaN(dist))dist=0;
					return dist;
				},
				prototype:{
					//len(){return constructor.len(this,this.curve);}
					...Math.Mat.prototype,
				},
				
			});
		};
		Math.aGmat=function aGmat(mat,curve=-1){
			let ans=[];
			for(let i=1;i<mat[0].length;i++)ans[i-1]=mat[0][i];
			if(curve==0){
				return ans;
			}
			let h=curve<0;//is curve hyperbolic?
			if(mat[0][0]==1)return ans;//if dist==0
			let lenScale=Math.sqrt(Math.abs(curve));
			let dist=h?Math.acosh(mat[0][0]):Math.acos(mat[0][0]);
			if(isNaN(dist))dist=0;
			dist=dist/lenScale;
			let len=Math.hypot(...ans);
			if(len==0)return ans;
			for(let i=0;i<ans.length;i++)ans[i]=ans[i]/len*dist;
			return ans;
		};
		constructor.getVec=Math.aGmat;
		Math.gyr=(a,b)=>{
			let c=b.inverse().mul(a);
			return(Math.Gmat(Math.aGmat(c).map(v=>-v))).mul(c);
		};
		Math.GyroMatrix=function(length){
			let arry=[];
			for(let i=0;i<length;i++){
				arry[i]=[];
				for(let j=i+1;j<length;j++){
					arry[i][j]=0;
				}
			}
			return ;
		};Object.assign(Math.GyroMatrix,{
			prototype:{},
		});
	}
}