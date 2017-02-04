import _ from 'lodash';
import WS from '../../WS';
const log = require('misc/loglevel').getLogger('BotInput'); // eslint-disable-line no-unused-vars

export default WS.Lib.Input.BotInput = class BotInput extends WS.Lib.Input.AbstractInput {
  constructor(options) {
    super({});
    this.player = options.player;
    this.movement = [0, 0];
    setTimeout(() => {
      this.updateBotDirection();
      this.fireRandomly();
    });
  }

      // update() {
      //   // le joueur doit être actif et le jeu pas en pause
      //   if (this.sprite.alive && !WS.game.physics.p2.paused) {
      //     if (this.movement.x || this.movement.y) {
      //         this.sprite.rotation = Math.atan2(this.movement.y, this.movement.x);
      //         this.sprite.body.x += this.movement.x * WS.Config.PlayerSpeed;
      //         this.sprite.body.y += this.movement.y * WS.Config.PlayerSpeed;
      //     }
      //   }
      // }

  updateBotDirection() {
    this.movement[0] = _.random(-1, 1, true);
    this.movement[1] = _.random(-1, 1, true);
    const nextActionDelay = _.random(500, 1500, true);
    WS.game.time.events.add(nextActionDelay, this.updateBotDirection, this);
  }
  fireRandomly() {
    this.player.fireWeapon();
    const nextActionDelay = _.random(1, 5, true);
    WS.game.time.events.add(WS.Phaser.Timer.SECOND * nextActionDelay, this.fireRandomly, this);
  }
};
