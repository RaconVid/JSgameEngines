{//19:16
window. DEBUG_UI=true;
window. TESTING=true;
{
	MainGame;Draw;ctx;Inputs;
	MainGame.layers={
		update:MainGame.mainLayers.update,
		draw:MainGame.mainLayers.draw,
		chunk:MainGame.mainLayers.chunk,
		physics:new MainGame.UpdateLayer(4),
	};
	MainGame.updateOrder=[
		MainGame.layers.update,
		MainGame.layers.physics,
		MainGame.layers.draw,
	];
}let mg=MainGame;

importJavascriptFromSrc(
	"game/setDebug.js"
);MainGame.start();
}