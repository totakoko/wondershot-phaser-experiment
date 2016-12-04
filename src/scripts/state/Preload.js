const Preload = Wondershot.State.Preload = class Preload extends Phaser.State {
    preload() {
        this.preloadBar = this.add.sprite(290, 290, 'preload-bar');
        this.load.setPreloadSprite(this.preloadBar);
    }
    create() {
        setTimeout(() => {
            this.game.state.start('main');
        }, 1000);
    }
}
