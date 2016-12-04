Wondershot.Game = class Game extends Phaser.Game {
    constructor() {
        super({
            width: 400,
            height: 700,
            transparent: false,
            enableDebug: true
        });
        // arena is 800x600
        this.state.add('boot', Wondershot.State.Boot);
        this.state.add('preload', Wondershot.State.Preload);
        this.state.add('main', Wondershot.State.Main);
        this.state.add('battle', Wondershot.State.Battle);
        this.state.start('boot');
    }
}
