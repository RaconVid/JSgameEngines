{//19:16
window. DEBUG_UI=true;
window. TESTING=true;
{
	MainGame;Draw;ctx;Inputs;
	MainGame.layers={
		update:MainGame.mainLayers.update,
		draw:MainGame.mainLayers.draw,
		chunk:MainGame.mainLayers.chunk,
	};
	MainGame.updateOrder=[
		MainGame.layers.update,
		MainGame.layers.draw,
	];
}let mg=MainGame;
var RelPos=class{};{({thisObj:true,a(){
	const thisObj=this;
	let n=0;
	let class1=class RelPos_class1 extends Array{//gyro-relative-position (node)
		static curve=-1;
		constructor(){
			super([],[],[1,n++]);//note: this=[[objA,objB...],[matA,matB...]];
			//(A->B) = A to B
			//(A--B) = A join B
			//moving uses (A->B)
		}
		//get set
			get name(){return this[2][1];}
			set name(val){this[2][1]=val;}
			get mats(){return this[1];}
			set mats(val){this[1]=val;}
			get mat(){return this[1][0];}
			set mat(val){this[1][0]=val;}
			get layers(){return this[0];}
			set layers(val){this[0]=val;}
			get layer(){return this[0][0];}
			set layer(val){this[0][0]=val;}
		//
		//join methods (A--B)
			static goto(list,obj,mat_listToObj=null,curve=class1.curve){//return new list
				let index=this.getIndex(list[0],obj);
				if(index==-1)return list;
				let mat=mat_listToObj??list[1][index];
				mat=mat
				let mat1=Math.Mat.inverse(mat);
				let minDist=Math.Gmat.len(mat1,curve)*0.9,dist=0,minObjChain,minObj;
				let chain=[list];
				this.forEach(list,(layer,layerMat,reps,n)=>{
					chain[n+1]=layer;
					if(layer==obj||layer[2]?.[0]==0)return false;//0*(typeof list[0][i].name!="number")
					dist=Math.Gmat.len(Math.Mat.mul(layerMat,mat1),curve);
					if(isNaN(dist))return false;
					if(dist<minDist&&!(layer==list)){
						minDist=dist;
						minObj=layer;
						minObjChain=[];
						for(let i=0;i<n+2;i++){
							minObjChain[i]=chain[i];
						}
					}
					return n<4&&reps<1;
				});
				list[1][index]=mat;
				if(minObj&& minObj instanceof Array){
					for(let i=0;i<minObjChain.length-1;i++){
						this.moveJoin(minObjChain[i],obj,minObjChain[i+1]);
					}
					return minObj;
				}else {
					return list;
				}
			}goto(obj,mat){return class1.goto(this,obj,mat);}
			static addJoin(listA,listB,matAtoB){//A--B
				this.add(listA,listB,matAtoB);
				this.add(listB,listA,Math.Mat.inverse(matAtoB));
				return listA;
			}addJoin(listB,matAtoB){return class1.addJoin(this,listB,matAtoB);}
			static delJoin(listA,listB){
				this.del(listA,listB);
				this.del(listB,listA);
			}delJoin(listB){return class1.delJoin(this,listB);}
			static moveJoin(list,listA,listB){//O--A => O--B
				if(listA==listB||list==listB)return;
				this.move(list,listA,listB);//(O->A) => (B->A)
				this.replace(listA,list,listB);//(A->O) => (A->B)
			}moveJoin(fromList,toList){return class1.moveJoin(this,fromList,toList);}
		//move pointers
			static move(listA,obj,listB){//(A->O) => (B->O)
				let indexA=this.getIndex(listA[0],obj);
				if(indexA==-1){throw"obj not found";return;}
				let indexB=this.getIndex(listA[0],listB);
				if(indexB==-1){throw"listB not found";return;}
				let mat=Math.Mat.mul(
					listA[1][indexA],
					Math.Mat.inverse(listA[1][indexB]),
				);
				listA[0].splice(indexA,1);
				listA[1].splice(indexA,1);
				this.add(listB,obj,mat);
				return mat;
			}move(obj,list){return class1.move(this,obj,list);}
			static replace(list,listA,objB){//(O->A) => (O->B) [O->A->B => O->B<-A]
				let indexA=this.getIndex(list[0],listA);
				if(indexA==-1){throw"listA not found";return;}
				if(listA==objB)return list[1][indexA];
				let indexB=this.getIndex(listA[0],objB);
				if(indexB==-1){throw"objB not found";return;}
				let mat=Math.Mat.mul(listA[1][indexB],list[1][indexA],);//???
				list[0][indexA]=objB;list[1][indexA]=mat;
				return mat;
			}replace(obj,list){return class1.move(this,obj,list);}
		//pointer methods (A->B)
			static getIndex(array,obj_index){
				if(typeof obj_index=="number")return obj_index>=0&& obj_index<array.length?obj_index:-1;
				else return array.indexOf(obj_index);
			}getIndex(obj_index){return class1(obj_index);}
			static add(listA,objB,matAtoB){
				let index=this.getIndex(listA[0],objB);
				if(index!=-1){
					listA[1][index]=matAtoB;
				}
				else{
					listA[0].push(objB);
					listA[1].push(matAtoB);
				}
				return listA;
			}add(obj,matAtoB){return class1.add(this,obj,matAtoB);}
			static del(listA,objB){
				let index=this.getIndex(listA[0],objB);
				if(index!=-1){
					listA[0].splice(index,1);
					listA[1].splice(index,1);
				}
				return listA;
			}del(obj){return class1.detach(this,obj);}
		//----
		static forEach(list,foo,carry=null){foo??=(obj,mat,reps,n,foundList,i,list)=>{return n<5&&reps<1;}
			const maxReps=2;
			carry??={
				n:0,
				mat:Math.Mat(3),
				list1:[],
				key:Symbol("found"),
				i:0,
			};
			let {n,mat,list1,key}=carry;
			if(list[key]>maxReps)return;
			else{
				list1.push(list);
				if(typeof list != "object")loga(list)
				if(key in list)list[key]++;
				else list[key]=1;
			}
			if(n==0){
				if(!foo(list,Math.Mat(3),n,-1,list1))return;
			}
			if(n>1000||list1.length>100000)return;
			for(let i=0;i<list[0].length;i++){
				let obj=list[0][i];
				let mat1=Math.Mat.mul(list[1][i],mat);
				let reps=obj?.[key]??0;
				
				if(!(reps>maxReps)&&foo(obj,mat1,reps,n,list1,i,list)){
					if(
						list[0][i]
						&& !(list[0][i] instanceof Math.Mat)
						&& ((list[0][i] instanceof RelPos.self)||Boolean(list[0][i]?.[0]?.[0]))
					){
						this.forEach(list[0][i],foo,{
							n:n+1,
							mat:n==0?list[1][i]:mat1,
							list1:list1,
							key:key,
						});
					}
				}
			}
			if(n==0){
				for(let i=0;i<list1.length;i++){
					delete list1[i][key];
				}
			}
		};forEach(){return class1.forEach(this,...arguments)}
		static fixGmat3(mat,c=this.curve){return Math.Mat(3).rot(Math.getAngle(Math.Mat.mul(mat,Math.Gmat(Math.aGmat(mat,c).map(v=>-v),c))[1],1,2),1,2).mul(Math.Gmat(Math.aGmat(mat,c),c));}
	};
	let function1=Object.defineProperties(function RelPos_function1(){
		if(this instanceof function1){
			return new class1();
		};
		return [[],[],[1]];//[objs,mats,properties:{anchord,}]
	},Object.getOwnPropertyDescriptors(class1));
		class1.prototype.constructor=function1;
		function1.detach=function1.delete=function1.del;
		function1.attach=function1.del;
		function1.prototype.detach=function1.prototype.delete=function1.prototype.del;
		function1.prototype.attach=function1.prototype.del;
		RelPos=function1;
	RelPos.self=class1;
}}).a();}
let forEachRelPos=RelPos.forEach.bind(RelPos);
let fixGmat3=(mat,c=RelPos.curve)=>RelPos.fixGmat3(mat,c);
var relpos=new RelPos();
{	
	let makeRelPos=function(relposA=p,relPosRange=ranges[0],joinRange=ranges[1]){
		let minDist=Infinity,dist,d1;//Math.tanh(Math.TAU/8)*8;
		let layer=null;let found=false,found1=false;RelPos.forEach(relposA,(l,m,r,n)=>{
			if(r>0||n>50)return false;
			if(n==-1)return true;
			if(l[2][0]==0)return false;
			if((dist=Math.Gmat.len(m,RelPos.curve))<minDist){minDist=dist;d1=l;}
			if(l==relposA.layer)return true;
			else if(!found1&&Math.Gmat.len(m,RelPos.curve)<joinRange&&n>-1){
				found1=true;//found=true;
				RelPos.addJoin(relposA.layer,l,Math.Mat.mul(m,relposA.mat.inverse()));
				//RelPos.goto(relposA.layer,relposA);
			}//loga(l,l.name+":"+Math.Gmat.len(m))}

			return true;
		});
		if(!found&&minDist>=relPosRange){
			let newPos=new RelPos().addJoin(relposA.layer,relposA.mat);
			RelPos.delJoin(relposA.layer,relposA);
			newPos.addJoin(relposA,Math.Mat(3));
			return true;
		}
		else return false;
	}
	const squareLen=Math.atanh(Math.TAU/8);
	let ranges=[0,0.01,1*squareLen];
	ranges[0]=ranges[2]-0.1;
	let r1=relpos;
	let p=new RelPos();
	p[2][0]=0;//not anchored;
	RelPos.addJoin(r1,p,Math.Mat(3));
	let dir=0,dirs=[[1,0],[0,1],[-1,0],[0,-1]];
	dirs=dirs.map(v=>v.map(v=>v*ranges[2]));
	let state=0;
	for(let i=0;i<0;i++){
		let gMat=Math.Gmat(dirs[dir],RelPos.curve);
		p.mat=p.mat.mul(gMat);
		if(makeRelPos()){
			if(state%3==0){dir++;}
			else if(state%3==1){dir+=3;}
			else if(state%3==2){dir+=4;}
		}else{
			//p.mat=p.mat.div(gMat);
			if(state==0){dir+=3;}
			else if(state==1){dir+=1;state=3;}
			else if(state==3){dir+=1;state=0;}
			//RelPos.goto(p.layer,p);
		}
		dir%=4;
	}
}
var player1=new RelPos();player1[2][0]=0;relpos.addJoin(player1,Math.Gmat([0,-0],RelPos.curve));player1.name="p1";
var player2=new RelPos();player2[2][0]=0;relpos.addJoin(player2,Math.Gmat([0,-0],RelPos.curve));player2.name="p2";
//relpos.moveJoin(player2,relpos[0][1]);
var sprite1=new Space.Sprite({
	OnStart(){
		this.attach();
		let curveScale=10;
		//this.speed//*=curveScale;
		//this.drawScale/=curveScale;
		this.turnSpeed*=0.9999;
	},
	...{
		coords:[100,0],
		size:10,
		drawScale:40,
		speed:4,
		turnSpeed:0.637,
	},
	scripts:{
		mainUpdate:{attach:true,layer:l=>l.draw[7],*script(layer,script){
			let speed=this.speed;
			let processPlayer=(p)=>{const c=RelPos.curve;
				let keys=Inputs.getKey("Keys"+["Arrow","WASD"][p]);
				let player=[player1,player2][p];
				if(keys.down){
					let vec=Math.rotate([1,0],Math.random()*Math.TAU,0,1);
					vec=keys.vec2;
					vec=Math.scaleVec2(vec,speed*MainGame.time.delta);
					player.mat=fixGmat3(player.mat,c);
					let mat=player.mat.mul(Math.Gmat(Math.scale(vec,-1),c));
					mat=fixGmat3(mat);
					RelPos.addJoin(player,player.layer,mat);
					RelPos.goto(player.layer,player);
					player.layer[1][player.layer[0].indexOf(player)];
				}
				RelPos.addJoin(player,player.layer,player.mat.rot((Inputs.getKey("KeyZ").down-Inputs.getKey("KeyX").down)*Math.TAU*this.turnSpeed*MainGame.time.delta,1,2));
				let key=Inputs.getKey("KeyQ");
				if(key.onDown&&p==0){
					key.onDown=false;
					let newPos=new RelPos().addJoin(player.layer,player.mat);
					//newPos[2][0]=0;
					RelPos.delJoin(player.layer,player);
					RelPos.addJoin(newPos,player,Math.Mat(3));
				}
				if(p==0){
					if(keys.down){
						let joinRange=0.5,relPosRange=4;//60/this.drawScale;
						let minDist=Infinity,dist,d1;//Math.tanh(Math.TAU/8)*8;
						let layer=null;let found=false,found1=false;
						RelPos.forEach(player,(l,m,r,n)=>{
							if(r>0||n>50)return false;
							if(n==-1)return true;
							if(l[2][0]==0)return false;
							if((dist=Math.Gmat.len(m,c))<minDist){minDist=dist;d1=l;}
							if(l==player.layer)return true;
							else if(!found1&&Math.Gmat.len(m,c)<joinRange&&n>=0){
								found1=true;//found=true;
								RelPos.addJoin(player.layer,l,Math.Mat.mul(m,player.mat.inverse()));
								//RelPos.goto(player.layer,player);
							}//loga(l,l.name+":"+Math.Gmat.len(m))}

							return true;
						});
						if(!found&&minDist>relPosRange){
							let newPos=new RelPos().addJoin(player.layer,player.mat);
							RelPos.delJoin(player.layer,player);
							newPos.addJoin(player,Math.Mat(3));
						}
					}
				}
			};
			while(true){
				processPlayer(0);
				processPlayer(1);
				yield;
			}
		}},
		mainDraw:{attach:true,layer:l=>l.draw[8],script(layer,script){
			let scale=this.drawScale;
			ctx.save();ctx.translate(...Draw.center);{
				let mats=[];
				forEachRelPos(player1,(obj,mat,reps,n,list)=>{
					mats[n]=mat;
					let v=Math.aGmat(mat,RelPos.curve).map(v=>v*scale);
					if(n>=0){
						let v1=Math.aGmat(mats[n-1],RelPos.curve).map(v=>v*scale);
						Draw.line(...v1,...v.map(v=>v+n*0),2,Draw.hslaColour(n/Math.TAU/2,0.8,0.66,0.5));
					}
					//Draw.circle(v[0],v[1],3,"grey");
					if(typeof obj.name=="number"){
						Draw.Text({text:obj.name??"?",x:v[0],y:v[1],color:"#FFFA",size:10})();
						//return n<5;
					}
					else Draw.Text({text:obj.name+":"+obj.layer.name,x:v[0],y:v[1]})();
					return n<40&&reps<1;//return n==0;
				});player1.dist??=[];
				Draw.Text({text:Math.aGmat(player1.mat,RelPos.curve).map(v=>v.toFixed(2)),x:10,y:10})();
				//Draw.circle(0,0,this.size,"#37FF3760");//
			}ctx.restore();
			return false;
		}},
	},
});
world.saveGameStr=()=>JSON.stringify(JSON.list({relpos,player1,player2}));
world.loadGameStr=(str)=>{
	if(!str)return false;
	let saveObj=JSON.parse(str);
	saveObj=JSON.parseList(saveObj);
	relpos=saveObj.relpos;//.map(v=>new RelPos());
	player1=saveObj.player1;
	player2=saveObj.player2;
	forEachRelPos(relpos,(obj,mat,reps,n,list)=>{
		for(let i=0;i<obj[1].length;i++){
			obj[1][i]=Math.Mat(obj[1][i]);
		}
		Object.defineProperties(obj,Object.getOwnPropertyDescriptors(RelPos.prototype));
		return reps<1;
	});
	return true;
};
world.saveName="hyperbolic world: save";
world.saveName1=world.saveName+"1";
world.saveGame=()=>localStorage.setItem(world.saveName1,world.saveGameStr());
world.loadGame=()=>world.loadGameStr(localStorage.getItem(world.saveName1));
world.loadGame();
importJavascriptFromSrc(
	"game/setDebug.js",
	"game/sim.js"
);MainGame.start();
}