import Phaser from 'phaser';
import WS from '../WS';

export default WS.State.Boot = class Boot extends Phaser.State {
    preload() {
        this.load.image('preload-bar', 'assets/images/preloader.gif');
        this.load.bitmapFont('desyrel', 'assets/fonts/bitmapFonts/desyrel.png', 'assets/fonts/bitmapFonts/desyrel.xml');
    }
    create() {
        WS.game.stage.backgroundColor = 0xFFFFFF;
        WS.game.stage.disableVisibilityChange = true;
        WS.game.input.maxPointers = 1;
        WS.game.state.start('preload');
    }
};
