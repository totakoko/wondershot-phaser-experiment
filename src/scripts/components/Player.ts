let pauseMenu = Wondershot.Components.PauseMenu;

module Wondershot.Components {
  export class Player {
    constructor(game, playerNumber) {
      this.game = game;
      this.playerNumber = playerNumber;

      this.pad = this.game.input.gamepad['pad' + this.playerNumber],

      this.indicator = this.game.Groups.UI.create(10 + (40 * (this.playerNumber - 1)), 10, 'controller-indicator');
      this.indicator.scale.setTo(2);
      this.indicator.animations.frame = 1;

      this.sprite = this.game.world.create(80 * this.playerNumber, 200, 'player');
      this.sprite.scale.setTo(0.2);
      this.sprite.owner = this.playerNumber;

      this.game.physics.p2.enable(this.sprite, Wondershot.Config.Debug);
      this.sprite.body.setCircle(30);
      this.sprite.body.fixedRotation = true;
      this.sprite.body.damping = 1; // pas d'effet élastique sur les côtés

      this.sprite.body.setCollisionGroup(this.game.CollisionGroups.Players);
      this.sprite.body.collides([this.game.CollisionGroups.World, this.game.CollisionGroups.Projectiles]);

      this.registerGamepadButtons();
    }

    registerGamepadButtons() {
      this.pad.getButton(Phaser.Gamepad.XBOX360_A).onDown.add(_.throttle(this.throwArrow, 5, { trailing: false }), this);
      this.pad.getButton(Phaser.Gamepad.XBOX360_B).onDown.add(_.throttle(this.throwRock, 5, { trailing: false }), this);
      this.pad.getButton(Phaser.Gamepad.XBOX360_START).onDown.add(_.throttle(pauseMenu.togglePause, 500, { trailing: false }), pauseMenu);
    }

    throwArrow() {
      Wondershot.Components.Projectiles.throwArrow(this.sprite.position, this.sprite.rotation, this.playerNumber);
    }
    throwRock() {
      Wondershot.Components.Projectiles.throwRock(this.sprite.position, this.sprite.rotation, this.playerNumber);
    }
  }
}
