"use strict";
{//
class IOEngine{
	start(){
		window.Draw=new this.Draw();
		window.Draw.start();
		window.Inputs=new this.Inputs(document.getElementById("canvas1"));
		window.Inputs.start();
		window.AsyncLoop=this.AsyncLoop;
		window.MainGame=new this.AsyncLoop();
		window.Time=this.Time;
		//window.fps=new this.Fps();
		//window.fps.start();
		//Draw.canvasObj.width=640;
		//Draw.canvasObj.height=360;
		return this;
	}
	constructor(){
		this.Draw=class DrawClass{
			constructor(){
				this.circles=true;
				this.canvasObj=null;//is set to canvas1
				this.ctx=null;
				this.transforms=[];
				this.width=640;
				this.height=360;
				this.scale=1;
				this.center=[this.width/2,this.height/2];
				if(Math.Vector2){this.center=new Math.Vector2(this.center);}
			}
			Text({x=0,y=0,text,font="sans-serif",size=10,color="white",align="center"}){
				return function printText(){
					ctx.font=size+"px "+font;
					ctx.fillStyle=color;
					ctx.textAlign=align;
					ctx.fillText(text,x,y);
				};
			}
			circle(x,y,size,colour){	
				ctx.fillStyle = colour;//green
				ctx.lineWidth = 0;
				if(this.circles){
					ctx.beginPath();
					ctx.arc(x,y,size,0,2*Math.PI);
					ctx.fill();
					ctx.closePath();
				}
				else{
					ctx.fillRect(x-size,y-size,size*2,size*2);
				}
			}
			square(x,y,size,colour){	
				ctx.fillStyle = colour;//green
				ctx.lineWidth = 0;
				ctx.fillRect(x-size,y-size,size*2,size*2);
			}
			line(x1,y1,x2,y2,size,colour){
				ctx.beginPath();
				ctx.strokeStyle = colour;//darkGreen
				ctx.moveTo(x1,y1);
				ctx.lineWidth = size;
				ctx.lineTo(x2,y2);
				ctx.stroke();
			}
			clear(){
				ctx.fillStyle = "black";//"lightGrey";
				ctx.fillRect(0,0,this.canvasObj.width/this.scale,this.canvasObj.height/this.scale);//ctx.fillRect(0,0,2500,2500);
				ctx.fillStyle = "green";
			}
			hexidecimal(decimal){
				var hex=["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F"];
				return(hex[(decimal/16)|0]+hex[(decimal|0)%16]);
			}
			hslaColour(h,s,l,a){
				return("hsla("+(360*h|0)+","+(100*s|0)+"%,"+(100*l|0)+"%,"+a+")");
			}
			hslColour(h,s,l){
				return("hsl("+(360*h|0)+","+(100*s|0)+"%,"+(100*l|0)+"%)");
			}
			start(){
				document.body.style="margin:0"
				let text1=document.createElement("P");
				text1.id="text1";
				text1.style="margin:0";
				//text1.innerText=;
				//document.body.appendChild(text1);
				var canvas = document.createElement("CANVAS");
				canvas.width=window.innerWidth;//"1140"//"1350";
				canvas.height=window.innerHeight;//-24//"620"//"620";
				canvas.id="canvas1";
				document.bgColor="#0E0E0E";
				document.body.appendChild(canvas);
				window.ctx = canvas.getContext("2d");
				this.canvasObj=canvas;
				this.ctx=ctx;
				window.onresize=function(){
					Draw.canvasObj.width=window.innerWidth-10;
					Draw.canvasObj.height=window.innerHeight-10;
					Draw.scale=Math.min(Draw.canvasObj.width/640,Draw.canvasObj.height/360);
					ctx.scale(Draw.scale,Draw.scale);
				}
				window.onresize();
			}
		};
		this.Inputs=class InputsClass{
			constructor(htmlObject){
				this.Mouse=class{
					constructor(){
						this.x=0;
						this.y=0;
						this.isDownVal=false;
						this.onDown=false;
						this.onUp=false;
					}
					get vec2(){
						return [this.x,this.y];
					}
					get down(){return this.isDownVal}
					set down(value){
						if(value!=this.isDownVal){
							if(value)this.onDown=true;
							else this.onUp=true;
							this.isDownVal=value;
						}
					}
				};
				this.Key=class Key{
					constructor({downVal=false,onDown=false,onUp=false}={downVal:false,onDown:false,onUp:false}){
						this.downVal=downVal;
						this.onDown=onDown;
						this.onUp=onUp;
					}
					get down(){return this.downVal;}
					set down(value){
						if(value!=this.downVal){
							if(value)this.onDown=true;
							else this.onUp=true;
							this.downVal=value;
						}
					}
					clone(){
						this.downVal=downVal;
						this.onDown=onDown;
						this.onUp=onUp;
					}
				};
				this.keys={//note: keys is like new Map()
					current:false,
					//will contain other keys
				};
				this.mouse=new this.Mouse();
				//note: to do: add more features to Joysticks
				this.MovementKeys;{
					let inputsObj=window.Inputs??this;
					this.MovementKeys=class Joystick extends this.Key{
						constructor(...keys){
							super();
							this.keys=keys.map(v=>inputsObj.getKey(v));
							//this.keyNames=[...keys];
						}
						//vec2Val=Math.vec2(0,0);
						get vec2(){
							return Math.vec2(this.keys[3].down-this.keys[1].down,-(this.keys[0].down-this.keys[2].down));
						}
						get down(){
							return this.keys[3].down||this.keys[1].down||this.keys[0].down||this.keys[2].down;
						}
						static [0]=new this('KeyW','KeyA','KeyS','KeyD');
						static [1]=new this('ArrowUp','ArrowLeft','ArrowDown','ArrowRight');
						static [2]=Object.defineProperties(
							new this('KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowLeft','ArrowDown','ArrowRight'),
							{vec2:{get(){
								return Math.vec2((this.keys[3].down||this.keys[7].down)-(this.keys[1].down||this.keys[5].down),-((this.keys[0].down||this.keys[4].down)-(this.keys[2].down||this.keys[6].down)));
							}},down:{get(){
								return this.keys[3].down||this.keys[1].down||this.keys[0].down||this.keys[2].down||this.keys[7].down||this.keys[5].down||this.keys[4].down||this.keys[6].down;
							}}}
						);
					};
				}
				this.keys.KeysWASD=this.MovementKeys[0];
				this.keys.KeysArrow=this.MovementKeys[1];
				this.keys.KeysBoth=this.MovementKeys[2];
				this.htmlObject=htmlObject;//canvas
			}
			start(htmlObject=this.htmlObject){
				this.htmlObject=htmlObject;//htmlObject=canvas
				let windowFunctions={
					keydown:(event)=>{
						let key=event.key;
						if(key.length==1)key=key.toLowerCase();
						if(key in this.keys){
							this.keys.current=key;
							this.keys[key].down=true;
						}
						if(event.code in this.keys){
							this.keys.current=event.key;
							this.keys[event.code].down=true;
						}
					},
					keyup:(event)=>{
						if(event.key in this.keys)
						this.keys[event.key].down=false;
						if(event.code in this.keys)
						this.keys[event.code].down=false;
					},
				};
				let functions={
					mousemove:(event)=>{
						this.mouse.x=event.clientX/Draw.scale;
						this.mouse.y=event.clientY/Draw.scale;
					},
					mousedown:(event)=>{
						this.mouse.down=true;
					},
					mouseup:(event)=>{
						this.mouse.down=false;
					},
				};
				for(let i in functions){
					htmlObject.addEventListener(i,functions[i],true);
				}
				for(let i in windowFunctions){
					window.addEventListener(i,windowFunctions[i],true);
				}
			}
			getKey(keyCode){
				return (this.newKey(keyCode));
			}
			newKey(keyCode){
				if(!(keyCode in this.keys)){
					this.keys[keyCode]=new this.Key();
				}
				return this.keys[keyCode];
			}
		};
		this.Time=class Time{
			constructor(){
				this.delta=1/60;//in seconds note: (change in time)
				this.start=this.real;//note: t.start = time when startLoop was called
			}
			get real(){//in seconds
				return (new Date()).getTime()/1000;
			}
			startLoop(){
				let endTime=this.real;
				if(endTime-this.start>0)this.delta=(endTime-this.start);
				this.start=endTime;
			}
		};
		this.Fps=class Fps{
			constructor(){
				this.fps=0;
				this.fpsCount=0;
			}
			start(){
				var startTime = (new Date()).getTime();
				var time = 0;
				this.fps = 0;
				this.fpsCount = 0;
				setInterval(()=>{
					this.fpsCount++;
					time = (new Date()).getTime()-startTime;
					if (time>1000){
						//text1.innerText=fps;
						this.fps = Math.floor(this.fpsCount*1000/time);
						this.fpsCount = 0;
						startTime= (new Date()).getTime();
					}
				},0.1);
			}
		};
		this.AsyncLoop=class AsyncLoop{
			updateOrder=[];
			constructor(){
				this.orderLength=1;
				this.frameId=0;
				this.i=0;
				this.endLoop=false;
			}
			mainLoop(){
				if(!this.endLoop){
					this.orderLength=this.updateOrder.length;
					for (this.i=0;this.i<this.orderLength&&this.i<this.updateOrder.length;this.i++) {
						this.updateOrder[this.i].onUpdate();
					}
				}
			}
			async gameLoop(){
				while(!this.endLoop){
					let loopPromise=new Promise((resolve)=>{
						this.frameId=window.requestAnimationFrame(()=>{
							this.mainLoop();
							resolve();
						});
					});
					await loopPromise;
				}
			}
			start(){
				this.endLoop=false;
				this.gameLoop();//this.frameId=window.requestAnimationFrame(this.mainLoop);
			}
			end(onEnd){
				onEnd??=()=>{};
				window.cancelAnimationFrame(this.frameId);
				this.endLoop=true;
				window.requestAnimationFrame(()=>{
					Draw.clear();
					onEnd();
				});
			}
		};
	}
}
(new IOEngine()).start();
//if(document.body){(new IOEngine()).start();}
//else document.onload=function(){(new IOEngine()).start();}
}