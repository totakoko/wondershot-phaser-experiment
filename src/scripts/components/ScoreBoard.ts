module Wondershot.Components {
  export class ScoreBoard {
    static _game;
    static _score;

    static init(game) {
      this.game = game;
      return this;
    }
    static create() {
      this.score = {
        1: 0,
        2: 0,
        3: 0,
        4: 0
      };
      this.scoreText = this.game.Groups.UI.add(new Phaser.Text(this.game, this.game.world.width / 2, 30, '', { font: '20px Arial' }));
      this.scoreText.anchor.setTo(0.5, 0.5);
      this.update();
    }
    static update() {
      this.scoreText.text = `Red ${this.score[1]} - ${this.score[2]} Blue`;
    }
    static addPoint(playerNumber: number) {
      this.score[playerNumber]++;
      if (this.score[playerNumber] === Wondershot.Config.RoundsVictory) {
        console.log('Player ' + playerNumber + ' is victorious');
      }
    }
  }
}
