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
	Math.timesMat=function(a,b){//unfinnished
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
	Math.lerpTV=function(a,b,t){
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
				for (let k = 0; k < matA[0].length; k++) {
					ans[i][j]+=matA[i][k]*matB[k][j];
				}
			}
		}
		return ans;
	}
	Math.undotransform=function(matA,matB){//A by B (matrix); boths lengths >0
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
		else if(matrixA.length==3&&matrixA[0].length==2){
			return [[matA[1][1],-matA[0][1]],[-matA[1][0],matA[0][0]],[]];
		}
		else return Math.Matrix_invert(matA);
	}
	// Returns the inverse of matrix `M`.
	function Matrix_invert(M){
	    // I use Guassian Elimination to calculate the inverse:
	    // (1) 'augment' the matrix (left) by the identity (on the right)
	    // (2) Turn the matrix on the left into the identity by elemetry row ops
	    // (3) The matrix on the right is the inverse (was the identity matrix)
	    // There are 3 elemtary row ops: (I combine b and c in my code)
	    // (a) Swap 2 rows
	    // (b) Multiply a row by a scalar
	    // (c) Add 2 rows
	    
	    //if the matrix isn't square: exit (error)
	    if(M.length !== M[0].length){return;}
	    
	    //create the identity matrix (I), and a copy (C) of the original
	    var i=0, ii=0, j=0, dim=M.length, e=0, t=0;
	    var I = [], C = [];
	    for(i=0; i<dim; i+=1){
	        // Create the row
	        I[I.length]=[];
	        C[C.length]=[];
	        for(j=0; j<dim; j+=1){
	            
	            //if we're on the diagonal, put a 1 (for identity)
	            if(i==j){ I[i][j] = 1; }
	            else{ I[i][j] = 0; }
	            
	            // Also, make the copy of the original
	            C[i][j] = M[i][j];
	        }
	    }
	    
	    // Perform elementary row operations
	    for(i=0; i<dim; i+=1){
	        // get the element e on the diagonal
	        e = C[i][i];
	        
	        // if we have a 0 on the diagonal (we'll need to swap with a lower row)
	        if(e==0){
	            //look through every row below the i'th row
	            for(ii=i+1; ii<dim; ii+=1){
	                //if the ii'th row has a non-0 in the i'th col
	                if(C[ii][i] != 0){
	                    //it would make the diagonal have a non-0 so swap it
	                    for(j=0; j<dim; j++){
	                        e = C[i][j];       //temp store i'th row
	                        C[i][j] = C[ii][j];//replace i'th row by ii'th
	                        C[ii][j] = e;      //repace ii'th by temp
	                        e = I[i][j];       //temp store i'th row
	                        I[i][j] = I[ii][j];//replace i'th row by ii'th
	                        I[ii][j] = e;      //repace ii'th by temp
	                    }
	                    //don't bother checking other rows since we've swapped
	                    break;
	                }
	            }
	            //get the new diagonal
	            e = C[i][i];
	            //if it's still 0, not invertable (error)
	            if(e==0){return}
	        }
	        
	        // Scale this row down by e (so we have a 1 on the diagonal)
	        for(j=0; j<dim; j++){
	            C[i][j] = C[i][j]/e; //apply to original matrix
	            I[i][j] = I[i][j]/e; //apply to identity
	        }
	        
	        // Subtract this row (scaled appropriately for each row) from ALL of
	        // the other rows so that there will be 0's in this column in the
	        // rows above and below this one
	        for(ii=0; ii<dim; ii++){
	            // Only apply to other rows (we want a 1 on the diagonal)
	            if(ii==i){continue;}
	            
	            // We want to change this element to 0
	            e = C[ii][i];
	            
	            // Subtract (the row above(or below) scaled by e) from (the
	            // current row) but start at the i'th column and assume all the
	            // stuff left of diagonal is 0 (which it should be if we made this
	            // algorithm correctly)
	            for(j=0; j<dim; j++){
	                C[ii][j] -= e*C[i][j]; //apply to original matrix
	                I[ii][j] -= e*I[i][j]; //apply to identity
	            }
	        }
	    }
	    
	    //we've done all operations, C should be the identity
	    //matrix I should be the inverse:
	    return I;
	}
	Math.Matrix_det=function(matA){
		let x=0,min;
		for (let y = 0; y < matA.length; y++) {
			min=Clone(ans);
			min.splice(y,1);
			for (let i = 0; i < matA[0].length; i++) {
				min.shift(x,1);
			}
			Math.Matrix_det(Math.min);
		}
	};
	Math.Matrix_CT=function(minors){
		let ans=[];
		for (let y = 0; y < matA.length; y++) {
			ans[y]=[];
			for (let x = 0; x < matA.length; x++) {
				ans[y][x]=minors
			}
		}
	};
	Math.Matrix_minors=function(matA){//A by B (matrix); boths lengths >0
		let ans=new Array(matA.length);
		let min=[];
		for (let y = 0; y < matA.length; y++) {
			ans[y]=[];
			for (let x = 0; x < matA.length; x++) {
				min=Clone(ans);
				min.splice(y,1);
				for (let i = 0; i < matA[0].length; i++) {
					min.splice(x,1);
				}
				ans[y][x]=Math.Matrix_det(min);
			}
		}
	}
}