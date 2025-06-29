const Engine=Matter.Engine;
const World=Matter.World;
const Bodies = Matter.Bodies;
const Body = Matter.Body;
const Constraint = Matter.Constraint;

let blueWins = 0;
let greenWins = 0;
let obj1StaticTimer;
let obj2StaticTimer;
let gameendAnimationFrame = 0;
const goalsTarget = 5;

const engine = Engine.create();
const world = engine.world;
let obj, obj2, ground, wallLeft, wallRight, ceiling, ball;
let groundwidth=8000;
let groundheight=1000;
let ceilingwidth=8000
let ceilingheight=1000;
let winnerMessage;
let tempWindChangeWithY;
let windForce;

//Sizes (l, w, r) are 40
let ballsize = 40;
let objwidth=40; let objlength=40;
let obj2width=40; let obj2length=40;
let Xspeed=0.6; //0.6
let turnSpeed=Math.PI/8; //PI/8
let Yspeed=2.4; //2.4
world.gravity.y=4.0; //4.0
let restitution = 0.8;//1.1
let ballRestitution = 0.95;//0.95
let ballFriction = 30;//1.9
let friction = 0.00;//2.0
let ballDensity = 0.00043 * Math.pow(40/ballsize, 2);//0.00043
let blockDensity = 0.001 * 1600/(objwidth*objlength);//0.001
let loss=0;
let maxWindForce = 1.00 * world.gravity.y/4.0;
let minWindForce = 0.4;//0.4
let windForceReboundKValue = 1/12;
let windChangeWithY = 1.3;//1
let maxStaticTime = 100;//100
let wallsYDownSpeed = 1;//16
let blueSquareBlueValue = 255; let greenSquareGreenValue = 255;


const variantsData = {
  "Classic Game": function(){
    ballsize = 40;
    objwidth=40;  objlength=40;
    obj2width=40;  obj2length=40;
    Xspeed=0.6; //0.6
    turnSpeed=Math.PI/8; //PI/8
    Yspeed=2.4; //2.4
    world.gravity.y=4.0; //4.0
    restitution = 0.8;//1.1
    ballRestitution = 0.95;//0.95
    ballFriction = 30;//1.9
    friction = 0.00;//2.0
    ballDensity = 0.00043 * Math.pow(40/ballsize, 2);//0.00043
    blockDensity = 0.001 * 1600/(objwidth*objlength);//0.001
    loss=0;
    maxWindForce = 1.00 * world.gravity.y/4.0;
    minWindForce = 0.4;//0.4
    windForceReboundKValue = 1/12;
    windChangeWithY = 1.3;//1
    maxStaticTime = 100;//100
    wallsYDownSpeed = 1;//16
  },
  "Rectangles": function(){objwidth= 80; obj2width= 80;},
  "Balls of Steel": function(){ballDensity= 0.00086; ballRestitution= 1.1; maxWindForce = 2;},
  "Low Gravity": function(){world.gravity.y=0.8; maxWindForce = 0.8/4.0; restitution = 1.3; friction = 0.05; Yspeed = 1.5; turnSpeed = Math.PI/5.5;},
  "Manic": function() {turnSpeed = Math.PI/4; Xspeed = 0.8; Yspeed = 1.5; maxStaticTime = 200;},
  "Pong": function() {objwidth = 20; obj2width = 20; objlength = 100; obj2length = 100; ballsize = 20; ballDensity*=6; maxWindForce*=1.5; restitution = 0.4;},
  "Bouncy Castle": function() {restitution = 1.5; ballRestitution = 1.1; maxWindForce = 0.5; ballFriction = 0;}
}


function boxMove() {
  if (!obj.isStatic && player1Inputs.down && obj1StaticTimer>=0) {
    Body.setStatic(obj, true);
  } else if((!player1Inputs.down||obj1StaticTimer<0) && obj.isStatic) {
    Body.setStatic(obj, false); obj.restitution=restitution;
    obj.friction=friction; Body.setDensity(obj,blockDensity); Body.setVelocity(obj, {x: 0, y: 0});
  }
  if(obj.isStatic) {obj1StaticTimer--;}
  if(Matter.Collision.collides(ground,obj)) {obj1StaticTimer = maxStaticTime;}
  Matter.Events
  if(player1Inputs.up && !obj.isStatic){
    Body.setAngularVelocity(obj, turnSpeed);
    Body.setVelocity(obj, {x:obj.velocity.x, y: obj.velocity.y-Yspeed});
  }
  if (!player1Inputs.down) {
    if(player1Inputs.direction=="left"){
      Body.setVelocity(obj, {x:obj.velocity.x-Xspeed, y: obj.velocity.y});
    } 
    if (player1Inputs.direction == "right") {
      Body.setVelocity(obj, {x:obj.velocity.x+Xspeed, y: obj.velocity.y});
    } 
  }

  if (!obj2.isStatic && player2Inputs.down && obj2StaticTimer>=0) {
    Body.setStatic(obj2, true);
  } else if((!player2Inputs.down||obj2StaticTimer<0) && obj2.isStatic) {
    Body.setStatic(obj2, false); obj2.restitution=restitution;
    obj2.friction=friction; Body.setDensity(obj2,blockDensity); Body.setVelocity(obj2, {x: 0, y: 0});
  } 
  if(obj2.isStatic) {obj2StaticTimer--;}
  if(Matter.Collision.collides(ground,obj2)) {obj2StaticTimer = maxStaticTime;}
  if(player2Inputs.up && !obj2.isStatic){
    Body.setAngularVelocity(obj2, -turnSpeed);
    Body.setVelocity(obj2, {x:obj2.velocity.x, y: obj2.velocity.y-Yspeed});
  }
  if(!player2Inputs.down) {
    if(player2Inputs.direction=="left"){
      Body.setVelocity(obj2, {x:obj2.velocity.x-Xspeed, y: obj2.velocity.y});
    } else if(player2Inputs.direction=="right") {
      Body.setVelocity(obj2, {x:obj2.velocity.x+Xspeed, y: obj2.velocity.y});
    }
  }
}


function setup() {
  createCanvas(800,400);
  angleMode(RADIANS);

  //Adding Walls and Ceiling
  ceiling = Bodies.rectangle(400,40-(ceilingheight/2),ceilingwidth,ceilingheight, {isStatic:true});
  ground = Bodies.rectangle(400, 360+(groundheight/2), groundwidth, groundheight, {isStatic:true, restitution:200});
  wallLeft = Bodies.rectangle(-25,200, 80,320, {isStatic:true, restitution:2});
  wallRight = Bodies.rectangle(825,200, 80,320, {isStatic:true, restitution:2});
  World.add(world, [ground,ceiling, wallLeft,wallRight]);

  //Adding Blocks
  obj=Bodies.rectangle(100,100,objwidth,objlength, {restitution:restitution, friction:friction});
  World.add(world, obj);
  obj2 = Bodies.rectangle(700,100,obj2width,obj2length, {restitution:restitution, friction:friction});
  World.add(world, obj2);

  //Adding Ball
  ball = Bodies.circle(400,300,ballsize,{restitution:ballRestitution,friction:ballFriction});
  World.add(world, ball);
  Body.setDensity(ball,ballDensity);

  player1Inputs.direction="none"; player1Inputs.down=false; player1Inputs.up = false;
  player2Inputs.direction="none"; player2Inputs.down=false; player2Inputs.up = false;
  obj2StaticTimer = maxStaticTime;  obj1StaticTimer = maxStaticTime;


  winnerMessage="";
  tempWindChangeWithY = windChangeWithY + (Math.random()*0.4)-0.2;
  windForce = minWindForce;
}

function draw() {
  background(0);

  Engine.update(engine);

  if(gameState=="play") boxMove();

  if(obj.position.y<-20){Body.setPosition(obj, {x:obj.position.x,y:60});        }
  if(obj.position.y>820){Body.setPosition(obj, {x:obj.position.x,y:700});       }
  if(obj2.position.y<-20){Body.setPosition(obj2, {x:obj2.position.x,y:60});     }
  if(obj2.position.y>820){Body.setPosition(obj2, {x:obj2.position.x,y:700});    }
  if(ball.position.y<-20){Body.setPosition(ball, {x:ball.position.x,y:60});     }
  if(ball.position.y>820){Body.setPosition(ball, {x:ball.position.x,y:700});    }

  if(obj.position.x<0-objwidth) {Body.setPosition(obj, {x:820+objwidth/2, y:obj.position.y});       Body.setVelocity(obj, {x:obj.velocity.x*loss, y: obj.velocity.y});}
  if(obj2.position.x<0-objwidth) { Body.setPosition(obj2, {x:820+obj2width/2, y:obj2.position.y});       Body.setVelocity(obj2, {x:obj2.velocity.x*loss, y: obj.velocity.y});}
  if(obj.position.x>820+obj2width) { Body.setPosition(obj, {x:0-objwidth/2, y:obj.position.y});       Body.setVelocity(obj, {x:obj.velocity.x*loss, y: obj.velocity.y});}
  if(obj2.position.x>820+obj2width) { Body.setPosition(obj2, {x:0-obj2width/2, y:obj2.position.y});       Body.setVelocity(obj2, {x:obj2.velocity.x*loss, y: obj.velocity.y});}
  Body.applyForce(ball, {x:ball.position.x, y:ball.position.y}, {x:0,y:windForce*(-0.005 - Math.max(0,ball.position.y*tempWindChangeWithY/100000) )});

  windForce = windForce + windForceReboundKValue * windForce * (maxWindForce-windForce)

  drawSquares();

  if(ball.position.x<-20&&gameState=="play"){winnerMessage="Blue Scores! Press Space"; blueWins++; gameScore();}
  if(ball.position.x>820&&gameState=="play"){winnerMessage="Green Scores! Press Space"; greenWins++; gameScore();}

  push();
    textSize(50);
    fill(250,250,250);
    text(greenWins, 0, 80);
    textAlign(RIGHT)
    text(blueWins, 800, 80);
  pop();
    
  if(gameState=="menu") {drawMenu();}
  if(gameState=="controls") {drawControls();}
  if(gameState=="controlsChange") {drawControlsChange();}
  if(gameState=="variants") {drawVariants();}

}
function drawSquares() {
  //Draw ground and ceiling
  rectMode(CENTER);
  rect(ground.position.x,ground.position.y,groundwidth,groundheight);
  rect(ceiling.position.x,ceiling.position.y,ceilingwidth,ceilingheight);

  //Move Walls
  Body.setPosition(wallLeft,{x:wallLeft.position.x, y:wallLeft.position.y + wallsYDownSpeed});
  Body.setPosition(wallRight,{x:wallRight.position.x, y:wallRight.position.y + wallsYDownSpeed});

  rect(wallLeft.position.x,wallLeft.position.y,80,wallLeft.area/80);
  rect(wallRight.position.x,wallRight.position.y,80,wallRight.area/80);

  //Display Winner if Match is Scored or Game is Won
  push();
    textSize(50);
    fill(250,250,250);
    textAlign(CENTER);
    text(winnerMessage,300,200);
  pop();
  
  //Display Graphic for Winning Side
  if(gameState == "gameend") {
    push();
      translate(400,250);
      rotate(gameendAnimationFrame);
      fill(0,greenWins>=goalsTarget?255:0,blueWins>=goalsTarget?255:0);
      rectMode(CENTER);
      rect(0, 0, greenWins>=goalsTarget?objwidth:obj2width, greenWins>=goalsTarget?objlength:obj2length);
    pop();
    gameendAnimationFrame = (gameendAnimationFrame+9)%360;
    return;
  }


  //Draw Ball
  push();
    translate(ball.position.x, ball.position.y);
    rotate(ball.angle);
    fill(255,0,0);
    circle(0,0,ballsize*2);
  pop();

  //Draw Blue Square
  push();
    translate(obj2.position.x, obj2.position.y);
    rotate(obj2.angle);
    fill(`rgba(0,0,255,${(obj2StaticTimer+maxStaticTime)/(2*maxStaticTime)})`);
    rectMode(CENTER);
    rect(0,0,obj2width,obj2length);
  pop();

  //Draw Green Square
  push();
    translate(obj.position.x, obj.position.y);
    rotate(obj.angle);
    fill(`rgba(0,255,0,${(obj1StaticTimer+maxStaticTime)/(2*maxStaticTime)})`);
    rectMode(CENTER);
    rect(0, 0, objwidth, objlength);
  pop();

}