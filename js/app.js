// Classe representando um personagem qualquer do jogo, aplica as funções básicas
class Characters {
  constructor(x, y, move, sprite){
    this.x = x;
    this.y = y;
    this.sprite = sprite;
    this.move = move;
  }

  update(dt){

  }

  render(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }

}

class Player extends Characters{

}

class Objects extends Characters{

}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player



// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
