module Wondershot.Components {
  export class ScoreBoard {
    static _game;
    static _score;

    static init(game) {
      _game = game;

      _score = [0, 0];
      this.scoreText = _game.add.text(game.world.width/2, 30, '', { font: '20px Arial' });
      this.scoreText.anchor.setTo(0.5, 0.5);
      this.update();
      return this;
    }
    static update() {
      this.scoreText.text = `Red ${_score[0]} - ${_score[1]} Blue`
    }
    static addPoint(playerNumber:number) {
      _score[playerNumber-1]++;
      if (_score[playerNumber-1] === Wondershot.Config.RoundsVictory) {
        console.log('Player ' + playerNumber + ' is victorious');
      }
    }
  }
}
