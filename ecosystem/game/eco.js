{
	var mainGame;{
		mainGame = new MainGame();
	}let mg = mainGame;
	{
		var coordsList=[];
		var middleVec=[Draw.width/2,Draw.height/2];
		let scalar=Math.atanh(Math.atan(1));//~1.06
		window.scalar=scalar;
		var list=[
			[1,1],
			[1,2],
			[-1,1],
			[-1,2],
			[1,1]
		];
		list=[[1,1],[-1,2],[-1,1],[1,2],[1,1]];
		var posA;
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
			let rotate0=function rotate0(coords,angle,axisA,axisB){
				let c=[];
				for(let i=0;i<coords.length;i++){
					c.push(coords[i]);
				}
				var carry = coords[axisA];
				c[axisA] = coords[axisA]*(1)+coords[axisB]*(0);
				c[axisB] = coords[axisB]*(1)+carry*(angle);
				return(c);
			};Math.rotateh=rotateh;
			let rotate=Math.rotate;
			let I=()=>[[1,0,0],[0,1,0],[0,0,1]];//mat3
			Math.I=I;
			posA=I();
			let posB=I();
			let first=true;
			while(true){
				if(scalar!=window.scalar){
					scalar=window.scalar;
				}
				else if(first){first=false;}
				else if(!Inputs.mouse.down){
					if(1){yield;continue;}
				}else if(1){
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
					if(1)for(let i=0;i<=1;i+=1/20){
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
				let scale=50;
				let doScale=()=>{
					ctx.scale(scale,-scale);
				}
				ctx.save();
				ctx.translate(250,200);
				ctx.save();
				ctx.scale(scale,-scale);
				ctx.lineWidth=2/scale;
				ctx.strokeStyle="white";
				if(1){
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
					ctx.strokeStyle="white";
					ctx.stroke();
				}
				{
					ctx.scale(scale,-scale);
					ctx.lineWidth=2/scale;
					let t=((mg.time.start/4)%1)*Math.TAU*0;
					let rot=posA.map(v=>Math.rotate(Math.rotate(v,0,0,1),0+t,0,2));
					let cols=["red","green","blue"];
					Draw.circle(0,0,ctx.lineWidth*2,"grey");
					for(let i=0;i<rot.length;i++){let v=rot[i];
						//Draw.line(0,0,v[0],v[1],ctx.lineWidth,cols[i]);
						Draw.circle(v[0],v[1],ctx.lineWidth*4/(1+Math.exp(-v[2])),cols[i]);
					}
				}
				ctx.restore();
				ctx.font="10px sans-serif";
				ctx.fillStyle="white";
				ctx.fillText("scalar:"+scalar,...middleVec);
				yield;
			}
		});
	}
	mg.start();
}
if(true){
	class Event{
		constructor(name){
			let newObj=function(){
				for(let i of this.list){
					i[name]();
				};
			}
		}
	}
	class Sprite{
		scripts={};
		constructor(objData){
			let scripts=objData.scripts;
			for(let i in scripts){
				this.scripts[i]=this.makeScript(scripts[i]);
				this.bindScript(this.scripts[i]);
				if(i=='onLoad'){
					this.loadList.add(this.scripts[i]);
					this.unloadList.add(this.scripts[i]);
				}
			}
		}
		bindScript(script){
			script.scriptGetter=script.scriptGetter.bind(this);
			this.deleteList.add(script);
			//this.loadList.add(script);
			return this;
		}
		//
			loadList=new Set();
			isLoaded=false;
			onLoad(){
				for(let i of this.loadList){
					i.onLoad();
					//this.loadList.delete(i);
					//this.unloadList.add(i);
				}
				this.isLoaded=true;
				return this;
			}
		//
			unloadList=new Set();
			isUnloaded=true;
			onUnload(){
				for(let i of this.unloadList){
					i.onUnload();
					this.unloadList.delete(i);
					//this.loadList.add(i);
				}
				this.isLoaded=true;
				return this;
			}
		//
			deleteList=new Set();
			isDeleted=true;
			onDelete(){
				for(let i of this.unloadList){
					i.onDelete();
					this.deleteList.delete(i);
				}
				this.isDeleted=true;
				return this;
			}
		makeScript(scriptData){
			let script=scriptData.script.bind(this);
			let layer=scriptData.layer;
			return new mainGame.UpdateScript(script,layer,false).bindSprite(this);
		}
	};
	let menu=new Sprite({
		scripts:{
			onLoad:{layer:l=>l.update[8],script(layer,script){
				this.scripts.main.onLoad();
			}},
			main:{layer:l=>l.draw[8],script(layer,script){
				Draw.circle(100,100,5,"green");
			}},
		},
	});
}
