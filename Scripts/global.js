let gameState = "menu"; //menu, scored, play
let logo; //Logo is 57*11 pixels

//Handling Menu
function preload() {
	logo = document.getElementById("gameLogo");
}

let menuSelection = 0;
let menuEvents = [
	function(){reset(); gameState = "play";},//for playing the game 
	function(){gameState = "controls";controlsSelection = 0;}, //for going to controls
]
function drawMenu() {
	//To get past CORS
	document.getElementById("defaultCanvas0").getContext("2d").drawImage(logo, 143,40,513,99);
	push();
		textSize(80);
		fill(255,255,255);
		textAlign(CENTER);
		text(">".repeat(menuSelection==0?1:0) + "PLAY GAME" + "<".repeat(menuSelection==0?1:0), 400, 220);
		text(">".repeat(menuSelection==1?1:0) + "CONTROLS" + "<".repeat(menuSelection==1?1:0), 400, 320);
	pop();
}

let controlsSelection = 0;
function drawControls() {
	var key = Object.keys(inputKeys)[controlsSelection];
	push();
		textSize(40);
		fill(200,200,200);
		textAlign(RIGHT);
		text(formatKey(key), 400,220);;
		textAlign(CENTER)
		rectMode(CENTER);
		rect(500,180,120,120);
		fill(225,225,225)
		textSize(30);
		textAlign(CENTER)
		fill(0,0,0)
		text(formatKeyValue(inputKeys[key].toUpperCase()), 500,195)
	pop();
}
let controlsChangeAnimationFrame = 0;
function drawControlsChange() {
	var key = Object.keys(inputKeys)[controlsSelection];
	controlsChangeAnimationFrame = (controlsChangeAnimationFrame + 1) % 90;
	push();
		textSize(40);
		fill(200,200,200);
		textAlign(RIGHT);
		text(formatKeyValue(key), 400,220);;
		fill(`rgba(200, 200, 200, ${Math.sin(((controlsChangeAnimationFrame + 45) * Math.PI / 180))})`);
		rectMode(CENTER);
		rect(500,180,120,120);
	pop();
}

function formatKeyValue(value) {
	switch(value) {
		case "ARROWDOWN": return "↓";
		case "ARROWUP": return "↑";
		case "ARROWLEFT": return "←";
		case "ARROWRIGHT": return "→";
		default: return value;
	}
}
function keyPermissibleAsControl(key) {
	if(key == "Enter" || key == "Escape") {return false;}
	for(inputKey in Object.keys(inputKeys)) {
		if(inputKey != controlsSelection && inputKeys[Object.keys(inputKeys)[inputKey]].toUpperCase() == key.toUpperCase()) {return false;}
	}
	return true;
}
function formatKey(key) {
	return ((key.charAt(key.length-1)=="1" ? "Green ":"Blue ")+(key.substring(0, key.length-1))).toUpperCase();
}

//Handing Gameplay
window.addEventListener("keydown",handleKeyDown);
window.addEventListener("keyup",handleKeyUp);

function reset(e) {
	World.remove(world, obj);
	World.remove(world, obj2);
	World.remove(world, ball);
	World.remove(world, ceiling);
	World.remove(world, ground); 
	setup();
}


//Inpuit Handling
let player1Inputs = {
	direction: "none",
	up: false,
	down: false
}
let player2Inputs = {
	direction: "none",
	up: false,
	down: false
}
let inputKeys = {
	left1 : "A",
	right1: "D",
	up1: "W",
	down1: "S",
	left2: "ArrowLeft",
	right2: "ArrowRight",
	up2: "ArrowUp",
	down2: "ArrowDown"

}
function handleKeyDown(e){
	if(gameState == "scored") {
		if(e.key==" "){reset(); gameState="play";}
	}
	if(gameState == "play"){
		//Player 1
		if(e.key.toUpperCase() == inputKeys.left1.toUpperCase()) {player1Inputs.direction = "left";}
		if(e.key.toUpperCase() == inputKeys.up1.toUpperCase()) {player1Inputs.up = true;}
		if(e.key.toUpperCase() == inputKeys.right1.toUpperCase()) {player1Inputs.direction = "right";}
		if(e.key.toUpperCase() == inputKeys.down1.toUpperCase()) {player1Inputs.down = true;}
		//Player 2
		if(e.key.toUpperCase() == inputKeys.left2.toUpperCase()) {player2Inputs.direction = "left";}
		if(e.key.toUpperCase() == inputKeys.up2.toUpperCase()) {player2Inputs.up = true;}
		if(e.key.toUpperCase() == inputKeys.right2.toUpperCase()) {player2Inputs.direction = "right";}
		if(e.key.toUpperCase() == inputKeys.down2.toUpperCase()) {player2Inputs.down = true;}
	}
	if(gameState=="menu") {
		if(e.key == "ArrowDown") {menuSelection = (menuSelection + 1) % menuEvents.length}
		if(e.key == "ArrowUp") {menuSelection = (menuSelection - 1 + menuEvents.length) % menuEvents.length}
	}
	if(gameState=="controls"){
		if(e.key == "ArrowDown") {controlsSelection = (controlsSelection + 1) % Object.keys(inputKeys).length; }
		if(e.key == "ArrowUp") {controlsSelection = (controlsSelection + Object.keys(inputKeys).length - 1) % Object.keys(inputKeys).length; }
		if(e.key == "Enter") {gameState = "controlsChange";}
	}
}
function handleKeyUp(e) {
	if(gameState=="play"){
		//Player 1
		if(e.key.toUpperCase() == inputKeys.left1.toUpperCase() && player1Inputs.direction=="left") {player1Inputs.direction = "none";}
		if(e.key.toUpperCase() == inputKeys.up1.toUpperCase()) {player1Inputs.up = false;}
		if(e.key.toUpperCase() == inputKeys.right1.toUpperCase() && player1Inputs.direction=="right") {player1Inputs.direction = "none";}
		if(e.key.toUpperCase() == inputKeys.down1.toUpperCase()) {player1Inputs.down = false;}
		//Player 2
		if(e.key.toUpperCase() == inputKeys.left2.toUpperCase() && player2Inputs.direction=="left") {player2Inputs.direction = "none";}
		if(e.key.toUpperCase() == inputKeys.up2.toUpperCase()) {player2Inputs.up = false;}
		if(e.key.toUpperCase() == inputKeys.right2.toUpperCase() && player2Inputs.direction=="right") {player2Inputs.direction = "none";}
		if(e.key.toUpperCase() == inputKeys.down2.toUpperCase()) {player2Inputs.down = false;}
	}
	if(gameState=="menu") {
		if(e.key == "Enter") {menuEvents[menuSelection]();}
	}
	if (gameState == "controls") {
		if(e.key == "Escape") {menuSelection = 0; gameState = "menu";}
	}
	if (gameState == "controlsChange") {
		if(keyPermissibleAsControl(e.key)) {
			inputKeys[Object.keys(inputKeys)[controlsSelection]] = e.key.toUpperCase(); gameState = "controls";
		}
	}
}


