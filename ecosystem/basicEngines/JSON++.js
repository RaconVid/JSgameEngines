"use strict";
//note:does not support proxy; proxy is very slow
JSON.list=function deReference(object,debugVars=false){
	let objs=[];//list of original objects
	let refs=[];//objs->index pointers (semi compiled)
	let index;
	const add=function(value){
		index=objs.length;
		objs[index]=value;
		refs[index]=({});
		return index;
	}
	let refIndex=index=>index;//"::"+index+"::";
	const addCaller=function(value,currentTree,returnFunc){
		let o={
			value:value,
			//name:"",
			//parent:null,
			currentTree:currentTree,
			returnFunc:returnFunc,
		};
		callBack.push(o);
	}
	const returnFuncGen=(objClone,i)=>v=>{objClone[i]=v;return v;};
	const cloneStep=function({value,currentTree=[]}){
		if(debugVars)trees.push(currentTree);
		let objClone,index,i;
		if(typeof value == "function"){
			if(currentTree[currentTree.length-1]=="toJSON"){
				return value;
			}
			return true?"("+value+")":"FUNCTION";
		}
		if(typeof value == "string"){
			return JSON.stringify(value);
		}
		if(value === null)return "(null)";
		if(typeof value == "symbol"){
			index=objs.indexOf(value);
			if(index!=-1){
				return refIndex(index);
			}else{
				index=add(value);
				return refIndex(index);
			}
		}
		if(typeof value !== "object"){
			return JSON.stringify(value);//"("+value+")";
		}
		index=objs.indexOf(value);
		if(index!=-1){
			return refIndex(index);
		}
		if("toJSON"in value){
			if(typeof value.toJSON=="function"){
				currentTree.push("toJSON()");
				value=value.toJSON();
			}
			else{
				currentTree.push("toJSON{}");
			}
		}
		if(value instanceof Object){
			index=add(value);
			if(value instanceof Array)objClone=[];
			else objClone={};
			for(i in value){if(value.hasOwnProperty(i)){
				currentTree.push(i);
				addCaller(value[i],currentTree.map(v=>v),returnFuncGen(objClone,i));//objClone[i]=cloneStep(value[i]);
				currentTree.pop();
			}}
			refs[index]=objClone;
			return refIndex(index);//return(objClone);
		}
	}
	let currentTree=[];
	let callBack=[];
	
	let trees=[];
	let obj2=[];
	obj2.push(cloneStep({value:object}));
	let value;
	for(let i=0,i1=0;i<callBack.length&&i*0<10000;i++){
		value=cloneStep(callBack[i]);
		callBack[i].returnFunc(value);
		if(debugVars)obj2.push(value);
		else {delete callBack[i];}
	}
	return (!debugVars)?refs:{
		objs,//list of different objects
		refs,//objs.compile (mainOutput)
		obj2,//list of all values
		trees,//unneeded
	};
	//eval("("+v+")")
	//JSON.stringify(JSON.list(mainGame).refs).length
	//JSON.list(mainGame).trees.map(v=>v.join(" ")).join("\n").length
};
JSON.parseList=function reReference(objectRefs){
	let object=[];
	for(let i=0;i<objectRefs.length;i++){
		for(let value in objectRefs[i]){
			if(typeof objectRefs[i][value]=="number"){
				objectRefs[i][value]=objectRefs[objectRefs[i][value]];
			}
			else if(typeof objectRefs[i][value]=="string"){
				if(objectRefs[i][value][0]=="("){//is funtion?
					let foo;
					let eval1=(globalEval??eval);
					let expression=objectRefs[i][value];
					try{
						foo=eval1(expression);
					}catch(error){
						try{
							foo=eval1("(function "+expression.substr(1));
						}catch(error){
							//console.log("(function "+expression.substr(1));
							//throw error;
							foo="FUNCTION";
						}
					}
					objectRefs[i][value]=foo;
				}
				else{
					window.things=objectRefs[i][value]
					objectRefs[i][value]=JSON.parse(objectRefs[i][value]);
				}
			}
		}
	}
	return objectRefs[0];
}
