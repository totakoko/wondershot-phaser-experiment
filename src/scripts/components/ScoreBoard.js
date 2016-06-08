var Wondershot;
(function (Wondershot) {
    var Components;
    (function (Components) {
        var ScoreBoard = (function () {
            function ScoreBoard() {
            }
            ScoreBoard.init = function (game) {
                _game = game;
                _score = [0, 0];
                this.scoreText = _game.add.text(game.world.width / 2, 30, '', { font: '20px Arial' });
                this.scoreText.anchor.setTo(0.5, 0.5);
                this.update();
                return this;
            };
            ScoreBoard.update = function () {
                this.scoreText.text = "Red " + _score[0] + " - " + _score[1] + " Blue";
            };
            ScoreBoard.addPoint = function (playerNumber) {
                _score[playerNumber - 1]++;
                if (_score[playerNumber - 1] === Wondershot.Config.RoundsVictory) {
                    console.log('Player ' + playerNumber + ' is victorious');
                }
            };
            return ScoreBoard;
        }());
        Components.ScoreBoard = ScoreBoard;
    })(Components = Wondershot.Components || (Wondershot.Components = {}));
})(Wondershot || (Wondershot = {}));
