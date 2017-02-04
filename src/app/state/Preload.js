import Phaser from 'phaser';
import WS from '../WS';
const log = require('misc/loglevel').getLogger('Preload'); // eslint-disable-line no-unused-vars

export default WS.State.Preload = class Preload extends Phaser.State {
    preload() {
        this.preloadBar = this.add.sprite(WS.game.world.centerX, WS.game.world.centerY, 'preload-bar');
        this.preloadBar.anchor.setTo(0.5, 0.5);
        this.load.setPreloadSprite(this.preloadBar);

        for (const entityName of Object.keys(WS.Components)) {
          log.info(`preloading ${entityName}`);
          WS.Components[entityName].preload();
        }
    }
    create() {
        WS.Services.PadManager.init();
        // WS.game.state.start('main');

        // DEBUG
        WS.game.state.start('round', true, false, {
          battle: new WS.Lib.Battle({
            players: [{
              id: 1,
              type: 'Keyboard',
            }, {
              id: 2,
              type: 'Bot',
            }, {
              id: 3,
              type: 'Bot',
            }, {
              id: 4,
              type: 'Bot',
            }]
          })
        });
    }
};
