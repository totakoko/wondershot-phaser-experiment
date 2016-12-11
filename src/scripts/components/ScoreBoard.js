WS.Components.ScoreBoard = class ScoreBoard extends WS.Lib.Entity {
    static create() {
        this.score = {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
        };
        this.scoreText = WS.game.Groups.UI.add(new Phaser.Text(WS.game, WS.game.world.width / 2, 30, '', { font: '20px Arial' }));
        this.scoreText.anchor.setTo(0.5, 0.5);
        this.update();
    }
    static update() {
        this.scoreText.text = `Red ${this.score[1]} - ${this.score[2]} Blue`;
    }
    static addPoint(playerNumber) {
        this.score[playerNumber]++;
        if (this.score[playerNumber] === WS.Config.RoundsVictory) {
            console.log('Player ' + playerNumber + ' is victorious');
        }
    }
}
