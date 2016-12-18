WS.Game = class Game extends Phaser.Game {
    constructor() {
        super({
            width: 400,
            height: 700,
            transparent: false,
            enableDebug: true
        });
        // arena is 800x600
        this.state.add('boot', WS.State.Boot);
        this.state.add('preload', WS.State.Preload);
        this.state.add('main', WS.State.Main);
        this.state.add('characterSelection', WS.State.CharacterSelection);
        this.state.add('battle', WS.State.Battle);
        this.state.start('boot');
    }
}
