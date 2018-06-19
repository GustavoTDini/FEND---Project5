// inicio do script escondendo tela de jogo
$('.game-board').hide();

let startButton = $("#start-button").click(function(){
  console.log('start');
  OpenStartModal();
});

function OpenGameOverModal(){
  $("#game-over").show();
  gamePlay = false;
  let retry = $("#retry-button").click(function(){
    restartGame();
    $('#game-over').hide();
    OpenStartModal();
  });
}

function OpenGameFinishedModal(){
  $("#game-finished").show()
  $("#modal-points").text(score);
  gamePlay = false;
  let restart = $("#restart-button").click(function(){
    restartGame();
    $('#game-finished').hide();
    OpenStartModal();
  });
}


function OpenStartModal(){
  $("#game-start").show();
  playerSelection = 0;
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
    console.log('startGame');
    $("#game-start").hide();
    startGame();
  });
}


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
    lives = -1;
    loseSound.play();
    OpenGameOverModal();
  }
}

function startGame(){
  gameReset();
  $('.start-screen').hide();
  $('.game-board').show();
  createGameElements(level);
  gameMusic.play();
  player = new Player(PLAYER_START_X,PLAYER_START_Y, playerAvatars[playerSelection]);
}

// Função do temporizador
let countUp = function(){
  if (gamePlay){
    $("#time").text(time);
    time ++;
  }
}

// Função do Contador de Pontos
function scoreUp(upScore){
  score += upScore;
  if (score<0){
    score = 0;
  }
  $("#points").text(score);
}

// Função do Contador de Vidas
function showLives(){
  $("#show-lives").empty();
  for (livesCount = 0; livesCount < lives; livesCount++){
    $("#show-lives").append('<img src="images/heart.png" class="heart" alt="Game Logo"/>');
  }
}

function restartGame(){
  $('.start-screen').show();
  $('.game-board').hide();
  gameMusic.pause();
}

function gameReset(){
  gamePlay = true;
  time = 0;
  score = 0;
  lives = 5;
  textColorChanger = 5;
  roadSquares = [];
  allEnemies = [];
  allRocks = [];
  allGems = [];
  level = 0;
  $('#points').empty().append(score);
  $('#time').empty().append(time);
  showLives();
  passedTime = setInterval(countUp,1000);
}
