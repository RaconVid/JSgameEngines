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
	Math.timesMat=function(a,b){
		let c=[];
		for(let i=0;i<coords.length;i++){
			c.push(coords[i]);
		}
		var carry = coords[axisA];
		c[axisA] = coords[axisA]*Math.cos(angle)-coords[axisB]*Math.sin(angle);
		c[axisB] = coords[axisB]*Math.cos(angle)+carry*Math.sin(angle);
		return(c);
	}
	Math.timesMat=function(a,b){
		let c=[];
		for(let i=0;i<coords.length;i++){
			c.push(coords[i]);
		}
		var carry = coords[axisA];
		c[axisA] = coords[axisA]*Math.cos(angle)-coords[axisB]*Math.sin(angle);
		c[axisB] = coords[axisB]*Math.cos(angle)+carry*Math.sin(angle);
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