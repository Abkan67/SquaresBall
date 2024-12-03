let gameState = "menu"; //menu, scored, play
let logo; //Logo is 57*11 pixels

//Handling Menu
function preload() {
	logo = new Image();
	logo.src = "assets/Logo.png";
}

let menuSelection = 0;
let menuEvents = [
	function(){reset(); gameState = "play";},//for playing the game 
	function(){gameState = "options";optionsSelection = 0;}, //for going to options
]
function drawMenu() {
	//To get past CORS
	document.getElementById("defaultCanvas0").getContext("2d").drawImage(logo, 143,40,513,99);
	push();
		textSize(80);
		fill(255,255,255);
		textAlign(CENTER);
		text(">".repeat(menuSelection==0?1:0) + "PLAY GAME" + "<".repeat(menuSelection==0?1:0), 400, 220);
		text(">".repeat(menuSelection==1?1:0) + "OPTIONS" + "<".repeat(menuSelection==1?1:0), 400, 320);
	pop();
}

let optionsSelection = 0;
function drawOptions() {
	var key = Object.keys(inputKeys)[optionsSelection];
	push();
		textSize(100);
		fill(200,200,200);
		textAlign(RIGHT);
		text(key, 400,220);
		rectMode()
		rect(400,220,80,80);
		fill(225,225,225);
		textAlign(LEFT)
		text(inputKeys[key], 400,220)
	pop();
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
		if(e.key == "Enter") {menuEvents[menuSelection]();}
	}
	if (gameState == "options") {
		if(e.key == "Escape") {menuSelection = 0; gameState = "menu";}
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
}


