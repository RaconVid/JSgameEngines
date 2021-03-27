# JSgameEngines

JSgames that use my JS gameEngine

## Documentation

To make things more compatible, none of the classes check objects using `if(objectA instanceof ClassA)`.

### Conventions

UpdateScript: contains function `obj.onUpdate()` and boolean `obj.isDeleting`

### Global constants

(in pseudo c++ header, ):
these are used in eco.js's scope.
```c++
Object Images;
const class IOEngine;
class Math.Vector2; //can be used instead of float[2]
Math::Vector2 Math.vec2(x,y);
const Space;
class Space.Sprite extends Space.Entity;
class Space.RelPos extends Space::Pos(Entity object,Space::Pos pos);
Space::Sprite Space.addSprite(Object newSpriteObj);	//extends AnySpriteObj into a Sprite.
class Space.Pos(Space::Pos pos);
struct Space.Pos{ Space::Chunk layer, float[2] vec, float[2][2] mat};
class Math.Vector2(...vec2Data);	//accepts many argument types (float,float)or(float[2])or(vec2)
Math.vec2(...vec2Data);	//same as Math.Vector2 but without new;
const Draw;

const IOEngine::Inputs Inputs;
Inputs.getKey(string keyBoardKeyName)//e.g. 

MainGame mainGame;	//can be changed to switch to e.g. a mini-game
Time mainGame.time;
float mainGame.time.delta;	//dt in seconds
float mainGame.time.start;	//normal game time : updates every gameloop
class mainGame.UpdateScript(ArrowFunction UpdateLayer getLayer(),Generator bool script());
class mainGame.UpdateScript(ArrowFunction UpdateLayer getLayer(),function script);
class mainGame.UpdateLayer;
```
unneaded globals?
```c++

object Clone (Object obj);
object CloneTo (Object data,Object refference);
class Space.Entity extends Space::RelPos();	// needs properties: delete, clone, goto, coords, velocity;
```