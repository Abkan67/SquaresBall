const Engine=Matter.Engine;
const World=Matter.World;
const Bodies = Matter.Bodies;
const Body = Matter.Body;
const Constraint = Matter.Constraint;

let blueWins = 0;
let greenWins = 0;

const engine = Engine.create();
const world = engine.world;
let obj, obj2, ground, wallLeft, wallRight, ceiling, ball;
const groundwidth=8000;
const groundheight=1000;
const ceilingwidth=8000
const ceilingheight=1000;
let winnerMessage;

//Sizes (l, w, r) are 40
const ballsize = 25;
const objwidth=30; const objlength=30;
const obj2width=30; const obj2length=30;
const Xspeed=0.6; //0.6
const turnSpeed=Math.PI*1.5/8; //PI/8
const Yspeed=2.4; //2.4
world.gravity.y=4.0; //4.0
const restitution = 1.0;//1.1
const ballRestitution = 0.05;//0.95
const friction = 0.05;//2.0
const ballDensity = 0.00043  * Math.pow(40/ballsize, 2);//0.00043
const blockDensity = 0.001;//0.001
const loss=0.0;//0.0
const windForce = 1.45*world.gravity.y/4;//1
const windChangeWithY = 0.3;//1



function boxMove() {
  if (!obj.isStatic && player1Inputs.down) {
    Body.setStatic(obj, true);
  } else if(!player1Inputs.down && obj.isStatic) {
    Body.setStatic(obj, false); obj.restitution=restitution;
    obj.friction=friction; Body.setDensity(obj,blockDensity); Body.setVelocity(obj, {x: 0, y: 0});
  } 
  if(player1Inputs.up){
    Body.setAngularVelocity(obj, turnSpeed);
//    Body.setVelocity(obj, {x:obj.velocity.x, y: obj.velocity.y-Yspeed});
  }
  if (!player1Inputs.down) {
    if(player1Inputs.direction=="left"){
      Body.setVelocity(obj, {x:obj.velocity.x-Xspeed, y: obj.velocity.y});
    } 
    if (player1Inputs.direction == "right") {
      Body.setVelocity(obj, {x:obj.velocity.x+Xspeed, y: obj.velocity.y});
    } 
  }

  if (!obj2.isStatic && player2Inputs.down) {
    Body.setStatic(obj2, true);
  } else if(!player2Inputs.down && obj2.isStatic) {
    Body.setStatic(obj2, false); obj2.restitution=restitution;
    obj2.friction=friction; Body.setDensity(obj2,blockDensity); Body.setVelocity(obj2, {x: 0, y: 0});
  } 
  if(player2Inputs.up){
    Body.setAngularVelocity(obj2, -turnSpeed);
//    Body.setVelocity(obj2, {x:obj2.velocity.x, y: obj2.velocity.y-Yspeed});
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
  World.add(world, [ground,ceiling]);

  //Adding Blocks
  obj=Bodies.rectangle(100,100,objwidth,objlength, {restitution:restitution, friction:friction});
  World.add(world, obj);
  obj2 = Bodies.rectangle(700,100,obj2width,obj2length, {restitution:restitution, friction:friction});
  World.add(world, obj2);

  //Adding Ball
  ball = Bodies.circle(400,300,ballsize,{restitution:ballRestitution,friction:1.9});
  World.add(world, ball);
  Body.setDensity(ball,ballDensity);

  player1Inputs.direction="none"; player1Inputs.down=false; player1Inputs.up = false;
  player2Inputs.direction="none"; player2Inputs.down=false; player2Inputs.up = false;

  winnerMessage="";
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

  if(obj.position.x<0-objwidth) {Body.setPosition(obj, {x:820+objwidth, y:obj.position.y});       Body.setVelocity(obj, {x:obj.velocity.x*loss, y: obj.velocity.y});}
  if(obj2.position.x<0-objwidth) { Body.setPosition(obj2, {x:820+obj2width, y:obj2.position.y});       Body.setVelocity(obj2, {x:obj2.velocity.x*loss, y: obj.velocity.y});}
  if(obj.position.x>820+obj2width) { Body.setPosition(obj, {x:0-objwidth, y:obj.position.y});       Body.setVelocity(obj, {x:obj.velocity.x*loss, y: obj.velocity.y});}
  if(obj2.position.x>820+obj2width) { Body.setPosition(obj2, {x:0-obj2width, y:obj2.position.y});       Body.setVelocity(obj2, {x:obj2.velocity.x*loss, y: obj.velocity.y});}
  Body.applyForce(ball, {x:ball.position.x, y:ball.position.y}, {x:0,y:windForce*(-0.005-ball.position.y*windChangeWithY/100000)});

  drawSquares();

  if(ball.position.x<-20&&gameState=="play"){winnerMessage="Blue Wins"; gameState="scored"; blueWins++;}
  if(ball.position.x>820&&gameState=="play"){winnerMessage="Green Wins"; gameState="scored"; greenWins++;}

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

}
function drawSquares() {
  rectMode(CENTER);
  //Draw ground and ceiling
  rect(ground.position.x,ground.position.y,groundwidth,groundheight);
  rect(ceiling.position.x,ceiling.position.y,ceilingwidth,ceilingheight);

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
    fill(0,0,255);
    rectMode(CENTER);
    rect(0,0,obj2width,obj2length);
  pop();

  //Draw Green Square
  push();
    translate(obj.position.x, obj.position.y);
    rotate(obj.angle);
    fill(0,255,0);
    rectMode(CENTER);
    rect(0, 0, objwidth, objlength);
  pop();

  //Display Winner if Match is Scored
  push();
    textSize(50);
    fill(250,250,250);
    text(winnerMessage,200,200);
  pop();
}
