let pauseMenu = Wondershot.Components.PauseMenu;

module Wondershot.Components {
  export class Player {
    const speed = Wondershot.Config.PlayerSpeed;

    constructor(game, padNumber) {
      this.game = game;
      this.padNumber = padNumber;
    }
    registerGamepadButtons() {
      this.pad.getButton(Phaser.Gamepad.XBOX360_A).onDown.add(_.throttle(this.throwArrow, 5, {trailing: false}), this);
      this.pad.getButton(Phaser.Gamepad.XBOX360_B).onDown.add(_.throttle(this.throwRock, 5, {trailing: false}), this);
      this.pad.getButton(Phaser.Gamepad.XBOX360_Y).onDown.add(this.toggleGhost, this);
      this.pad.getButton(Phaser.Gamepad.XBOX360_START).onDown.add(_.throttle(pauseMenu.togglePause, 500, {trailing: false}), pauseMenu);
    }
    preload() {
      this.game.load.image('player', 'assets/images/player.png');
    }
    create() {
      this.pad = this.game.input.gamepad['pad' + this.padNumber];

      this.indicator = this.game.Groups.UI.create(10 + (40*(this.padNumber-1)), 10, 'controller-indicator');
      this.indicator.scale.setTo(2);
      this.indicator.animations.frame = 1;

      this.player = this.game.Groups.Players.create(80 * this.padNumber, 200, 'player');
      this.player.scale.setTo(0.2);
      this.player.owner = this.padNumber;

      this.game.physics.p2.enable(this.player, Wondershot.Config.Debug);
      this.player.body.setCircle(30);
      this.player.body.fixedRotation = true;
      this.player.body.damping = 1; // pas d'effet élastique sur les côtés
      this.playerCollisionGroup = this.game.physics.p2.createCollisionGroup();
      this.player.body.setCollisionGroup(this.playerCollisionGroup);
  //       this.player.body.kinematic = true;

      if (!this.pad.connected) {
        this.game.destroy();
        throw new Error(`Gamepad ${this.padNumber} is not connected`);
      }
      this.registerGamepadButtons();
    }
    update() {
      if (pauseMenu.paused) {
        return;
      }
      this.updatePadIndicator();
      if (Wondershot.Config.HighPrecisionMovements) {
        this.updatePrecisePlayerPosition();
      } else {
        this.updatePlayerPosition();
      }
    }
    render() {
    }
    updatePlayerPosition() {
      if (this.pad.connected) {
        let moveX = this.pad._axes[0];
        let moveY = this.pad._axes[1];
        if (moveX || moveY) {
          this.player.rotation = Math.atan2(moveY, moveX);
          this.player.x += moveX * this.speed;
          this.player.y += moveY * this.speed;
        }
      }
    }
    updatePrecisePlayerPosition() {
      if (this.pad.connected) {
        let moveX = this.pad._rawPad.axes[0];
        let moveY = this.pad._rawPad.axes[1];
        if (moveX || moveY) {
          this.player.rotation = Math.atan2(moveY, moveX);
          this.player.body.x += moveX * this.speed;
          this.player.body.y += moveY * this.speed;
        }
      }
    }
    updatePadIndicator() {
      // Pad "connected or not" indicator
      if (this.game.input.gamepad.supported && this.game.input.gamepad.active && this.pad.connected) {
        this.indicator.animations.frame = 0;
      } else {
        this.indicator.animations.frame = 1;
      }
    }

    // Actions
    throwArrow() {
      Wondershot.Components.Projectiles.throwArrow(this.player.position, this.player.rotation, this.padNumber);
    }
    throwRock() {
      Wondershot.Components.Projectiles.throwRock(this.player.position, this.player.rotation, this.padNumber);
    }
    toggleGhost() {
      this.player.body.kinematic = !this.player.body.kinematic;
    }
  }
}
