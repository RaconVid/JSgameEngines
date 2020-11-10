(function(){
	mainGame=new MainGame();
	(()=>{//set up MainGame();
		mainGame.layers={
			update:mainGame.mainLayers.update,
			physics:new mainGame.UpdateLayer(),
			draw:mainGame.mainLayers.draw,
			detectors:new mainGame.UpdateLayer(),
		}
		for (let i = 0; i < 10; i++) {
			mainGame.layers.update.list[i]=new mainGame.UpdateLayer();
		}
		for (let i = 0; i < 10; i++) {
			mainGame.layers.physics.list[i]=new mainGame.UpdateLayer();
		}
		for (let i = 0; i < 10; i++) {
			mainGame.layers.draw.list[i]=new mainGame.UpdateLayer();
		}
		for (let i = 0; i < 4; i++) {
			mainGame.layers.detectors.list[i]=new mainGame.UpdateLayer();
		}
		mainGame.updateOrder=[
			mainGame.layers.detectors,
			mainGame.layers.update,
			mainGame.layers.physics,
			mainGame.layers.draw,
		];
		let layers=mainGame.layers;
	})();
	const layers=mainGame.layers;
	let mySprite=(()=>{
		let sprite={

		};
		sprite.update=new mainGame.UpdateScript(sprite,layers.update.list[4],undefined,function(layer,layer_i){
			const s=this.sprite;
		})
		sprite.draw=new mainGame.UpdateScript(sprite,layers.draw.list[4],undefined,function(layer,layer_i){
			const s=this.sprite;

		})
		return sprite;
	})();
	let firstPlane={
		list:[
		],
	};
	function Collider(SpaceLayer=this.SpaceLayer){//spriteRef=Collider.call(sprite).addPhysics(layer...);
		this.keywords={
			all:1,
			colour:"#00FF88",
		};
		this.type={
			shape:"circle",
		}
		this.colour=this.keywords.colour;

		this.size=10;
		this.coords=[0,0];
		this.velocity=[0,0];
		this.matrixPos=[[1,0],[0,1],[0,0]];//[rotation,coords]
		this.layer=SpaceLayer;

		this.detatchScripts=function(){
			let list=updateScriptList;
			for (var i = 0; i < list.length; i++) {
				list[i].detatchLayer();
			}
		}
		this.attatchScripts=function(){
			let list=updateScriptList;
			for (var i = 0; i < list.length; i++) {
				list[i].attatchLayer();
			}
		}
		this.updateScriptList=[];
		this.addDrawing=(colour=this.colour)=>{
			this.colour=colour;
			this.Drawing = new mainGame.UpdateScript(this,layers.draw.list[4],undefined,()=>{
				ctx.translate(this.coords[0],this.coords[1])
				Draw.transform(this.matrixPos);
				Draw.circle(0,0,this.size,this.colour);
				Draw.undoTransform(this.matrixPos);
				ctx.translate(-this.coords[0],-this.coords[1])
			});
			this.updateScriptList.push(this.Drawing);
			return this;
		};
		this.addDetector=(triggerKeyWord=["all",1],filter=undefined)=>{//[colour,this.colour]
			if(filter==undefined){
				this.detectorFilter=function(obj){
					if("keywords" in obj)
					if(this.triggerKeyWord[0] in obj.keywords)
					if(obj.keywords[this.triggerKeyWord[0]]==this.triggerKeyWord[1]){
						let dist;
						switch(obj.type.shape){
							case"circle":
								dist= Math.len2(this.coords,obj.coords)-this.size-obj.size;
							break;
							default:
								dist=Infinity;
						}
						if(dist>0){
							return false;
						}
						return true;
					}
					return false;
				};
			}
			else{
				detectorFilter=filter;
			}
			this.keywords.colour=this.colour;
			this.triggerKeyWord=triggerKeyWord;
			this.objsInHitbox=[];
			this.areaDetectorScript = new mainGame.UpdateScript(this,layers.detectors.list[0],undefined,()=>{
				this.objsInHitbox=[];
				for(let i=0;i<this.layer.list.length;i++){
					let obj=this.layer.list[i];
					if(obj==this)continue;
					if(this.detectorFilter(obj)){
						this.objsInHitbox.push(obj)
					}
				}
			});
			this.updateScriptList.push(this.areaDetectorScript);
			return this;
		};
		this.addPhysics=()=>{
			this.type.physical=1;
			this.mass=1;
			this.Physics={
				minObj:null,
				minCTime:NaN,
				minDist:NaN,
				isColliding:false,
				scripts:[],
				newVelocity:Clone(this.velocity),
				update1:new mainGame.UpdateScript(this,layers.physics.list[4],undefined,()=>{
					this.Physics.newVelocity=[this.velocity[0],this.velocity[1]];
					let minDist=Infinity;//can be -ve (i.e. <0)
					let minCTime=Infinity;//min Collission time how many frames until collision
					let minObj=null;
					//phisics layer 1: get/handle collisions
					for(let i=0;i<this.layer.list.length;i++){
						let obj=this.layer.list[i];
						if(obj==this)continue;
						if(obj.type!=undefined)if(obj.type.shape!=undefined)if(obj.type.physical!=undefined){
							switch(obj.type.shape){
								case "circle":
									let normal;{
										normal=[Math.minusVec2(obj.coords,this.coords),Math.minusVec2(obj.velocity,this.velocity)];
										//normal=[coords,velocity]
										let angles=[];
										angles.push(Math.getAngle(normal[1],0,1));
										normal=[Math.rotate(normal[0],-angles[0],0,1),Math.rotate(normal[1],-angles[0],0,1)];
									}

									let obj_dist;
									let obj_time;{
										let sizeSum=this.size+obj.size;
										if(normal[0][1]>sizeSum){

											obj_dist=normal[0][1]-sizeSum;
											obj_time=Infinity;
										}
										else{
											//normal=[Math.scaleVec2(normal[0],1/normal[1][0]),[1,0]];//normal[1]/normal[1][0]===[1,0];
											obj_dist=0;
											//xvT=-x+-(L^2-(y)^2)^1/2
											obj_time=Math.sqrt(Math.pow(sizeSum,2)-Math.pow(normal[0][1],2));
											obj_time=normal[0][0]>0?obj_time-normal[0][0]:-(obj_time+normal[0][0]);
										}
									}
									if(obj_time<minCTime&&obj_time>=0){
										minObj=obj;
										minDist=Math.min(minDist,obj_dist);
										minCTime=obj_time;
									}
								break;
								default:
							}
						}
					}
					this.Physics.minObj=minObj;
					this.Physics.minCTime=minCTime;
					this.Physics.isColliding=this.Physics.minObj!=null&&this.Physics.minCTime<1;
					this.Physics.minCTime=Math.clamp(0,1,this.Physics.minCTime);
				}),
				update2:new mainGame.UpdateScript(this,layers.physics.list[5],undefined,()=>{
					//phisics layer 2: do collisions
					if(this.Physics.isColliding){
						let obj=this.Physics.minObj;
						switch(obj.type.shape){
							case "circle"://alert(this.Physics.minCTime)
								let normal;let angles=[];{//,Math.scaleVec2(Math.addVec2(this.velocity,obj.velocity),0.5)
									normal=[Math.minusVec2(this.coords,obj.coords),Math.minusVec2(this.velocity,obj.velocity)];
									normal[0]=Math.addVec2(normal[0],Math.scaleVec2(normal[1],this.Physics.minCTime));
									//normal=[coords,velocity]
									angles.push(Math.getAngle(normal[0],0,1));
									normal=[Math.rotate(normal[0],-angles[0],0,1),Math.rotate(normal[1],-angles[0],0,1)];
								}
								if(obj.type.movable==false){
									normal[1][0]=Math.abs(normal[1][0]);
								}
								else if(obj.mass!=this.mass){
									
									normal[1][0]=normal[1][0]/Math.sqrt(this.mass)+Math.abs(normal[1][0])/Math.sqrt(this.mass/obj.mass)
									//e=u^2m/2 = a^2m=b^2n => a=u/R2 
								}
								else{
									normal[1][0]=0;
								}
								{
									normal=[Math.rotate(normal[0],angles[0],0,1),Math.rotate(normal[1],angles[0],0,1)];
									normal=[Math.addVec2(normal[0],obj.coords),Math.addVec2(normal[1],obj.velocity)];
								}
								this.Physics.newVelocity[0]=normal[1][0];
								this.Physics.newVelocity[1]=normal[1][1];
							break;
						}
					}
				}),
				update3:new mainGame.UpdateScript(this,layers.physics.list[6],undefined,()=>{
					this.velocity=[this.Physics.newVelocity[0],this.Physics.newVelocity[1]];
					this.coords[0]+=this.velocity[0]*this.Physics.minCTime;
					this.coords[1]+=this.velocity[1]*this.Physics.minCTime;
				}),
				attatchLayer:function(){
					for(let i=0;i<this.scripts.length;i++){
						this.scripts[i].attatchLayer();
					}
				},
				detatchLayer:function(){
					for(let i=0;i<this.scripts.length;i++){
						this.scripts[i].detatchLayer();
					}
				},
			};
			this.Physics.update2.detatchLayer();
			//this.Physics.scripts=[this.Physics.update1,this.Physics.update2,this.Physics.update3];
			this.updateScriptList.push(this.Physics);
			
			this.addFriction=function(){
				this.Physics.friction=1000;//per Second
				this.Physics.frictionUpdate=new mainGame.UpdateScript(this,layers.physics.list[3],undefined,()=>{
					this.velocity=Math.scaleVec2(this.velocity,Math.pow(1/this.Physics.friction,mainGame.time.delta))
				});
				return this;
			}
			this.addFriction();
			return this;
		}

		return this;
	}
	function Camera(SpaceLayer=this.SpaceLayer){//addCamera
		this.keywords={
		};
		this.type={
			camera:1,
		}
		this.layer=SpaceLayer;
		this.coords=[0,0];
		this.velocity=[0,0];
		this.matrixPos=[[1,0],[0,1],[0,0]];//[rotation,coords]
		this.coords=[0,0];
		this.drawLayer=layers.draw[4];//this.layer.layers.draw
		this.drawScript=new mainGame.UpdateScript(this,layers.draw[4],undefined,function(){
			ctx.translate(-this.sprite.coords[0],-this.sprite.coords[1]);
			Draw.undoTranslate(this.sprite.matrixPos);
			this.drawLayer.onUpdate();
			Draw.translate(this.sprite.matrixPos);
			ctx.translate(this.sprite.coords[0],this.sprite.coords[1]);
		});
	}

	let player=(()=>{//6:30
		let sprite={};
		sprite.body=Collider.call(new Space.Entity(sprite,firstPlane),firstPlane).addPhysics().addDrawing();
		sprite.body.coords=[300,100];
		sprite.speed=200;
		sprite.body.update=new mainGame.UpdateScript(sprite,layers.update.list[4],undefined,function(){
			const sprite=this.sprite;
			const body=this.sprite.body;
			let moveIputs=[
				1*((Inputs.getKey("d").down||Inputs.getKey("ArrowRight").down)-(Inputs.getKey("a").down||Inputs.getKey("ArrowLeft").down)),
				1*((Inputs.getKey("s").down||Inputs.getKey("ArrowDown").down)-(Inputs.getKey("w").down||Inputs.getKey("ArrowUp").down)),
			];
			let moveVec=Math.lerpT2(body.velocity,Math.scaleVec2(moveIputs,sprite.speed*mainGame.time.delta),0.999,mainGame.time.delta);//Math.len2(this.velocity)
			body.velocity=Clone(moveVec);
		});
		sprite.body.hand=Collider.call({
			joinedTo:sprite.body,
			relCoords:[1,0],
			distFromBody:20,
			jointUpdate:new mainGame.UpdateScript(sprite,layers.physics.list[6],undefined,function(){
				const part=this.sprite.body.hand;
				const body=this.sprite.body;
				let mousePos=Math.minusVec2(Inputs.mouse.vec2,[Draw.width/2,Draw.height/2]);
				if(Math.len2(mousePos)>0){
					part.relCoords=Math.scaleVec2(mousePos,part.distFromBody/Math.len2(mousePos))
				}
				part.coords=Math.addVec2(body.coords,part.relCoords);
				for (var i = 0; i < part.objsInHitbox.length; i++) {
					if(part.objsInHitbox[i] ==body){part.objsInHitbox.splice(i,1);i--}
				}
				if(part.objsInHitbox.length>0){
					part.colour="#BB88556F";
				}
				else{
					part.colour="#00FF88";
				}
			}),
		},firstPlane).addDrawing().addDetector();
		sprite.body.hand.Drawing.detatchLayer();
		mainGame.mainLayers.draw.onUpdate();
		sprite.body.hand.Drawing.attachLayer(layers.draw.list[7]);
		sprite.body.hand.relCoords=[sprite.body.hand.distFromBody,0];
		sprite.body.hand.coords=Math.addVec2(sprite.body.coords,sprite.body.hand.relCoords);
		sprite.Camra={
			ScriptA:new mainGame.UpdateScript(sprite,layers.draw.list[2],undefined,function(){
				Draw.undoTransform(sprite.body.matrixPos);
				ctx.translate(Draw.width/2-sprite.body.coords[0],Draw.height/2-sprite.body.coords[1]);
			}),
			ScriptB:new mainGame.UpdateScript(sprite,layers.draw.list[9],undefined,function(){
				ctx.translate(sprite.body.coords[0]-Draw.width/2,sprite.body.coords[1]-Draw.height/2);
				Draw.transform(sprite.body.matrixPos);
			}),
		}
	})();
	let sprite1=(()=>{
		let sprite=Collider.call(new Space.Entity(undefined,firstPlane),firstPlane).addPhysics(firstPlane).addDrawing();
		sprite.coords=[300,200];
		sprite.velocity=[0,0];
		sprite.colour="#00FF88";
		return sprite;
	})();
	let sprite2=(()=>{
		let sprite=Collider.call(new Space.Entity(undefined,firstPlane),firstPlane).addPhysics(firstPlane).addDrawing();
		sprite.coords=[350,199.99];
		sprite.velocity=[-0,0];
		sprite.colour="#00FF88";
		return sprite;
	})();
	let sprite3=(()=>{
		let sprite=Collider.call(new Space.Entity(undefined,firstPlane),firstPlane).addPhysics(firstPlane).addDrawing();
		sprite.coords=[400,201];
		let KEnergy=2;
		sprite.mass=10;
		sprite.velocity=[-Math.sqrt(KEnergy*2/sprite.mass),0];
		sprite.colour="#00FF88";
		return sprite;
	})();
	mainGame.start();
})()