Clone=function(obj){
	var objClone;
	if(obj === null || typeof obj !== "object"){
		return(obj);
	}
	if(obj instanceof Array){
		objClone=[];
		for(var i=0; i<obj.length; i++){
			objClone[i]=Clone(obj[i]);
		}
		return(objClone);
	}
	if(obj instanceof Refference){//
		for(var i in obj){
			objClone[i]=obj[i];
		}
	}
	if(obj instanceof Object){
		objClone={};
		for(var i in obj){
			if(obj.hasOwnProperty(i)){
				objClone[i]=Clone(obj[i]);
			}
		}
		return(objClone);
	}
}
//Clone data to ref;
//Clone data from ref;
CloneTo=function(data,ref){//Clone data to existing object (i.e. "ref")
	//objA = obj
	//objb = objClone
	if(data === null || typeof data !== "object"){
		ref=data;
		return(data);
	}
	if(data instanceof Array){
		for(var i=0; i<data.length; i++){
			ref[i]=data[i];//Clone(data[i]);
		}
		if(ref instanceof Array){
			let len=ref.length-data.length;
			for(let i=0; i<len; i++){
				ref.pop();
			}
		}
		return(ref);
	}
	if(data instanceof Refference){
		for(var i in data){
			ref[i]=data[i];
		}
		return(ref);
	}
	if(data instanceof Object){
		for(var i in data){
			if(data.hasOwnProperty(i)){
				ref[i]=data[i];//Clone(data[i]);
			}
		}
		return(ref);
	}
}
/*Not my code
function getDesc (obj, prop) {
  var desc = Object.getOwnPropertyDescriptor(obj, prop);
  return desc || (obj=Object.getPrototypeOf(obj) ? getDesc(obj, prop) : void 0);
}
multiInherit=function(...protos) {
  return Object.create(new Proxy(Object.create(null), {
    has: (target, prop) => protos.some(obj => prop in obj),
    get (target, prop, receiver) {
      var obj = protos.find(obj => prop in obj);
      return obj ? Reflect.get(obj, prop, receiver) : void 0;
    },
    set (target, prop, value, receiver) {
      var obj = protos.find(obj => prop in obj);
      return Reflect.set(obj || Object.create(null), prop, value, receiver);
    },
    *enumerate (target) { yield* this.ownKeys(target); },
    ownKeys(target) {
      var hash = Object.create(null);
      for(var obj of protos) for(var p in obj) if(!hash[p]) hash[p] = true;
      return Object.getOwnPropertyNames(hash);
    },
    getOwnPropertyDescriptor(target, prop) {
      var obj = protos.find(obj => prop in obj);
      var desc = obj ? getDesc(obj, prop) : void 0;
      if(desc) desc.configurable = true;
      return desc;
    },
    preventExtensions: (target) => false,
    defineProperty: (target, prop, desc) => false,
  }));
}
*/
//unfinished
class Reference{
	constructor(obj){
		this.ref=obj;
	}
	get_ref(){}
	get ref(){}
	set ref(val){
		if(typeof val=="function"){
			this.get_ref=val;
		}
		else{
			this.get_ref=function(){return val;}
		}
	}
}
loga=function(log="",alertText=""){
	console.error(log);alert(alertText);
}
//InjectClass()
