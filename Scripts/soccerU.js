const Engine=Matter.Engine;
const World=Matter.World;
const Bodies = Matter.Bodies;
const Body = Matter.Body;
const Constraint = Matter.Constraint;
var obj1Move=null;
var obj2Move=null;
var obj1Angle=null;
var obj2Angle=null;
var gameState="play";
var chain;

let blueWins =0;
let greenWins = 0;

var engine = Engine.create();
var world = engine.world;
var obj, obj2, ground, wallLeft, wallRight, ceiling, ball;
const ballsize = 40;
var objwidth=40; var objlength=40;
var obj2width=40; var obj2length=40;
var previousObj1Angle;
var Xspeed=0.6; var turnSpeed=Math.PI/8; var Yspeed=2.4;
var baseXspeed=3; var baseYspeed=3;
world.gravity.y=4.0; //4.0
const restitution = 0.9;//1.1
const friction = 0.0;
const groundwidth=8000;
const groundheight=1000;
const ceilingwidth=8000
const ceilingheight=1000;
let inertia1=0;
let inertia2=0;
let winnerMessage;


function boxSetMove(e) {
  if(e.key=="a"||e.key=="A"){
    obj1Move="left";
  } else if (e.key == "d"||e.key=="D") {
    obj1Move="right";
  } if (e.key == "w"||e.key=="W") {
    obj1Angle="up";
  } else if (e.key=="s"||e.key=="S") {
    if(obj1Angle!="down"){
     inertia1=obj.inertia;
        }
     obj1Angle="down";
  }
  if(e.key=="ArrowLeft"){
    obj2Move="left"
  } else if(e.key=="ArrowRight") {
    obj2Move="right";
  } if(e.key=="ArrowUp") {
    obj2Angle="up";
  } else if (e.key=="ArrowDown") {
    if(obj2Angle!="down"){
     inertia2=obj2.inertia;
        }
    obj2Angle="down";
  }
}
function boxUnsetMove(e) {
  if((e.key=="a"||e.key=="A") && obj1Move=="left"){
    obj1Move=null;
  } else if ((e.key == "d"||e.key=="D") && obj1Move=="right") {
    obj1Move=null;
  } if ((e.key == "w"||e.key=="W") && obj1Angle=="up") {
    obj1Angle=null;
  } else if ((e.key=="s"||e.key=="S") && obj1Angle=="down") {
    obj1Angle=null;
      Body.setStatic(obj, false); obj.restitution=restitution;
      obj.friction=friction; Body.setDensity(obj,0.001);  Body.setInertia(obj, inertia1);
  }
  if(e.key=="ArrowLeft" && obj2Move=="left"){
    obj2Move=null;
  } else if(e.key=="ArrowRight" && obj2Move=="right") {
    obj2Move=null;
  } if(e.key=="ArrowUp" && obj2Angle=="up") {
    obj2Angle=null;
  } else if (e.key=="ArrowDown" && obj2Angle=="down") {
    obj2Angle=null;
    Body.setStatic(obj2, false); obj2.restitution=restitution;
    obj2.friction=friction; Body.setDensity(obj2,0.001);  Body.setInertia(obj2, inertia2);
  }
}
function boxMove() {
  if(obj1Move=="left"){
    Body.setVelocity(obj, {x:obj.velocity.x-Xspeed, y: obj.velocity.y});
//    Body.setVelocity(obj, {x:0-baseXspeed-Xspeed, y: obj.velocity.y});
  } else if (obj1Move == "right") {
    Body.setVelocity(obj, {x:obj.velocity.x+Xspeed, y: obj.velocity.y});
//    Body.setVelocity(obj, {x:baseXspeed+Xspeed, y: obj.velocity.y});
  } if (obj1Angle == "up") {
    Body.setAngularVelocity(obj, turnSpeed);
    Body.setVelocity(obj, {x:obj.velocity.x, y: obj.velocity.y-Yspeed});
  } else if (obj1Angle=="down") {
    Body.setStatic(obj, true);
  }
  if(obj2Move=="left"){
    Body.setVelocity(obj2, {x:obj2.velocity.x-Xspeed, y: obj2.velocity.y});
//    Body.setVelocity(obj2, {x:0-baseXspeed-Xspeed, y: obj2.velocity.y});
  } else if(obj2Move=="right") {
    Body.setVelocity(obj2, {x:obj2.velocity.x+Xspeed, y: obj2.velocity.y});
//    Body.setVelocity(obj2, {x:baseXspeed+Xspeed, y: obj2.velocity.y});
  } if(obj2Angle=="up") {
    Body.setAngularVelocity(obj2, -turnSpeed);
    Body.setVelocity(obj2, {x:obj2.velocity.x, y: obj2.velocity.y-Yspeed});
  } else if (obj2Angle=="down") {
    Body.setStatic(obj2, true);
  }
}
window.addEventListener("keydown", boxSetMove);
window.addEventListener("keyup", boxUnsetMove);


function setup() {
  createCanvas(800,400);
  angleMode(RADIANS);

//  wallLeft = Bodies.rectangle(-60,200,200,800, {isStatic:true});
//  wallRight = Bodies.rectangle(860,200,200,800, {isStatic:true});
  ceiling = Bodies.rectangle(400,40-(ceilingheight/2),ceilingwidth,ceilingheight, {isStatic:true});
  ground = Bodies.rectangle(400, 360+(groundheight/2), groundwidth, groundheight, {isStatic:true, restitution:200});
//  World.add(world, [wallLeft, wallRight]);
  World.add(world, [ground,ceiling]);

  obj=Bodies.rectangle(100,100,objwidth,objlength, {restitution:restitution, friction:friction});
  World.add(world, obj);
  obj2 = Bodies.rectangle(700,100,obj2width,obj2length, {restitution:restitution, friction:friction});
  World.add(world, obj2);

  ball = Bodies.circle(400,300,ballsize,{restitution:0.95,friction:1.9});
  World.add(world, ball);
  Body.setDensity(ball,0.00043);
/*  chain = Constraint.create({
	bodyA: obj,
	bodyB: obj2,
	length: 300,
        stiffness: 0.005
})
  World.add(world, chain);  */



    obj1Move=null;
    obj1Angle=null;
    obj2Move=null;
    obj2Angle=null;
    winnerMessage="";
}

function reset(e) { if(e.key==" "){if(gameState=="over"){
	World.remove(world, obj);
	World.remove(world, obj2);
	World.remove(world, ball);
	World.remove(world, ceiling);
	World.remove(world, ground);
	gameState="play";
	setup();
}}}
window.addEventListener("keydown",reset);



function draw() {
  background(0);

  Engine.update(engine);


  boxMove();

if(obj.position.y<-20){Body.setPosition(obj, {x:obj.position.x,y:60});        }
if(obj.position.y>820){Body.setPosition(obj, {x:obj.position.x,y:700});       }
if(obj2.position.y<-20){Body.setPosition(obj2, {x:obj2.position.x,y:60});     }
if(obj2.position.y>820){Body.setPosition(obj2, {x:obj2.position.x,y:700});    }
if(ball.position.y<-20){Body.setPosition(ball, {x:ball.position.x,y:60});     }
if(ball.position.y>820){Body.setPosition(ball, {x:ball.position.x,y:700});    }
var loss=0.00000000000000000000000001
if(obj.position.x<0-objwidth) {Body.setPosition(obj, {x:820+objwidth, y:obj.position.y});       Body.setVelocity(obj, {x:obj.velocity.x*loss, y: obj.velocity.y});}
if(obj2.position.x<0-objwidth) { Body.setPosition(obj2, {x:820+obj2width, y:obj2.position.y});       Body.setVelocity(obj2, {x:obj2.velocity.x*loss, y: obj.velocity.y});}
if(obj.position.x>820+obj2width) { Body.setPosition(obj, {x:0-objwidth, y:obj.position.y});       Body.setVelocity(obj, {x:obj.velocity.x*loss, y: obj.velocity.y});}
if(obj2.position.x>820+obj2width) { Body.setPosition(obj2, {x:0-obj2width, y:obj2.position.y});       Body.setVelocity(obj2, {x:obj2.velocity.x*loss, y: obj.velocity.y});}
Body.applyForce(ball, {x:ball.position.x, y:ball.position.y}, {x:0,y:-0.005-ball.position.y/100000});


  drawSquares();


  if(ball.position.x<-20&&gameState=="play"){winnerMessage="Blue Wins"; gameState="over"; blueWins++;}
  if(ball.position.x>820&&gameState=="play"){winnerMessage="Green Wins"; gameState="over"; greenWins++;}

/*  push();
  stroke("yellow");
  strokeWeight(3)
  line(obj.position.x, obj.position.y, obj2.position.x, obj2.position.y);
  pop();
*/



	textSize(50);
	fill(250,250,250);
	text(greenWins+", "+blueWins, 0, 80);

}
function drawSquares() {
  rectMode(CENTER);
    rect(ground.position.x,ground.position.y,groundwidth,groundheight);
  //  rect(wallRight.position.x, wallRight.position.y,200,800);
  //  rect(wallLeft.position.x,wallLeft.position.y,200,800);
    rect(ceiling.position.x,ceiling.position.y,ceilingwidth,ceilingheight);

    push();
    translate(ball.position.x, ball.position.y);
    rotate(ball.angle);
    fill(255,0,0);
    circle(0,0,ballsize*2);
    pop();

  push();
  translate(obj2.position.x, obj2.position.y);
  rotate(obj2.angle);
  fill(0,0,255);
  rectMode(CENTER);
  rect(0,0,obj2width,obj2length);
  pop();



  push();
  translate(obj.position.x, obj.position.y);
  rotate(obj.angle);
  fill(0,255,0);
  rectMode(CENTER);
  rect(0, 0, objwidth, objlength);
  pop();

  push();
  textSize(50);
  fill(250,250,250);
  text(winnerMessage,200,200);
  pop();
if(gameState=="over"){
  push();
  textSize(30);
  text
  pop();
}
}
