const CANVAS_WIDTH = 909;
const CANVAS_HEIGHT = 752;
const SQUARE_WIDTH = 101;
const SQUARE_HEIGHT = 83;
const PLAYER_START_X = SQUARE_WIDTH*4;
const PLAYER_START_Y = SQUARE_HEIGHT-23;
const CHAR_WIDTH = 68;
const ROCK_WIDTH = 82;
const ENEMY_WIDTH = 98;
const MAX_SPEED = 2;
const ORANGE_GEM_POINT = 10;
const BLUE_GEM_POINT = 50;
const GREEN_GEM_POINT = 100;
const PASS_STAGE_POINT = 50;
const HIT_POINT = -30;
const TEXT_TIME_START = 150;
const MAX_SPEED_INC = 8;
const FIRST_SQUARE = [1,143];

let gamePlay = true;
let rightKey;
let leftKey;
let xSpeed = 0;
let xSpeedInc = 0;
let xMove = 0;
let gemPoint;
let time = 0;
let passedTime;
let score = 0;
let lives = 5;
let canvasText;
let textColorChanger = 5;
let allowedKeys = {
  37: 'left',
  38: 'up',
  39: 'right',
  40: 'down'
};
// gameMusic from http://soundimage.org/
let gameMusic = new Audio("sounds/more-monkey-island-band.mp3");
// gamesounds from http://soundbible.com/
let hitSound = new Audio("sounds/punch.mp3");
let gemSound = new Audio("sounds/shooting-star.mp3");
let splash = new Audio("sounds/splash.mp3");
let winSound = new Audio("sounds/fireworks.mp3");
let loseSound = new Audio("sounds/sad-trombone.mp3");


let roadSquares = [];
let allEnemies = [];
let allRocks = [];
let allGems = [];

let level = 0;
let playerAvatars = ['images/char-boy.png',
                     'images/char-cat-girl.png',
                     'images/char-horn-girl.png',
                     'images/char-pink-girl.png',
                     'images/char-princess-girl.png'];
let playerSelection = 0;
let player;
let totalRocks = [0,3,5,7,10];
let totalGems = [[0],
                 [0,1],
                 [0,0,1,2],
                 [0,0,1,1,2,2],
                 [0,0,0,1,1,1,2,2,2]]
let totalEnemies = [[0,0,1,1,2,2],
                    [0,0,0,1,1,1,2,2],
                    [0,0,0,0,1,1,1,1,2,2,2],
                    [0,0,0,0,0,1,1,1,1,1,2,2,2,2],
                    [0,0,0,0,0,0,1,1,1,1,1,1,2,2,2,2,2]];



// Classe representando um objeto gráfico qualquer do jogo, aplica as funções básicas de construção e renderização
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

// Classe representando um objeto de texto do canvas, para criação dos avisos de eventos
class CanvasText {
  constructor(x, y, text, time){
    this.x = x;
    this.y = y;
    this.text = text;
    this.time = TEXT_TIME_START;
  }

  render(){
    ctx.font="50px verdana";
    if (textColorChanger % 2 == 0){
      ctx.fillStyle= "gold"
    } else{
      ctx.fillStyle= "slateblue"
    }
    ctx.strokeStyle="firebrick"
    ctx.lineWidth = 2;
    let textX = this.x + (ctx.measureText(this.text).width/3);
    let textY = this.y + (SQUARE_HEIGHT*1.2);
    ctx.fillText(this.text,textX, textY);
    ctx.strokeText(this.text,textX, textY);
  }

  update(dt){
      // neste update é realizado 2 eventos, em um trocamos a cor do texto de acordo com o textColorChanger
      this.y = this.y - dt*10;
      this.time = this.time - 1;
      if (this.time % 10 == 0){
        textColorChanger --;
      }
      // aqui definimos a destruição do elemento após um certo periodo de tempo
      if (this.time == 0 && gamePlay){
        canvasText = undefined;
      }
    }
}

// Classe representando o personagem do jogador
class Player extends Objects{

  constructor(x, y, sprite) {
    super(x, y, sprite);
    this.x = x;
    this.y = y;
    this.sprite = sprite;
  }

  // função que cria o movimento para cima e baixo, pulando de linha em linha, é testado tambem se há alguma pedra a frente
  // para isso é guardado a posição inicial em pastThisY, e caso após o movimento houver uma colisão com uma pedra, o personagem volta a essa posição
  moveUpAndDown(direction){
    if (gamePlay){
      let pastThisY = this.y;
      this.y = this.y + SQUARE_HEIGHT*direction;
      for (let rock = 0; rock < allRocks.length; rock++){
        if (this.x < allRocks[rock].x + ROCK_WIDTH &&
          this.x + CHAR_WIDTH > allRocks[rock].x &&
          this.y < allRocks[rock].y + SQUARE_HEIGHT &&
          this.y + SQUARE_HEIGHT > allRocks[rock].y){
            this.y = pastThisY;
          }
        }
    }

  }

  // função para se ter a aceleração para o movimento para a direita
  moveRight(){
    // incrementa a velocidade de acordo com xSpeedInc enuquanto estiver com o botão pressionado
    if(gamePlay){
      if (rightKey){
        xSpeedInc--;
        if (xSpeedInc == -MAX_SPEED_INC)
        xSpeed--;
      }

      // testa a velocidade maxima
      if (xSpeed < -MAX_SPEED)
      xSpeed = -MAX_SPEED;

      // testa a posição do personagem, verificando que não saiu da tela
      if (this.x > (CANVAS_WIDTH-SQUARE_WIDTH)) {
        xMove = 0;
        xSpeed = 0;
        xSpeedInc = 0;
        this.x = CANVAS_WIDTH - SQUARE_WIDTH - 1;
      } else{
        this.x = this.x + xMove;
      }

      // testa a posição do personagem, verificando se não houve uma colisão com uma pedra, testando cada objeto do array allRocks
      for (let rock = 0; rock < allRocks.length; rock++){
        if (this.x < allRocks[rock].x + ROCK_WIDTH &&
          this.x + CHAR_WIDTH > allRocks[rock].x &&
          this.y < allRocks[rock].y + SQUARE_HEIGHT &&
          this.y + SQUARE_HEIGHT > allRocks[rock].y &&
          xSpeed < 0){
            xMove = 0;
            xSpeed = 0;
            xSpeedInc = 0;
            this.x = allRocks[rock].x - CHAR_WIDTH;
          }
        }
    }

    }

    // função para se ter a aceleração para o movimento para a esquerda, com as mesma caracteristicas do movimento para a direita
    moveLeft(){
      if (gamePlay){
        if (leftKey) {
          xSpeedInc++;
          if (xSpeedInc ==MAX_SPEED_INC)
          xSpeed++;
        }
        if (xSpeed > MAX_SPEED)
        xSpeed = MAX_SPEED;

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
            this.y + SQUARE_HEIGHT > allRocks[rock].y &&
            xSpeed > 0){
              xMove = 0;
              xSpeed = 0;
              xSpeedInc = 0;
              this.x = allRocks[rock].x + ROCK_WIDTH ;
            }
          }
      }

      }

      update(dt){

        // teste se o personagem pegou uma gema - isto é - colidiu com a mesma, testando cada objeto do array allGems
        for (let gem = 0; gem < allGems.length; gem++){
          if (this.x < allGems[gem].x + CHAR_WIDTH &&
            this.x + CHAR_WIDTH > allGems[gem].x &&
            this.y < allGems[gem].y + SQUARE_HEIGHT &&
            this.y + SQUARE_HEIGHT > allGems[gem].y){
              // caso haja colisão, testa qual gema que é e associa os pontos da mesma
              switch (allGems[gem].sprite){
                case 'images/gem-orange.png':
                gemPoint = ORANGE_GEM_POINT;
                break;
                case 'images/gem-blue.png':
                gemPoint = BLUE_GEM_POINT;
                break;
                case 'images/gem-green.png':
                gemPoint = GREEN_GEM_POINT;
                break;
              }
              // toca o som respectivo, cria um texto com o valor dos pontos, incrementa os pontos e retira essa gema do array
              gemSound.play();
              canvasText = new CanvasText(allGems[gem].x, allGems[gem].y, gemPoint);
              scoreUp(gemPoint);
              allGems.splice(gem,1);

            }
          }

        // testa os movimentos laterais,
        this.moveLeft();
        this.moveRight();

        // testa se não ha nenhuma tecla, esquerda e direita sendo pressionada e cessa o movimento
        if (!rightKey && !leftKey){
          xMove = 0;
          xSpeed = 0;
          xSpeedInc = 0;
        }else{
          xMove -= xSpeed;
        }

        // testa a posição y, caso tenha chegado à agua, incrementa a fase, e cria a nova fase,
        // caso estaja na ultima fase, cria o modal de termino de jogo
        if (this.y > 550){
          if (level <4){
            splash.play();
            scoreUp(PASS_STAGE_POINT*level);
            level++;
            this.x = PLAYER_START_X;
            this.y = PLAYER_START_Y;
            createGameElements(level);
            $("#stage").text("Fase " + (level+1));
          } else if(level == 4){
            level ++;
            winSound.play();
            OpenGameFinishedModal();
          }
        }
  }

      // testa se os botões foram clicados
      handleInputUp(keys){
        // no movimento vertical, cada clique movimenta de acordo com o moveUpAndDown, até o limite do canvas
        if (keys == 'up' && this.y > 0){
          this.moveUpAndDown(-1);
        }
        if (keys == 'down' && this.y < CANVAS_HEIGHT-(SQUARE_HEIGHT*3)){
          this.moveUpAndDown(1);
        }

        // no movimento lateral o clique significa o termino do pressionar da tecla, logo o movimento é encerrado
        if (keys == 'left')
          leftKey = false;
        if (keys == 'right')
          rightKey = false;
      }

      // testa se os botões estão pressionados
      handleInputDown(keys){
        // no movimento lateral caso estejam pressionados o moviento é mantido
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
  // enquanto o jogo estiver rodando, o movimento do inimigo e multiplicado por dt
  if (gamePlay){
    this.x = this.x + (this.move * dt);
  }

  // testa a colisão do inimigo com o personagem
  if (this.x < player.x + CHAR_WIDTH &&
    this.x + ENEMY_WIDTH > player.x &&
    this.y < player.y + SQUARE_HEIGHT &&
    this.y + SQUARE_HEIGHT > player.y){
      // testa o gameOver de acordo com a função
      gameOver();
      // caso não seja valida a função abre a função playerHit
      if (lives>0){
        playerHit();
      }
    }

    // testa a colisão do inimigo com as pedras, neste caso inverte a direção e o sprite do mesmo
    for (let rock = 0; rock < allRocks.length; rock++){
      if (this.x < allRocks[rock].x + ROCK_WIDTH &&
        this.x + ENEMY_WIDTH > allRocks[rock].x &&
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

      // caso o inimigo atravesse a area do canvas, o recoloca em uma posição do outro lado
      if(this.x > CANVAS_WIDTH + 100) {
        this.x = -100;
      } else if (this.x < -110) {
        this.x = CANVAS_WIDTH + 100;
      }

    }

}

// Classe representando uma pedra, é apenas um sprite, sem outras funções
class Rock extends Objects{

  constructor(x, y, sprite) {
    super(x, y, sprite);
    this.x = x;
    this.y = y;
    this.sprite = 'images/rock.png';
  }
}

// Classe representando uma pedra, é apenas um sprite, sem outras funções
class Gem extends Objects{

  constructor(x, y, sprite, arrayIndex, got) {
    super(x, y, sprite);
    this.x = x;
    this.y = y;
    this.sprite = sprite;
  }

}

// Listenter para clique das teclas
document.addEventListener('keyup', function(e) {
  player.handleInputUp(allowedKeys[e.keyCode]);
});

// Listenter para pressionar das teclas
document.addEventListener('keydown', function(e) {
  player.handleInputDown(allowedKeys[e.keyCode]);
});

// Listener para o temino da musica, caso esta se encerre e o jogo estiver valido, ela entra em loop
gameMusic.addEventListener('ended', function() {
  if(gamePlay){
    this.currentTime = 0;
    this.play();
  }
}, false);

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

// função chamada quando o jogador é atingido por um inimigo, cria o aviso de HIT, toca o respectivo som
//decrementa uma vida e pontos, retorna o personagem a posicão inicial,
function playerHit(){
  canvasText = new CanvasText(player.x , player.y, "HIT!");
  player.x = PLAYER_START_X;
  player.y = PLAYER_START_Y;
  lives --;
  scoreUp(HIT_POINT);
  hitSound.play();
  showLives();
}

// função para criar o array dos blocos aonde se encontram as estradas, ela parte de um valor inicial else {
// vai iterando em todos os blocos aonde podera ser colocado os inimigos, pedras e gemas
function createRoadArray(){
  for (row = 0; row < 5; row++){
    for (column = 0; column <9; column ++){
      squareX = FIRST_SQUARE[0] + (SQUARE_WIDTH*column);
      squareY = FIRST_SQUARE[1] + (SQUARE_HEIGHT*row);
      thisSquare = [squareX,squareY];
      roadSquares.push(thisSquare);
    }
  }
}

// função para criar um array de pedras para ser colocado no jogo, é criado a partir do valor de x e y
function createRocks(rockX, rockY){
  rock = new Rock(rockX, rockY);
  allRocks.push(rock);
}

// função para criar um array de gemas para ser colocado no jogo, é criado a partir do valor de x e y
// alem do tipo de gema
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

// função para criar um array de inimigos para ser colocado no jogo, é criado a partir do valor de x e y
// alem do tipo de inimigos
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


// funçAo que desenha a tela a partir de cada inicio de jogo ou nivel
function createGameElements(level){
  // inicialmente zeramos todos os elementos
  roadSquares = [];
  allEnemies = [];
  allRocks = [];
  allGems = [];
  // criamos o array da estrada e o randomizamos
  createRoadArray();
  roadSquares = shuffleArray(roadSquares);
  // somente se o nivel for menor que 4 fazemos as iterações para cada elemento pegamos o 1o elemento do roadSquares (que estará randomizado)
  // e colocamos cada elemento
  if (level <= 4){
    // primeiro as pedras - somente pegamos os valores de x e y e o numero definido pelo totalRocks
    for (let rockIndex = 0; rockIndex < totalRocks[level]; rockIndex++){
      createRocks(roadSquares[0][0], roadSquares[0][1]);
      roadSquares.shift();
    }
    // depois as gemas - pegamos os valores de x e y e o tipo e numero definido pelo totalGems
    for (let gemIndex = 0; gemIndex < totalGems[level].length; gemIndex++){
      createGems(roadSquares[0][0], roadSquares[0][1], totalGems[level][gemIndex], gemIndex);
      roadSquares.shift();
    }
    // finalmente os inimigos - pegamos os valores de x e y e o tipo e numero definido pelo totalEnemies
    for (let enemyIndex = 0; enemyIndex < totalEnemies[level].length; enemyIndex++){
      createEnemies(roadSquares[0][0], roadSquares[0][1], totalEnemies[level][enemyIndex]);
      roadSquares.shift();
    }
  }
}
