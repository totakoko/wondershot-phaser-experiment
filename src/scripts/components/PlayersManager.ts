module Wondershot.Components {
  export class PlayerManager {
    static players = {};
    static activePlayers = [1, 2, 3, 4];

    static init(game) {
      this.game = game;
      return this;
    }
    static preload() {
      this.game.load.image('player', 'assets/images/player.png');
    }
    static create() {
      this.game.input.gamepad.start();

      if (this.game.input.gamepad.padsConnected == 0) {
        this.game.destroy();
        throw new Error(`Could not detect gamepads. Please connect them to the PC!`);
      }

      this.activePlayers.forEach(function(playerNumber) {
        this.players[playerNumber] = new Player(this.game, playerNumber);
      }, this);
    }


    static update() {
      this.updatePadIndicators();
      this.updatePlayerPositions();
    }
    static updatePadIndicators() {
      this.activePlayers.forEach(function(playerNumber) {
        if (this.game.input.gamepad.supported && this.game.input.gamepad.active && this.players[playerNumber].pad.connected) {
          this.players[playerNumber].indicator.animations.frame = 0;
        } else {
          this.players[playerNumber].indicator.animations.frame = 1;
        }
      }, this);
    }
    static updatePlayerPositions() {
      this.activePlayers.forEach(function(playerNumber) {
        let pad = this.players[playerNumber].pad;
        if (pad.connected) {
          let moveX = pad._rawPad.axes[0];
          let moveY = pad._rawPad.axes[1];
          if (moveX || moveY) {
            let playerSprite = this.players[playerNumber].sprite;
            playerSprite.rotation = Math.atan2(moveY, moveX);
            playerSprite.body.x += moveX * Wondershot.Config.PlayerSpeed;
            playerSprite.body.y += moveY * Wondershot.Config.PlayerSpeed;
          }
        }
      }, this);
    }
  }
}
