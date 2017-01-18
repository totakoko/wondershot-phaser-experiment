import WS from '../';

export default class Player extends WS.Components.Player {
    constructor(options) {
        super(options);

        this.movement = {
          x: 0,
          y: 0,
        };

        this.updateBotDirection();
        this.fireRandomly();
    }
    registerGamepadButtons() {
        console.log('registerGamepadButtons bot player%s', this.playerNumber);
    }
    update() {
      if (this.sprite.alive) {
        if (this.movement.x || this.movement.y) {
            this.sprite.rotation = Math.atan2(this.movement.y, this.movement.x);
            this.sprite.body.x += this.movement.x * WS.Config.PlayerSpeed;
            this.sprite.body.y += this.movement.y * WS.Config.PlayerSpeed;
        }
      }
      this.indicator.animations.frame = this.pad.connected ? 0 : 1;
    }

    updateBotDirection() {
      this.movement.x = _.random(-1, 1, true);
      this.movement.y = _.random(-1, 1, true);
      const nextActionDelay = _.random(500, 1500, true);
      // setTimeout(this.updateBotDirection.bind(this), nextMovementDelay);
      WS.game.time.events.add(nextActionDelay, this.updateBotDirection, this);
    }
    fireRandomly() {
      this.fireWeapon();
      const nextActionDelay = _.random(1, 5, true);
      // setTimeout(this.updateBotDirection.bind(this), nextMovementDelay);
      WS.game.time.events.add(Phaser.Timer.SECOND * nextActionDelay, this.fireRandomly, this);
    }
}
