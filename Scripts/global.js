let gameState = "menu"; //menu, scored, play, controls, controlsChange, variants
let logo; //Logo is 57*11 pixels

//Handling Menu
function preload() {
	logo = document.getElementById("gameLogo");
}

let menuSelection = 0;
let menuEvents = [
	function(){reset(); gameState = "play";},//for playing the game 
	function(){gameState = "controls";controlsSelection = 0;}, //for going to controls
	function(){gameState = "variants"; controlsSelection = 0;} //for selecting a variant
]
function drawMenu() {
	//To get past CORS
	document.getElementById("defaultCanvas0").getContext("2d").drawImage(logo, 143,40,513,99);
	push();
		textSize(60);
		fill(255,255,255);
		textAlign(CENTER);
		text(">".repeat(menuSelection==0?1:0) + "PLAY GAME" + "<".repeat(menuSelection==0?1:0), 400, 200);
		text(">".repeat(menuSelection==1?1:0) + "CONTROLS" + "<".repeat(menuSelection==1?1:0), 400, 270);
		text(">".repeat(menuSelection==2?1:0) + "VARIANTS" + "<".repeat(menuSelection==2?1:0), 400, 340);
	pop();
}
let controlsSelection = 0;


//Handling Variants
let variantsList = [
	"Classic Game",
	"Rectangles",
	"Balls of Steel",
	"Low Gravity",
	"Manic",
	"Pong",
	"Bouncy Castle"
]
function drawVariants() {
	push();
		textSize(50);
		fill(255);
		textAlign(LEFT, CENTER);
		text(variantsList[controlsSelection], 360, 210);
		textSize(40);
		text(variantsList[(controlsSelection-1+variantsList.length)%variantsList.length], 320, 140);
		text(variantsList[(controlsSelection+1)%variantsList.length], 320, 280);
	pop();

}
function selectVariant() {
	variantsData["Classic Game"]();
	variantsData[variantsList[controlsSelection]]();
	reset();
}


//Handling Changing Controls
function drawControls() {
	var key = Object.keys(inputKeys)[controlsSelection];
	push();
		fill(255,255,255);
		rect(0,0,120,80);
		fill(0,0,0);
		textSize(20);
		textAlign(CENTER);
		text("esc",30,25);
	pop();
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
		fill(255,255,255);
		rect(0,0,120,80);
		fill(0,0,0);
		textSize(20);
		textAlign(CENTER);
		text("esc",30,25);
	pop();
	push();
		textSize(40);
		fill(200,200,200);
		textAlign(RIGHT);
		text(formatKey(key), 400,220);;
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
	if(key == "Enter" || key == "Escape" || key==" ") {return false;}
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
	World.remove(world, wallLeft); 
	World.remove(world, wallRight); 
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
	else if(gameState == "gameend") {
		if(e.key==" "){reset(); gameState="menu"; blueWins = 0; greenWins = 0;}
	}
	else if(gameState == "play"){
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
	else if(gameState == "menu") {
		if(e.key == "ArrowDown") {menuSelection = (menuSelection + 1) % menuEvents.length}
		if(e.key == "ArrowUp") {menuSelection = (menuSelection - 1 + menuEvents.length) % menuEvents.length}
	}
	else if(gameState == "controls"){
		if(e.key == "ArrowDown") {controlsSelection = (controlsSelection + 1) % Object.keys(inputKeys).length; }
		if(e.key == "ArrowUp") {controlsSelection = (controlsSelection + Object.keys(inputKeys).length - 1) % Object.keys(inputKeys).length; }
		if(e.key == "Enter" || e.key==" ") {gameState = "controlsChange";}
	}
	else if(gameState == "variants"){
		if(e.key == "ArrowDown") {controlsSelection = (controlsSelection + 1) % variantsList.length; }
		if(e.key == "ArrowUp") {controlsSelection = (controlsSelection + variantsList.length - 1) % variantsList.length; }
	}
}
function handleKeyUp(e) {
	if(gameState == "play"){
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
	else if(gameState == "menu") {
		if(e.key == "Enter" || e.key == " ") {menuEvents[menuSelection]();}
	}
	else if (gameState == "variants") {
		if(e.key == "Enter") {selectVariant(controlsSelection); menuSelection = 0; gameState = "menu";}
	}
	else if (gameState == "controls") {
		if(e.key == "Escape") {menuSelection = 0; gameState = "menu";}
	}
	else if (gameState == "controlsChange") {
		if(keyPermissibleAsControl(e.key)) {
			inputKeys[Object.keys(inputKeys)[controlsSelection]] = e.key.toUpperCase(); gameState = "controls";
		}
	}
}




//Handle gameend
function gameScore() {
	gameState = "scored";
	if(greenWins>=goalsTarget) {gameWin(0);}
	if(blueWins>=goalsTarget) {gameWin(1);}
}
function gameWin(winningColor) {
	gameState = "gameend";
	winnerMessage = (winningColor == 0 ? "GREEN" : "BLUE") + " WINS THE GAME!! Press Space";
}