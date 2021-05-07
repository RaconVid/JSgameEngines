{
	var mainGame;{
		mainGame = new MainGame();
	}let mg = mainGame;
	if(true){
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
		//list=[[1,1],[-1,2],[-1,1],[1,2],[1,1]];
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
				posA=posA.map(v=>Math.scale(v,1/Math.len(v)));
				yield;
			}
			del();
		}());
		new mg.UpdateScript(l=>l.draw[5],function*(){
			while(true){
				if(coordsList.length>10**6){
					console.log(coordsList);alert("MEMORY LEAK");throw"MEMORY LEAK";
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
		}());
	}
	mg.start();
}
if(true){
	let mg=mainGame;
	let l={
		u:mainGame.layers.update,
		d:mainGame.layers.draw,
	};
	let joysticks=[];
	setupJoysticks:{
		let joysticksKeys=[
			['ArrowUp','ArrowLeft','ArrowDown','ArrowRight'],
			['KeyW','KeyA','KeyS','KeyD'],
		];
		for(let i=0;i<joysticksKeys.length;i++){
			joysticksKeys[i]=joysticksKeys[i].map(v=>Inputs.getKey(v));
			joysticks[i]={
				keys:joysticksKeys[i],
				lastValue:[0,0],
				get vec2(){
					return Math.vec2(this.keys[3].down-this.keys[1].down,this.keys[0].down-this.keys[2].down);
				},
			};
		}
	}
	startMainMenu=function(){
		let menu={
			start(){
				let mouseOverRect=function(rect,mousePos=Inputs.mouse.vec2){
					return ((mousePos[0]-rect[0])>=0&&(mousePos[0]-rect[0])<=rect[2])&&((mousePos[1]-rect[1])>=0&&(mousePos[1]-rect[1])<=rect[3]);
				};
				{
					let button={
						rect:[200,200,150,70],
						drawData:{
							border:{
								fillStyle:"#AACACA80",
								strokeStyle:"#4A4A4A40",
								lineWidth:3,
								borderScale:1.1,
							}
						},

						dels:[],
						start(){
							for(let i in this.dels){
								this.dels[i]();
							}{
								const del=l.u[4].add(this.main(()=>del()));
								this.dels.main=del;
							}
						},
						onClick(){
						},
						*main(del){
							this.baseDraw=()=>{//
								ctx.beginPath();
								let styles=this.drawData.border;
								ctx.fillStyle=styles.fillStyle;
								ctx.strokeStyle=styles.strokeStyle;
								ctx.lineWidth=styles.lineWidth;
								let scale=styles.borderScale;
								ctx.rect(
									this.rect[0]-this.rect[2]*(scale-1)/2,
									this.rect[1]-this.rect[3]*(scale-1)/2,
									this.rect[2]*scale,
									this.rect[3]*scale,
								);
								ctx.stroke();
								ctx.fill();
								ctx.rect(
									this.rect[0]-this.rect[2]*(scale-1)/2,
									this.rect[1]-this.rect[3]*(scale-1)/2,
									this.rect[2]*scale,
									this.rect[3]*scale,
								);
								ctx.stroke();
								ctx.fill();
								ctx.fillStyle="white";
								ctx.fillText("hello world",(this.rect[0]+this.rect[2]/2),(this.rect[1]+this.rect[3]/2));
							};let baseDraw_add=()=>l.d[9].add(this.baseDraw);
							let endDraw0;
							start1:{
								endDraw0=baseDraw_add();
							}
							let endDraw1,delDetectorScript;
							onMouseOver:{
								let detector=function*(del){
									while(true){
										if(mouseOverRect(this.rect)){
											let timer=0;let time0=mg.time.start;
											endDraw0();
											this.onOverDraw=()=>{
												ctx.save();
												this.baseDraw();
												ctx.translate(0,-5);
												this.baseDraw();
												ctx.restore();
											};
											let endDraw1=l.d[9].add(this.onOverDraw);
											while(mouseOverRect(this.rect)){
												timer=mg.time.start-time0;
												yield;
											}
											//endDraw0();
											endDraw1();
											baseDraw_add();
											yield;
										}
										yield;
									}

								}.bind(this);
								let del=l.u[6].add(detector(()=>del()));
								delDetectorScript=del;
							}
						},
					};
					button.start();
				}
			},
		};
		menu.start();
		let dels=[

		];
	};startMainMenu();
	mg.start()
}
