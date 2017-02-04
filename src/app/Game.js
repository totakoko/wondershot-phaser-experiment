import Phaser from 'phaser';
import WS from './WS';
const log = require('misc/loglevel').getLogger('Game'); // eslint-disable-line no-unused-vars

export default WS.Game = class Game extends Phaser.Game {
    constructor() {
        super({
            width: WS.Config.ArenaWidth,
            height: WS.Config.ArenaHeight,
            transparent: false,
            enableDebug: true
        });
        // arena is 800x600
        this.state.add('boot', WS.State.Boot);
        this.state.add('preload', WS.State.Preload);
        this.state.add('main', WS.State.Main);
        this.state.add('characterSelection', WS.State.CharacterSelection);
        this.state.add('round', WS.State.Round);
        this.state.start('boot');

        window.onkeyup = e => {
          if (e.key === 's') {
            this.destroy();
          }
        };
    }
};
