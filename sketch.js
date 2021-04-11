var PLAY = 1;
var END = 0;
var gameState = PLAY;
var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage, backgroundImg;;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var score=0;
var gameOver, restart;

localStorage["HighestScore"] = 0;

function preload(){
  trex_running =   loadAnimation("trex_1.png","trex_2.png","trex_3.png");
  trex_collided = loadAnimation("trex_collided 2.png");
  
  groundImage = loadImage("ground2.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  gameOverImg = loadImage("gameOver 2.png");
  restartImg = loadImage("restart 2.png");

  backgroundImg=loadImage("Background.png");
  
}

function setup() {
  createCanvas(600, 200);
  
  trex = createSprite(width/2,180,20,50);
  
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.06;
  trex.velocityX = 14;

  ground = createSprite(200,190,400,20);
  ground.addImage(groundImage);
  ground.x = ground.width /2;
 
  gameOver = createSprite(displayWidth/2,50);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(displayHeight/2,90);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.3;
  restart.scale = 0.05;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  background(backgroundImg);

  gameOver.x = camera.x;
  restart.x = camera.x;

  fill("black");
  text("Score: "+ score, camera.x+200,50);
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
  
    if(keyDown("space") && trex.y >= 159) {
      trex.velocityY = -14;
    }
  
    trex.velocityY = trex.velocityY + 0.8

    invisibleGround.x = camera.x;
    if (frameCount % 80 === 0 && frameCount >= 50){
      ground.x = camera.x + width/2;
    }

   
    camera.position.x= camera.position.x+14;
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    trex.velocityX = 0;
    obstaclesGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  
  trex.collide(invisibleGround);
  drawSprites();
}


function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(camera.x+width/2,165,10,40);
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  trex.velocityX = 14;
  trex.x = width/2;
  
  camera.position.x = trex.x;
  
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  
  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"] = score;
  }
  console.log(localStorage["HighestScore"]);
  
  score = 0;
 
}
