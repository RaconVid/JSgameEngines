{

	var simSprite={
		doStep(){
			let p=simSprite.parts;
			let dx=0.01;
			let p1=[...p];
			p=p.map(v=>Math.max(0,v)*(1+0*(Math.random()*2-1))|0);
			let a=0.1;

			p1[0]+=dx*((+p[1]-p[2]))* (1-0.8*(p[0]/(a+Math.abs(p[0])))**2);
			p1[1]+=dx*((+p[2]-p[0]))* (1-0.8*(p[1]/(a+Math.abs(p[1])))**2);
			p1[2]+=dx*((+p[0]-p[1]))* (1-0.8*(p[2]/(a+Math.abs(p[2])))**2);
			simSprite.parts=p1;
		},
		parts:[9,8,8],
		script:new MainGame.UpdateScript(l=>l.draw[9],function(l,s){
			for(let i=0;i<1000;i++){simSprite.doStep();}
			let parts=simSprite.parts;
			let i=0;
			ctx.save();
			ctx.translate(40,180);
			for(let i1 in parts){
				let a=parts[i1];
				ctx.fillStyle="blue";
				let h=a*10;
				ctx.fillRect(0,-h,10,h);
				ctx.translate(20,0);
				i++;
			}
			ctx.restore();
		}),
	};
}