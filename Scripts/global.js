function reset(e) { if(gameState=="over"){

	World.remove(world, obj);
	World.remove(world, obj2);
	World.remove(world, ball);
	World.remove(world, ceiling);
	World.remove(world, ground); 
	resetup();
}}
window.addEventListener("keydown",handleKey);
function handleKey(e){if(e.key==" "){reset();}}

window.addEventListener("keydown",reset);
function displayGameWin() {
	push();
  textSize(50);
  fill(250,250,250);
  text(winnerMessage,200,200);
  pop();
}
