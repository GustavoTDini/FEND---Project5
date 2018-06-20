// inicio do script escondendo tela de jogo
$('.game-board').hide();

let startButton = $("#start-button").click(function(){
  OpenStartModal();
});

// função para abrir o modal de game over
function OpenGameOverModal(){
  $("#game-over").modal();
  gamePlay = false;
  let retry = $("#retry-button").click(function(){
    restartGame();
    $('#game-over').modal('hide');
    OpenStartModal();
  });
}

// função para abrir o modal de término de jogo
function OpenGameFinishedModal(){
  $("#game-finished").modal()
  $("#modal-points").text(score);
  gamePlay = false;
  let restart = $("#restart-button").click(function(){
    restartGame();
    $('#game-finished').modal('hide');
    OpenStartModal();
  });
}

// função para abrir o modal de inicio de jogo
function OpenStartModal(){
  $("#game-start").modal();
  playerSelection = 0;
  // criação do elemento de canvas do seletor de personagens e os botões de controle
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
    $("#game-start").hide();
    startGame();
  });
}

// função que cria o canvas de seletor de personagem,
function drawSelector(avatar){
  var selectorCanvas = document.getElementById("selector-canvas");
  var selectorCtx = selectorCanvas.getContext("2d");
  selectorCtx.clearRect(0, 0, selectorCanvas.width, selectorCanvas.height);
  selectorCtx.drawImage(Resources.get('images/selector.png'), 0, 0);
  selectorCtx.drawImage(Resources.get(avatar), 0, 0);

}

//função para termino de jogo, caso acabe as vidas do jogador
function gameOver(){
  if (lives == 0){
    lives = -1;
    clearInterval(passedTime);
    loseSound.play();
    OpenGameOverModal();
  }
}

// função para iniciar o jogo, após ter sido escolhido o personagem
function startGame(){
  gameReset();
  $('.start-screen').hide();
  $('.game-board').show();
  createGameElements(level);
  gameMusic.play();
  // criação do elemento player de acordo com a seleção do jogador
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

// função de reinicio de jogo, volta a tela inicial do jogo
function restartGame(){
  $('.start-screen').show();
  $('.game-board').hide();
  gameMusic.pause();
}

// função de reset, volta as principais variaveis as configurações iniciais,
// apaga os elementos de ui e zera o temporizador
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
  canvasText = undefined;
  player = undefined;
  $('#points').empty().append(score);
  $('#time').empty().append(time);
  $('#stage').empty().text("Fase " + (level+1));
  showLives();
  clearInterval(passedTime);
  passedTime = setInterval(countUp,1000);
}
