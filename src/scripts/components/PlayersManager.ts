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
      this.game.load.spritesheet('controller-indicator', 'assets/images/controller-indicator.png', 16, 16);
      this.game.load.image('player-death-marker', 'assets/images/player-death-marker.png');
    }
    static create() {
      this.game.input.gamepad.start();

      if (!this.game.input.gamepad.supported) {
        this.game.destroy();
        throw new Error(`The Gamepad API not supported in this browser!`);
      }

      // la connexion est gamepad est faite en asynchrone
      this.game.input.gamepad.onConnectCallback = this.onGamepadConnect.bind(this);

      this.activePlayers.forEach(function(playerNumber) {
        let player = this.players[playerNumber] = new Player(this.game, playerNumber);
        player.pickupWeapon(new WeaponSlingshot());
      }, this);
    }

    static onGamepadConnect(gamepadNumber) {
      let playerNumber = gamepadNumber + 1;
      console.log('Gamepad%s connected.', playerNumber);
      this.players[playerNumber].registerGamepadButtons();
    }

    static update() {
      if (this.game.input.gamepad.active) {
        this.updatePadIndicators();
        this.updatePlayerPositions();
      }
    }
    static updatePadIndicators() {
      this.activePlayers.forEach(function(playerNumber) {
        if (this.players[playerNumber].pad.connected) {
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

    static killPlayer(player) {
      console.log('kill player%s', player.playerNumber);
      Wondershot.Components.ScoreBoard.addPoint(player.playerNumber);
      deathMarker = this.game.Groups.Floor.create(player.sprite.x, player.sprite.y, 'player-death-marker');
      deathMarker.anchor.setTo(0.5);
      deathMarker.tint = Wondershot.Config.PlayerColors[player.playerNumber];
      // this.sprite.scale.setTo(0.2);
      this.players[player.playerNumber].sprite.destroy();
      delete this.activePlayers[player.playerNumber-1];
    }
  }
}
