const Boot = WS.State.Boot = class Boot extends Phaser.State {
    preload() {
        this.load.image('preload-bar', 'assets/images/preloader.gif');
    }
    create() {
        WS.game.stage.backgroundColor = 0xFFFFFF;
        this.input.maxPointers = 1;
        this.stage.disableVisibilityChange = true;
        WS.game.state.start('preload');
    }
}
