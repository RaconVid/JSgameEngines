{
	var mainGame;{
		mainGame = new MainGame();
	}let mg = mainGame;
	{
		var coordsList=[];
		var middleVec=[Draw.width/2,Draw.height/2];
		let scalar=Math.atanh(Math.atan(1));//~1.06
		window.scalar=scalar;
		new mg.UpdateScript(l=>l.update[5],function*(del){
			let rotateh=function rotateh(coords,angle,axisA,axisB){
				let c=[];
				for(let i=0;i<coords.length;i++){
					c.push(coords[i]);
				}
				var carry = coords[axisA];
				c[axisA] = coords[axisA]*Math.cosh(angle)+coords[axisB]*Math.sinh(angle);
				c[axisB] = coords[axisB]*Math.cosh(angle)+carry*Math.sinh(angle);
				return(c);
			};Math.rotateh=rotateh;
			let rotate=Math.rotate;
			let I=()=>[[1,0,0],[0,1,0],[0,0,1]];//mat3
			Math.I=I;
			let posA=I();
			let posB=I();
			let list=[
				[1,1],
				[1,2],
				[-1,1],
				[-1,2],
				[1,1]
			];
			let first=true;
			while(true){
				if(scalar!=window.scalar){
					scalar=window.scalar;
				}
				else if(first){first=false;}
				else if(!Inputs.mouse.down){
					yield;continue;
				}else{
					scalar=Math.len2(Inputs.mouse.vec2,middleVec);
					scalar=scalar/100;
					window.scalar=scalar;
				}
				coordsList=[];
				posA=I();
				posB=I();
				for(let i1=0;i1<list.length;i1++){
					let a=(i)=>Math.timesMatrix(I().map(
						v=>rotate(rotateh(v,i*list[i1][0]*scalar,0,list[i1][1]),Math.PI/4*0*(i1==0),1,2)
					),posA);
					//coordsList.push(0);
					for(let i=0;i<=1;i+=1/20){
						let posB=a(i);
						let c=[
							posB[0][1]+posB[0][0]*0.5,
							posB[0][2]+posB[0][0]*0.5
						];
						coordsList.push([c,posB,0]);
					}
					posA=a(1);
				}
				yield;
			}
			del();
		});
		new mg.UpdateScript(l=>l.draw[5],function*(){
			while(true){
				if(coordsList.length>10**6){
					loga(coordsList,"MEMORY LEAK");throw"MEMORY LEAK";
				}
				Draw.circle(...middleVec,3,"#AAC0CCB0");
				ctx.save();
				ctx.translate(150,250);
				ctx.scale(100,-100);
				ctx.beginPath();
				for(let i=0;i<coordsList.length;i++){
					let c1=coordsList[i];
					if(c1==0)continue;
					if(i==0||coordsList[i-1]==0){
						ctx.moveTo(...c1[0]);
					}else{
						ctx.lineTo(...c1[0]);
					}
				}
				ctx.restore();
				ctx.lineWidth=2;
				ctx.strokeStyle="white";
				ctx.stroke();
				ctx.font="10px sans-serif";
				ctx.fillStyle="white";
				ctx.fillText("scalar:"+scalar,...middleVec);
				yield;
			}
		});
	}
	mg.start();
}
if(false){
	class Entity{
		constructor(){

		}
	};
	let player;{
		player={
			parts:[],
		};
	}
	let virus;{
		virus={
			get sleep(){},
			set sleep(val){},
			start(){

			},
			clone(){
				return this;
			},
			update(){
				let newObj=new this.clone();
				newObj.start=true;
			},
			isSleep:false,
		};

	}
}
