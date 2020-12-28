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
CloneTo=function(data,ref){//Clone data to existing object(i.e. "ref")
	//objA = obj
	//objb = objClone
	if(data === null || typeof data !== "object"){
		ref=data;
		return(data);
	}
	if(data instanceof Array){
		for(var i=0; i<data.length; i++){
			ref[i]=Clone(data[i]);
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
				ref[i]=Clone(data[i]);
			}
		}
		return(ref);
	}
}
//unfinnished
class Refference{
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