(function(){//4:22 -> 4:34 -> 
	//WORK DAM IT
	mainGame=new MainGame();
	(()=>{//set up MainGame();
		mainGame.layers={
			update:mainGame.mainLayers.update,
			physics:new mainGame.UpdateLayer(),
			draw:mainGame.mainLayers.draw,
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
		mainGame.updateOrder=[
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
		sprite.update=new mainGame.UpdateScript(sprite,layers.update[4],undefined,function(layer,layer_i){
			const s=this.sprite;
		})
		sprite.draw=new mainGame.UpdateScript(sprite,layers.draw[4],undefined,function(layer,layer_i){
			const s=this.sprite;

		})
		return sprite;
	})();
	let firstPlane={
		list:[
		],
	};
	function Collider(layer){
		this.keywords={
			all:1,
		};
		this.type={
			shape:"circle"
		}
		this.colour="#00FF88";
		this.size=10;
		this.coords=[0,0];
		this.velocity=[0,0];
		this.matrixPos=[[1,0],[0,1],this.coords];//[rotation,coords]
		
		this.drawCollider=()=>{
			Draw.transform(this.matrixPos);
			Draw.circle(0,0,this.size,this.colour);
			Draw.undoTransform(this.matrixPos);
		}

		this.layer=layer;
		this.layer.list.push(this);
		this.physicsCollider=()=>{
			let minDist=Infinity;
			let minObj=null;
			for(let i=0;i<this.layer.list.length;i++){
				let obj=this.layer.list[i];
				if(obj==this)continue;
				if(obj.type!=undefined)if(obj.type.shape!=undefined){
					switch(obj.type.shape){
						case "circle":
							let normal=[Math.minusVec2(obj.coords,this.coords),Math.minusVec2(obj.velocity,this.velocity)];
							let angles=[];
							let sizeSum=this.size+obj.size;
							angles.push(Math.getAngle(normal[1],0,1));
							normal=[Math.rotate(normal[0],-angles[0],0,1),Math.rotate(normal[1],-angles[0],0,1)];
							normal=[Math.scaleVec2(normal[0],1/normal[1][0]),Math.scaleVec2(normal[1],1/normal[1][0])];
							if(normal[0][1]>)
					}
				}
			}
		}
	}
	let sprite1=(()=>{
		let sprite={
			hitbox:{},
		};
		Collider.call(sprite,firstPlane);
		sprite.update=new mainGame.UpdateScript(sprite,layers.update.list[4],undefined,function(layer,layer_i){
			const s=this.sprite;
			Inputs.getKey("w").down;
		})
		sprite.draw=new mainGame.UpdateScript(sprite,layers.draw.list[4],undefined,sprite.drawCollider);
		console.log(sprite)
		return sprite;
	})();
	mainGame.start();
})()