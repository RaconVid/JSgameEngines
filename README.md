# JSgameEngines

JavaScript games that use my JavaScript game engine

## Documentation

To make things more compatible, none of the classes check objects using `if(objectA instanceof ClassA)`.

### Conventions

UpdateScript: contains function `obj.onUpdate()` and boolean `obj.isDeleting`


### Global constants

These are used in `eco.js`'s scope. Note that `window.globalVariable` == `globalVariable`
(in pseudo c++ header, ):
```javascript
//IO engine (Input/Output)
window.MainGame;
window.Inputs;
window.Draw;
window.ctx;
```

### Version convention
version numbers are about how compatible a function/class it is with the privious version
e.g. `this.Script = function ScriptV_2_4(){}` has version V0.2.4
