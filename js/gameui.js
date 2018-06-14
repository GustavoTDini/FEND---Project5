function createRocks(rockX, rockY){
  rock = new Rock(rockX, rockY);
  allRocks.push(rock);
}

function createGems(gemX, gemY, gemType){
  switch (gemType){
    case 0:
      gem = new Gem( gemX, gemY, 'images/gem-orange.png');
      break;
    case 1:
      gem = new Gem( gemX, gemY, 'images/gem-blue.png');
      break;
    case 2:
      gem = new Gem( gemX, gemY, 'images/gem-green.png');
      break;
  }
  allGems.push(gem);
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
}

function createGameElements(level){
  roadSquares = [];
  allEnemies = [];
  allRocks = [];
  allGems = [];
  createRoadArray();
  roadSquares = shuffleArray(roadSquares);
  if (level <= 4){
    for (let rockIndex = 0; rockIndex < totalRocks[level]; rockIndex++){
      createRocks(roadSquares[0][0], roadSquares[0][1]);
      roadSquares.shift();
    }
    for (let gemIndex = 0; gemIndex < totalGems[level].length; gemIndex++){
      createGems(roadSquares[0][0], roadSquares[0][1], totalGems[level][gemIndex], gemIndex);
      roadSquares.shift();
    }
    for (let enemyIndex = 0; enemyIndex < totalEnemies[level].length; enemyIndex++){
      createEnemies(roadSquares[0][0], roadSquares[0][1], totalEnemies[level][enemyIndex]);
      roadSquares.shift();
    }
  }
}

function gameOver(){
  if (lives == 0){
    canvasText = new CanvasText(PLAYER_START_X - SQUARE_WIDTH*1.85, PLAYER_START_Y, "Game Over");
    gamePlay = false;
  }
}

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

createGameElements(level);

let player = new Player(PLAYER_START_X,PLAYER_START_Y);
