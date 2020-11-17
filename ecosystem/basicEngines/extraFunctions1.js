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
	if(obj instanceof Refference){
		return(obj);
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
class Refference{
	constructor(){}
}
loga=function(log="",alertText=""){
	console.log(log);alert(alertText);
}
//InjectClass()