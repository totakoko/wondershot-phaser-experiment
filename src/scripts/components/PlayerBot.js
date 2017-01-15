const PlayerBot = WS.Components.PlayerBot = class Player extends WS.Components.Player {
    constructor(options) {
        super(options);

        this.movement = {
          x: 0,
          y: 0,
        };

        this.updateBotDirection();
    }
    registerGamepadButtons() {
        console.log('registerGamepadButtons bot player%s', this.playerNumber);
        setTimeout(() => {
          this.fireWeapon();
        }, 1000);
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
      const nextMovementDelay = _.random(500, 1500, true);
      setTimeout(this.updateBotDirection.bind(this), nextMovementDelay);
    }
}
