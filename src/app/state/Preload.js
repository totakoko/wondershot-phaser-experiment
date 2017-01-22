import Phaser from 'phaser';
import WS from '../WS';

export default WS.State.Preload = class Preload extends Phaser.State {
    preload() {
        this.preloadBar = this.add.sprite(WS.game.world.centerX, WS.game.world.centerY, 'preload-bar');
        this.preloadBar.anchor.setTo(0.5, 0.5);
        this.load.setPreloadSprite(this.preloadBar);

        for (const entityName of Object.keys(WS.Components)) {
          // console.log(`preloading ${entityName}`)
          WS.Components[entityName].preload();
        }
    }
    create() {
        WS.Services.PadManager.init();
        // WS.game.state.start('main');

        // DEBUG
        WS.game.state.start('round', true, false, {
          battle: new WS.Lib.Battle({
            // players: ['1', '2']
            players: ['1', '2', '3', '4']
          })
        });
    }
};
