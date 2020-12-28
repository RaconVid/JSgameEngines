JSON.list=function(object){
	let objs=[];//list of original objects
	let refs=[];//objs->index pointers (semi compiled)
	let index;
	const add=function(obj){
		index=objs.length;
		objs[index]=obj;
		refs[index]=({});
		return index;
	}
	let refIndex=index=>index;//"::"+index+"::";
	const addCaller=function(obj,currentTree,returnFunc){
		let o={
			obj:obj,
			currentTree:currentTree,
			returnFunc:returnFunc,
		};
		callBack.push(o);
	}
	const returnFuncGen=(objClone,i)=>v=>{objClone[i]=v;return v;};
	const cloneStep=function({obj,currentTree=[],returnFunc=v=>v}){
		trees.push(currentTree);
		let objClone,index,i,val;
		if(typeof obj == "function"){
			if(currentTree[currentTree.length-1]=="toJSON"){
				return obj;
			}
			return "("+obj+")";//"FUNCTION";//
		}
		if(typeof obj == "string"){
			return JSON.stringify(obj);
		}
		if(typeof obj !== "object"){
			return "("+obj+")";
		}
		if(obj === null)return "(null)";
		
		index=objs.indexOf(obj);
		if(index!=-1){
			return refIndex(index);
		}
		if(obj instanceof Array){
			index=add(obj);
			objClone=[];
			for(i=0; i<obj.length; i++){
				currentTree.push(i);
				addCaller(obj[i],currentTree.map(v=>v),returnFuncGen(objClone,i));//objClone[i]=cloneStep(obj[i]);
				currentTree.pop();
			}
			refs[index]=objClone;
			return refIndex(index);//return(objClone);
		}
		if(obj instanceof Object){
			index=add(obj);
			objClone={};
			for(i in obj){if(obj.hasOwnProperty(i))
				currentTree.push(i);
				addCaller(obj[i],currentTree.map(v=>v),returnFuncGen(objClone,i));//objClone[i]=cloneStep(obj[i]);
				currentTree.pop();
			}
			refs[index]=objClone;
			return refIndex(index);//return(objClone);
		}
	}
	let currentTree=[];
	let trees=[];
	let callBack=[{obj:object}];
	
	let obj2=[];
	for(let i=0;i<callBack.length;i++){
		callBack[i].returnFunc(obj2.push(cloneStep(callBack[i])));
	}
	return{
		objs:objs,
		refs:refs,
		obj2:obj2,
		trees:trees,
	};
	//eval("("+v+")")
	//JSON.stringify(JSON.list(mainGame).refs).length
	//JSON.list(mainGame).trees.map(v=>v.join(" ")).join("\n").length
};
