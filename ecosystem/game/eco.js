(function(){//load main game
	{
		mainGame=new MainGame()
		mainGame.layers={
			update:new mainGame.UpdateLayer(),
			physics:new mainGame.UpdateLayer(),
			draw:new mainGame.UpdateLayer(),
			mainDraw:mainGame.mainLayers.draw,
			detectors:new mainGame.UpdateLayer(),
			moveMent:new mainGame.UpdateLayer(),
		};
		for (let i = 0; i < 10; i++) {
			mainGame.layers.update.list[i]=new mainGame.UpdateLayer();
			mainGame.layers.physics.list[i]=new mainGame.UpdateLayer();
			mainGame.layers.draw.list[i]=new mainGame.UpdateLayer();
			mainGame.layers.mainDraw.list[i]=new mainGame.UpdateLayer();
			mainGame.layers.detectors.list[i]=new mainGame.UpdateLayer();
			mainGame.layers.moveMent.list[i]=new mainGame.UpdateLayer();
		}
		mainGame.updateOrder=[
			mainGame.layers.detectors,
			mainGame.layers.update,
			mainGame.layers.physics,
			mainGame.layers.moveMent,
			mainGame.layers.mainDraw,
		];
		//mainGame.layers.mainDraw.list[4]=mainGame.layers.draw;
	}
	let L=mainGame.layers;
	world={};
	world.chunk1=new Space.Chunk();
	let addSpaceDrawer=function(scripts){
		this.Draw={
			scripts:scripts,
			attachDraw:function(relPos,layer){
				for(let i=0;i<this.scripts.length;i++){
					let relPos1={
						pos:relPos.pos,
						scriptObj:this.scripts[i][0],
						onUpdate:function(){
							ctx.save();
							Draw.transform(relPos.pos);
							this.scriptObj.onUpdate();
							ctx.restore();
						}
					};
					this.scripts[i][1](layer).list.push(relPos1);
				}
			}
		}
		return this;
	}
	world.player=(()=>{
		let newObj=Collider.call(Detachable.call({speed:200}),world.chunk1);
		newObj.addCamera(true);
		newObj.size=400;
		newObj.entity=new Space.RefEntity(newObj,world.chunk1);
		newObj.movement=function(){
			let moveIputs=[
				1*((Inputs.getKey("d").down||Inputs.getKey("ArrowRight").down)-(Inputs.getKey("a").down||Inputs.getKey("ArrowLeft").down)),
				1*((Inputs.getKey("s").down||Inputs.getKey("ArrowDown").down)-(Inputs.getKey("w").down||Inputs.getKey("ArrowUp").down)),
			];
			let moveVec=Math.lerpT2(this.velocity,Math.scaleVec2(moveIputs,this.speed*mainGame.time.delta),0.999,mainGame.time.delta);
			this.velocity=moveVec;
			//this.coords=Math.addVec2(this.coords,this.velocity);
		};
		newObj.update1=new mainGame.UpdateScript(newObj,L.update.list[4],undefined,function(){
			this.sprite.movement();
		},true);
		newObj.draw1=(()=>{
			let obj=new mainGame.UpdateScript(newObj,L.draw.list[4],undefined,function(){
				let p=this.sprite;
				ctx.save();
				ctx.translate(p.coords[0],p.coords[1]);
				Draw.circle(0,0,10,"blue");
				ctx.fillStyle="#B0F0F0B0";
				ctx.textAlign = "center"; 
				ctx.font="10px Arial";
				ctx.fillText([Math.round(p.coords[0]),Math.round(p.coords[1])],0,0);
				ctx.restore();
				this.isDeleting=true;
			});
			return obj;
		})();
		Space.addDraw.call(newObj,[
			[newObj.draw1,(layer)=>layer.list[4]]
		]);
		return newObj;
	})();
	world.obj1=(()=>{
		const sprite=Space.addEntity.call({type:{}},world.chunk1);
		sprite.entity=new Space.RefEntity(sprite,world.chunk);
		sprite.update=new mainGame.UpdateScript(sprite,L.physics.list[7],undefined,function(){
			const sprite=this.sprite;
			if(sprite.isTouchingPortal){
				sprite.portalObj={pos:{}};
				const portal = sprite.portalObj;
				this.entity.transformPos(portal.Pos);
			}
		});
		sprite.draw= new mainGame.UpdateScript(sprite,L.draw.list[4],undefined,function(){
			let sprite=this.sprite;
			ctx.save();
			ctx.translate(sprite.coords[0],sprite.coords[1]);
			ctx.drawImage(Images.icon,0,0,40,-100);
			ctx.restore();
		});
		addSpaceDrawer.call(sprite,[
			[sprite.draw,(layer)=>layer.list[4]],
		]);
		return this;
	})();
	world.obj2=(()=>{
		const sprite=Space.addEntity.call({type:{}},world.chunk1);
		sprite.entity=new Space.RefEntity(sprite,world.chunk);
		sprite.update=new mainGame.UpdateScript(sprite,L.physics.list[7],undefined,function(){
			const sprite=this.sprite;
			let l=mainGame.time.start;
			sprite.coords=[Math.cos(l)*100,Math.sin(l)*100]
		});
		sprite.draw= new mainGame.UpdateScript(sprite,L.draw.list[4],undefined,function(){
			let sprite=this.sprite;
			ctx.save();
			ctx.translate(sprite.coords[0],sprite.coords[1]);
			ctx.drawImage(Images.icon,0,0,10,-40);
			ctx.fillStyle="#9966A044"
			ctx.fillRect(0,0,10,-40)
			ctx.restore();
		});
		addSpaceDrawer.call(sprite,[
			[sprite.draw,(layer)=>layer.list[4]],
		]);
		return this;
	})();
	world.portalA=(()=>{
		let newObj=new Space.Portal(world.chunk1);//Collider.call(Detachable.call(new Space.Portal()));
		newObj.pos.vec=[500,0];
		newObj.aa="A";
		newObj.pos.mat=[[1,0],[0,1]];
		newObj.entity=new Space.RefEntity(newObj,world.chunk1);
		newObj.addCollider();
		newObj.draw1=new mainGame.UpdateScript(newObj,undefined,undefined,function(){
			const sprite=this.sprite;
			ctx.save();
			Draw.transform(sprite.pos);
			ctx.fillStyle="#FF000010";
			ctx.fillRect(-sprite.size,-sprite.width,sprite.size*2,sprite.width*2);
			ctx.restore();
		});
		addSpaceDrawer.call(newObj,[
			[newObj.draw1,(layer)=>layer.list[6]],
		]);
		return newObj;
	})();
	world.portalB=(()=>{
		let newObj=new Space.Portal(world.chunk1);//Collider.call(Detachable.call(new Space.Portal()));
		newObj.pos.vec=[100,0];
		newObj.aa="B";
		newObj.pos.mat=[[1,0],[0,1]];
		newObj.entity=new Space.RefEntity(newObj,world.chunk1);
		newObj.addCollider();
		newObj.draw1=new mainGame.UpdateScript(newObj,undefined,undefined,function(){
			const sprite=this.sprite;
			ctx.save();
			Draw.transform(sprite.pos);
			ctx.fillStyle="#00FF0010";
			ctx.fillRect(-sprite.size,-sprite.width,sprite.size*2,sprite.width*2);
			ctx.restore();
		});
		addSpaceDrawer.call(newObj,[
			[newObj.draw1,(layer)=>layer.list[6]],
		]);
		return newObj;
	})();
	world.portalA.portalB=world.portalB;
	world.portalB.portalB=world.portalA;
	if(false)world.portal=(()=>{
		let newObj=new Space.Camera();//Collider.call(Detachable.call(new Space.Portal()));
		newObj.pos.vec=[100,0];
		newObj.pos.mat=[[0,1],[-1,0]];
		newObj.coords=[-3,40];
		newObj.entity=new Space.RefEntity(newObj,world.chunk1);
		newObj.draw1=new mainGame.UpdateScript(newObj,undefined,undefined,function(){
			const sprite=this.sprite;
			Draw.circle(0,0,10,"green");
		});
		addSpaceDrawer.call(newObj,[
			[newObj.draw1,(layer)=>layer.list[3]],
		]);
		return newObj;
	})();

	world.s=(()=>{
		let newObj={};
		return newObj;
	})();
})();
mainGame.start();