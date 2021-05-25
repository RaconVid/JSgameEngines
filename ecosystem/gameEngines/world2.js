class World{
	constructor(){
		;
	}
};
//do to: change "extends Set" to "Array"
World.Layer=class Layer extends Set{//Array{ //note:like Set but faster (uses normal for)
	constructor(){
		;
	}
	add(item){

	}
	delete(item){

	}
	forEach(eventName){
		for(let i of this)
	}
	attach(){}
	detach(){}
};

World.Sprite=class Sprite{
	constructor(){
		;
	}
};