WS.Components.ScoreBoard = class ScoreBoard extends WS.Lib.Entity {
    constructor(players) {
        super();
        if (Object.keys(players).length < 1) {
          throw new Error('ScoreBoard: 0 players');
        }
        this.players = players;
        this.score = {};
        _.each(this.players, (player) => {
          this.score[player.playerNumber] = 0;
        });
    }
    create() {
        this.scoreText = WS.game.Groups.UI.add(new Phaser.Text(WS.game, WS.game.world.width / 2, 15, '', { font: '20px Arial' }));
        this.scoreText.anchor.setTo(0.5, 0);
        this.update();
    }
    update() {
        let scoreText = '';
        for (const playerNumber in this.score) {
          scoreText += `Player ${playerNumber} : ${this.score[playerNumber]} \n`;
        }
        this.scoreText.text = scoreText;
    }
    addPoint(playerNumber) {
        this.score[playerNumber]++;
        if (this.score[playerNumber] === WS.Config.RoundsVictory) {
            console.log('Player ' + playerNumber + ' is victorious');
            // BattleManager.endRound()
        }
        if (_.chain(this.players).map('alive').filter().value().length == 1) {
          console.log('End of the round');
          WS.game.state.start('battle', true, false, {
            activePlayers: ["1", "2"]
          });
        }
    }
}
