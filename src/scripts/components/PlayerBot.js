const PlayerBot = WS.Components.PlayerBot = class Player extends WS.Components.Player {
    constructor(options) {
        super(options);
    }
    registerGamepadButtons() {
        console.log('registerGamepadButtons bot player%s', this.playerNumber);
        setTimeout(() => {
          this.fireWeapon();
        }, 1000);
    }
    update() {
      if (this.pad.connected && this.sprite.alive) {
          let moveX = _.random(-1, 1, true);
          let moveY = _.random(-1, 1, true);
          if (moveX || moveY) {
              this.sprite.rotation = Math.atan2(moveY, moveX);
              this.sprite.body.x += moveX * WS.Config.PlayerSpeed;
              this.sprite.body.y += moveY * WS.Config.PlayerSpeed;
          }
      }
      this.indicator.animations.frame = this.pad.connected ? 0 : 1;
    }
}
