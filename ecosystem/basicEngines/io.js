class IOEngine{
	start(){
		window.Draw=new this.Draw();
		window.Draw.start();
		window.Inputs=new this.Inputs(document.getElementById("canvas1"));
		window.Inputs.start();
		//window.fps=new this.Fps();
		//window.fps.start();
		window.Time=this.Time;
		//Draw.canvasObj.width=640;
		//Draw.canvasObj.height=360;
	}
	constructor(){
		this.Draw=class{
			constructor(){
				this.circles=true;
				this.htmlObject=null;
				this.ctx=null;
				this.transforms=[];
				this.width=640;
				this.height=360;
				this.scale=1;
			}
			transform(matrix_vec){
				ctx.translate(
					matrix_vec[2][0],
					matrix_vec[2][1],
				);
				ctx.transform(
					matrix_vec[0][0],
					matrix_vec[0][1],
					matrix_vec[1][0],
					matrix_vec[1][1],
					0,0,
				);
			}
			undoTransform(matrix_vec){
				ctx.transform(
					matrix_vec[1][1],
					-matrix_vec[0][1],
					-matrix_vec[1][0],
					matrix_vec[0][0],
					0,0,
				);
				ctx.translate(
					-matrix_vec[2][0],
					-matrix_vec[2][1],
				)
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
				return(hex[Math.floor(decimal/16)]+hex[Math.floor(decimal)%16]);
			}
			hslColour(h,s,l){//0
				return(
				 	"hsl("
					+Math.floor(360*h)+","
					+Math.floor(100*s)+"%,"
					+Math.floor(100*l)+"%)"
				);
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
		this.Inputs=class{
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
				this.Key=class{
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
				}
				this.mouse=new this.Mouse();
				this.keys={current:false};
				this.htmlObject=htmlObject;
			}
			start(htmlObject=this.htmlObject){
				this.htmlObject=htmlObject;
				let windowFunctions={
					keydown:(event)=>{
						if(event.key in this.keys){
							this.keys.current=event.key;
							this.keys[event.key].down=true;
						}
					},
					keyup:(event)=>{
						if(event.key in this.keys)
						this.keys[event.key].down=false;
					},
				};
				let functions={
					mousemove:(event)=>{
						this.mouse.x=event.clientX;
						this.mouse.y=event.clientY;
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
		this.Time=class{
			constructor(){
				this.delta=1/60;//in seconds
				this.start=this.real;
			}
			get real(){//in seconds
				return (new Date()).getTime()/1000;
			}
			startLoop(){
				let endTime=this.real;
				if(endTime-this.start>0)this.delta=Math.min(1/15,endTime-this.start);
				this.start=endTime;
			}
		};
		this.Fps=class{
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
	}
}

(new IOEngine()).start();