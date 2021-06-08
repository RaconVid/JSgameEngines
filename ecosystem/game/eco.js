{//19:16
window. DEBUG_UI=true;
window. TESTING=true;

{
	MainGame;
	Draw;ctx;
	Inputs;
	MainGame.layers={
		update:MainGame.mainLayers.update,
		draw:MainGame.mainLayers.draw,
		chunk:MainGame.mainLayers.chunk,
		//physics:new MainGame.UpdateLayer(16)//use l=>l.physics[0 to 15]
	};
	MainGame.updateOrder=[
		MainGame.layers.update,
		//MainGame.layers.physics,
		MainGame.layers.draw,
	];
}let mg=MainGame;
//commandLineBased version
({c:[0,0],})
var gameState = {//is deRefference-able for saves
	creatures:[
	],
};
class creature{
	type="";
	coords=[0,0];
	biomass=100;
	hp=100;
	near=[];
	actionsLeft=4;
	maxHp=100;
	static reproduce=class extends creature{
		constructor(a,b,data){
			data.coords??=Math.lerp2(a.coords,b.coords,0.5).map(v=>v+40*(Math.random()*2-1));
			super(data);
		}
	}
	constructor(data){
		Object.assign(this,data);
	}
};
for(let i=0;i<20;i++){gameState.creatures.push(new creature({type:["rock","paper","scissors"][i%3],coords:[0,0].map(v=>v+200*(Math.random()*2-1))}))}
let processCreatures;{let gs=gameState;
processCreatures=function(gameState=gs){//creatures that are near eachother
	const {creatures}=gameState;
	const interactions={
		rock:{
			rock(a,b,gameState){
				let costs=[1,1];
				if(a.actionsLeft>costs[0]&&b.actionsLeft>costs[1]){
					a.actionsLeft-=costs[0];
					b.actionsLeft-=costs[1];
				}else return;
				if(a.biomass>160&&b.biomass>160){
					gameState.creatures.push(new creature.reproduce(a,b,{
						type:a.type,
						biomass:100,
						actionsLeft:0,
						near:[...b.near],
					}));
					a.biomass-=100/2;
					b.biomass-=100/2;
				}else{
					let maxCarry=2;
					let carry=Math.clamp(-maxCarry,maxCarry,((a.biomass-b.biomass)/4),2)|0;//share biomass
					if(Math.min(a.hp,b.hp)<18){
						carry=Math.clamp(-Math.min(a.biomass,b.biomass),0,-carry-5);	
					}
					a.biomass-=carry;
					b.biomass+=carry;
				}
			},
			paper(a,b,gameState){
				//B attacks A;
				let costs=[1,0];
				if(a.actionsLeft>costs[0]&&b.actionsLeft>costs[1]){
					a.actionsLeft-=costs[0];
					b.actionsLeft-=costs[1];
				}else return;
				if(a.biomass<2)return;
				a.hp-=Math.clamp(0,a.hp,30);
				let carry=Math.clamp(0,b.biomass,2);//cost to attack
				a.biomass+=carry;
				b.biomass-=carry;
				if(a.hp<=0){//b eats a
					carry=Math.min(a.biomass,40);//carry<=a.biomass
					carry=Math.min(250-b.biomass,carry);//b.biomass<=250;
					a.biomass-=carry;
					b.biomass+=carry;
				}
			},
			scissors(a,b,g){return this.paper(b,a,g);},
		},
		paper:{
			paper(){return interactions.rock.rock(...arguments);},
			scissors(){return interactions.rock.paper(...arguments);},
		},
		scissors:{
			scissors(){return interactions.rock.rock(...arguments);},
		},
	};
	for(let i=0;i<creatures.length;i++){
		let objA=creatures[i];
		if(objA.hp<=5&&objA.biomass<=50){//kill obj
			objA.hp=-1;//-1 => creature shouldnt exist
			for(let objB of objA.near){
				if(!objB.near.includes(objA))continue;
				objB.near.splice(objB.near.indexOf(objA),1);
			}
			creatures.splice(i,1);
			i--;
			continue;
		}
		objA.actionsLeft=4;
	}
	const nearRadius=40;
	creatureForLoop:for(let i=0;i<creatures.length;i++){let objA=creatures[i];
		for(let j=0;j<objA.near.length;j++){let objB=objA.near[j];
			interace:{
				let ret;
				let args=[gameState];

				if(interactions[objA.type][objB.type]){
					ret=interactions[objA.type][objB.type](objA,objB,...args);
				}else if(interactions[objB.type][objA.type]){
					ret=interactions[objB.type][objA.type](objB,objA,...args);
				}else {
					interactions.default(objB,objA,...args);
				}
			}
			if(objA.hp<=0)continue creatureForLoop;
		}
	}
	for(let i=0;i<creatures.length;i++){let objA=creatures[i];
		objA.near=[];
	}
	for(let i=0;i<creatures.length;i++){let objA=creatures[i];
		//find near
		for(let j=i+1;j<creatures.length;j++){let objB=creatures[j];
			if(Math.len2(objA.coords,objB.coords)<nearRadius){
				if(!objA.near.includes(objB))objA.near.push(objB);
				if(!objB.near.includes(objA))objB.near.push(objA);
			}
			//restore/update stats (e.g. health)
		}
		if(objA.hp>5)objA.actionsLeft=4;
		if(objA.biomass<=0)objA.hp=Math.max(0,objA.hp-2);
		else objA.hp=Math.clamp(0,Math.min(objA.hp+10,objA.maxHp??100),objA.hp*1.2+1*(objA.biomass>100))|0;
	}
};}
gameState.dels=[];
gameState.dels.push(
	MainGame.layers.draw[12].add((layer,script)=>{
		ctx.save();ctx.translate(...Draw.center);{
			for(let objA of gameState.creatures){
				ctx.save();ctx.translate(...objA.coords);{
					Draw.circle(0,0,5,"grey");
					Draw.Text({text:""+objA.type,x:0,y:0,size:10})();
					Draw.Text({text:objA.hp+"hp, "+objA.biomass+"kg",x:0,y:10,size:10})();
				}ctx.restore();
			}
		}ctx.restore();
	}),
	MainGame.layers.update[8].add(function*(layer,script){
		while(true){
			let t1=MainGame.time.start;
			while(t1+0.2>MainGame.time.start){yield;}
			processCreatures();
			yield;
		}
	}()),
	MainGame.layers.update[8].add(function*(layer,script){
		let mouse=Inputs.mouse;
		let getVec=()=>Math.dif2(Inputs.mouse.vec2,Draw.center);
		while(true){
			sellect:if(mouse.down){let coords=getVec();
				let minObj=null,minDist=Infinity;
				for(let i=0;i<gameState.creatures.length;i++){
					let obj=gameState.creatures[i];
					let dist=Math.len2(obj.coords,coords);
					if(dist<(obj.size??10)+4&&dist<minDist){
						minDist=dist;
						minObj=obj;
					}
				}
				if(!minObj)break sellect;
				let selected= minObj;
				while(mouse.down){
					selected.coords=Math.vec2(...getVec());
					yield;
				}
			}
			yield;
		}
	}()),
	MainGame.layers.draw[8].add((layer,script)=>{
		ctx.save();ctx.translate(...[50,100]);{//...Draw.center);{
			Draw.Text({text:"len:"+gameState.creatures.length,size:20})();
		}ctx.restore();
	}),
);
(function setDebug(){if(DEBUG_UI)if(1){
	if(0){//frame by frame testing
		let main1=new MainGame.UpdateLayer(...MainGame.updateOrder);
		MainGame.updateOrder=[
			new MainGame.UpdateScript(({}).a,()=>{
				let t=MainGame.time.real;
				if(Inputs.mouse.onDown){
					main1.onUpdate();
				}
				Inputs.mouse.onDown=false;
			})
		]
	}
	let a=1/60;//debug UI
	if(1)new MainGame.UpdateScript(l=>l.draw,()=>{
		Draw.square(100,100,10,"#AA884040");
		ctx.font="30px Arial";
		ctx.fillStyle="#FFFFFFD0";
		let b=MainGame.time.realDelta??0;
		const m=0.001;
		a=Math.abs(b-a)<m?b:a>b?a-m:a+m;
		a=Math.lerp(a,b,0.3);
		//note: spf = seconds per frame
		let fps=1/a;
		//note: fps
		//note: view = amount of objects in player2's viewList
		if(1){//fps
			ctx.fillText("fps:"+Math.floor(fps*10000)/10000,100,100);
			ctx.fillStyle="#101010A0";
			ctx.fillRect(100-4,60-4,14*6+8,10+8);
			ctx.fillStyle="#A0CFA0A0";
			ctx.fillRect(100+14*5,60-4,10,10+8);//60fps marker
			const col1= Draw.hslaColour(Math.clamp(0,1,(fps-10)/(60-15))*0.33,0.5,0.66,0.8);
			ctx.fillStyle=col1;
			//ctx.fillStyle="#FFFFFFD0";
			let modulo=10;
			let fpsDIV=(fps-fps%modulo)/modulo;
			for(let i=0;i<fpsDIV;i++){
				let x=i;
				ctx.fillRect(100+14*x,60,10,10);
			}
			
			ctx.fillRect(100+14*fpsDIV,60,10*(fps%modulo)/modulo,10);
			ctx.fillStyle="#FFFFFFD0";
		}
		if(0)ctx.fillText("view:"+world.player2.camera.cameraObj.viewList.length,100,140);
		ctx.font="15px Arial";
		if(0){
			ctx.fillText("P1 chunk:"+world.player1.entity.layer.coords,100,240);
			ctx.fillText("P2 chunk:"+world.player2.entity.layer.coords,100,255);
		}
	})
}})()
importJavascriptFromSrc(
	"game/player1.js"
);MainGame.start();
}