import _ from 'lodash';
import WS from '../WS';
const log = require('loglevel').getLogger('player');

export default WS.Components.PlayerBot = class PlayerBot extends WS.Components.Player {
    constructor(options) {
        super(options);

        this.movement = {
          x: 0,
          y: 0,
        };

        setTimeout(() => {
          this.updateBotDirection();
          this.fireRandomly();
        });
    }
    registerGamepadButtons() {
        log.debug('registerGamepadButtons bot player%s', this.playerNumber);
    }
    update() {
      // le joueur doit être actif et le jeu pas en pause
      if (this.sprite.alive && !WS.game.physics.p2.paused) {
        if (this.movement.x || this.movement.y) {
            this.sprite.rotation = Math.atan2(this.movement.y, this.movement.x);
            this.sprite.body.x += this.movement.x * WS.Config.PlayerSpeed;
            this.sprite.body.y += this.movement.y * WS.Config.PlayerSpeed;
        }
      }
    }

    updateBotDirection() {
      this.movement.x = _.random(-1, 1, true);
      this.movement.y = _.random(-1, 1, true);
      const nextActionDelay = _.random(500, 1500, true);
      WS.game.time.events.add(nextActionDelay, this.updateBotDirection, this);
    }
    fireRandomly() {
      this.fireWeapon();
      const nextActionDelay = _.random(1, 5, true);
      WS.game.time.events.add(WS.Phaser.Timer.SECOND * nextActionDelay, this.fireRandomly, this);
    }
};
