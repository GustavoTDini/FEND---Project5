// inicio do script escondendo tela de jogo
$('.game-board').hide();



let startButton = $("#start-button").click(function(){
  $("#game-start").modal();
  drawSelector(playerAvatars[playerSelection]);
  let leftSelector = $("#selector-left").click(function(){
    if (playerSelection == 0){
      playerSelection = 4
    } else{
      playerSelection --;
    }
    drawSelector(playerAvatars[playerSelection]);
  });

  let rightSelector = $("#selector-right").click(function(){
    if (playerSelection == 4){
      playerSelection = 0
    } else{
      playerSelection ++;
    }
    drawSelector(playerAvatars[playerSelection]);
  });

  let startGameButton = $("#start-game").click(function(){
    startGame();
  });
});



function drawSelector(avatar){
  var selectorCanvas = document.getElementById("selector-canvas");
  var selectorCtx = selectorCanvas.getContext("2d");
  selectorCtx.clearRect(0, 0, selectorCanvas.width, selectorCanvas.height);
  selectorCtx.drawImage(Resources.get('images/selector.png'), 0, 0);
  selectorCtx.drawImage(Resources.get(avatar), 0, 0);

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


function startGame(){
  $('.start-screen').hide();
  $('.game-board').show();
  createGameElements(level);
  player = new Player(PLAYER_START_X,PLAYER_START_Y, playerAvatars[playerSelection]);
}
