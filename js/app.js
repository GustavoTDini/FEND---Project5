const CANVAS_WIDTH = 909;
const CANVAS_HEIGHT = 752;
const SQUARE_WIDTH = 101;
const SQUARE_HEIGHT = 83;
const PLAYER_START_X = SQUARE_WIDTH*4;
const PLAYER_START_Y = SQUARE_HEIGHT-23;
const CHAR_WIDTH = 67;
const ROCK_WIDTH = 86;
const MAXSPEED = 2;

let rightKey;
let leftKey;
let xSpeed = 0;
let xSpeedInc = 0;
let maxSpeedInc = 8;
let xMove = 0;

let firstSquare = [1,143];
let roadSquares = [];
let allEnemies = [];
let allRocks = [];

let stage =0;
let totalRocks = [0,3,5,7,10];
let enemyTypes = [[0,0,1,1,2,2],
                  [0,0,0,1,1,1,2,2],
                  [0,0,0,0,1,1,1,1,2,2,2],
                  [0,0,0,0,0,1,1,1,1,1,2,2,2,2],
                  [0,0,0,0,0,0,1,1,1,1,1,1,2,2,2,2,2]];

// Classe representando um objeto qualquer do jogo, aplica as funções básicas de construção e renderização
class Objects {
  constructor(x, y, sprite){
    this.x = x;
    this.y = y;
    this.sprite = sprite;
  }

  render(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }

}

// Classe representando o personagem do jogador
class Player extends Objects{

  constructor(x, y, sprite) {
    super(x, y, sprite);
    this.x = x;
    this.y = y;
    this.sprite = 'images/char-boy.png';
  }

  moveUpAndDown(direction){
    this.y = this.y + 83*direction;
  }

  moveRight(){
    if (rightKey){
      xSpeedInc--;
      if (xSpeedInc == -maxSpeedInc)
        xSpeed--;
    }

    if (xSpeed < -MAXSPEED)
      xSpeed = -MAXSPEED;

    if (this.x > CANVAS_WIDTH-(SQUARE_WIDTH)) {
      xMove = 0;
      xSpeed = 0;
      xSpeedInc = 0;
      this.x = CANVAS_WIDTH - SQUARE_WIDTH - 1;
    } else{
      this.x = this.x + xMove;
    }

    for (let rock = 0; rock < allRocks.length; rock++){
      if (this.x < allRocks[rock].x + ROCK_WIDTH &&
          this.x + CHAR_WIDTH > allRocks[rock].x &&
          this.y < allRocks[rock].y + SQUARE_HEIGHT &&
          this.y + SQUARE_HEIGHT > allRocks[rock].y){
            xMove = 0;
            xSpeed = 0;
            xSpeedInc = 0;
            this.x = allRocks[rock].x - CHAR_WIDTH;
          }

        }
        console.log('moveRight');
  }


  moveLeft(){
     if (leftKey) {
      xSpeedInc++;
      if (xSpeedInc ==maxSpeedInc)
        xSpeed++;
    }
    if (xSpeed > MAXSPEED)
      xSpeed = MAXSPEED;

    if (this.x < 0){
      xMove = 0;
      xSpeed = 0;
      xSpeedInc = 0;
      this.x = 1;
    } else{
      this.x = this.x + xMove;
    }

    for (let rock = 0; rock < allRocks.length; rock++){
      if (this.x < allRocks[rock].x + ROCK_WIDTH &&
          this.x + CHAR_WIDTH > allRocks[rock].x &&
          this.y < allRocks[rock].y + SQUARE_HEIGHT &&
          this.y + SQUARE_HEIGHT > allRocks[rock].y){
            xMove = 0;
            xSpeed = 0;
            xSpeedInc = 0;
            this.x = allRocks[rock].x + CHAR_WIDTH;
          }
    }
    console.log('moveLeft');
  }

  update(dt){

    this.moveLeft();

    this.moveRight();

    if (!rightKey && !leftKey){
      xMove = 0;
      xSpeed = 0;
      xSpeedInc = 0;
    }else{
      xMove -= xSpeed;
    }

    if (this.y > 550){
      if (stage <=4){
        stage++;
        this.x = PLAYER_START_X;
        this.y = PLAYER_START_Y;
        createGameElements(stage);
      } else{
        ctx.fillText("You Won!");
      }
    }

  }

  handleInputUp(keys){
    if (keys == 'up' && this.y > 0)
      this.moveUpAndDown(-1);

    if (keys == 'down' && this.y < CANVAS_HEIGHT-(SQUARE_HEIGHT*3))
      this.moveUpAndDown(1);

    if (keys == 'left')
      leftKey = false;

    if (keys == 'right')
      rightKey = false;
  }

  handleInputDown(keys){
    if (keys == 'left')
      leftKey = true;

    if (keys == 'right')
      rightKey = true;
  }

}

// Classe representando o inimigo
class Enemy extends Objects{

  constructor(x, y, move, sprite) {
    super(x, y, move, sprite);
    this.x = x;
    this.y = y;
    this.move = move;
    this.sprite = sprite;
  }

  update(dt){
    // Multiplies a movement by the dt parameter. This ensure the game runs at the same speed for all computers.
    this.x = this.x + (this.move * dt);

    for (let rock = 0; rock < allRocks.length; rock++){
      if (this.x < allRocks[rock].x + ROCK_WIDTH &&
          this.x + ROCK_WIDTH > allRocks[rock].x &&
          this.y < allRocks[rock].y + SQUARE_HEIGHT &&
          this.y + SQUARE_HEIGHT > allRocks[rock].y){
        this.move = -this.move
        switch (this.sprite){
          case 'images/enemy-bug.png':
            this.sprite = 'images/enemy-bug-r.png';
            break;
          case 'images/enemy-bug-r.png':
            this.sprite = 'images/enemy-bug.png';
            break;
          case 'images/enemy-bug-2.png':
            this.sprite = 'images/enemy-bug-2-r.png';
            break;
          case 'images/enemy-bug-2-r.png':
            this.sprite = 'images/enemy-bug-2.png';
            break;
          case 'images/enemy-bug-3.png':
            this.sprite = 'images/enemy-bug-3-r.png';
            break;
          case 'images/enemy-bug-3-r.png':
            this.sprite = 'images/enemy-bug-3.png';
            break;
        }
      }
    }

    if(this.x > CANVAS_WIDTH + 100) {
      this.x = -100;
    } else if (this.x < -110) {
      this.x = CANVAS_WIDTH + 100;
    }

  }

}

class Rock extends Objects{

  constructor(x, y, sprite) {
    super(x, y, sprite);
    this.x = x;
    this.y = y;
    this.sprite = 'images/rock.png';
  }

}

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        13: 'enter',
        32: 'space',
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInputUp(allowedKeys[e.keyCode]);
});

document.addEventListener('keydown', function(e) {
    var allowedKeys = {
        13: 'enter',
        32: 'space',
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInputDown(allowedKeys[e.keyCode]);
});


function createRoadArray(){
  for (row = 0; row < 5; row++){
    for (column = 0; column <9; column ++){
      squareX = firstSquare[0] + (SQUARE_WIDTH*column);
      squareY = firstSquare[1] + (SQUARE_HEIGHT*row);
      thisSquare = [squareX,squareY];
      roadSquares.push(thisSquare);
    }
  }
}

// função para embaralhar uma array, usei o algoritmo de Durstenfeld
function shuffleArray(array){
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
}
return array;
}

function createRocks(rockX, rockY){
  let thisRock = new Rock(rockX, rockY);
  allRocks.push(thisRock);
}

function createEnemies(enemyX, enemyY, enemyType){
  let moveDirection = Math.floor(Math.random() * 2);
  if (moveDirection == 0){
    moveDirection = -1;
  }
  switch (enemyType) {
    case 0:
      enemy = new Enemy(enemyX, enemyY);
      enemy.move = (Math.floor(Math.random() * 100) + 70)*moveDirection;
      if (moveDirection<0){
        enemy.sprite = 'images/enemy-bug-r.png';
      } else{
        enemy.sprite = 'images/enemy-bug.png';
      }
      break;
    case 1:
      enemy = new Enemy(enemyX, enemyY);
      enemy.move = (Math.floor(Math.random() * 100) + 120)*moveDirection;
      if (moveDirection<0){
        enemy.sprite = 'images/enemy-bug-2-r.png';
      } else{
        enemy.sprite = 'images/enemy-bug-2.png';
      }
      break;
    case 2:
      enemy = new Enemy(enemyX, enemyY);
      enemy.move = (Math.floor(Math.random() * 100) + 120)*moveDirection;
      if (moveDirection<0){
        enemy.sprite = 'images/enemy-bug-3-r.png';
      } else{
        enemy.sprite = 'images/enemy-bug-3.png';
      }
      break;
  }
  allEnemies.push(enemy);
  console.log('new enemy aproaches');
}

function createGameElements(level){
  roadSquares = [];
  allEnemies = [];
  allRocks = [];
  createRoadArray();
  roadSquares = shuffleArray(roadSquares);
  for (let rockIndex = 0; rockIndex < totalRocks[level]; rockIndex++){
    createRocks(roadSquares[0][0], roadSquares[0][1]);
    roadSquares.shift();
  }
  for (let enemyIndex = 0; enemyIndex < enemyTypes[level].length; enemyIndex++){
    createEnemies(roadSquares[0][0], roadSquares[0][1], enemyTypes[level][enemyIndex]);
    roadSquares.shift();
  }

}

createGameElements(stage);

let player = new Player(PLAYER_START_X,PLAYER_START_Y);
