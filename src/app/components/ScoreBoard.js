import WS from '../WS';
const log = require('misc/loglevel').getLogger('ScoreBoard'); // eslint-disable-line no-unused-vars

export default WS.Components.ScoreBoard = class ScoreBoard extends WS.Lib.Entity {
    static preload() {
      WS.game.load.script('filterX', 'https://cdn.rawgit.com/photonstorm/phaser/c298a45d1fc0e90618736ade3782ee82a39f7108/v2/filters/BlurX.js');
      WS.game.load.script('filterY', 'https://cdn.rawgit.com/photonstorm/phaser/c298a45d1fc0e90618736ade3782ee82a39f7108/v2/filters/BlurY.js');
    }
    constructor(battle) {
      super();
      this.battle = battle;
    }
    create() {
        this.blurX = WS.game.add.filter('BlurX');
        this.blurY = WS.game.add.filter('BlurY');
        // this.blurX.setResolution(800, 600);
        // this.blurY.setResolution(800, 600);

        WS.game.Groups.Game.filters = [this.blurX, this.blurY];

        let scoreTextMessage = '';
        for (const playerNumber in this.battle.score) {
          scoreTextMessage += `${WS.Config.PlayerColors[playerNumber].name} : ${this.battle.score[playerNumber]} \n`;
        }
        const scoreText = WS.game.add.bitmapText(WS.game.world.centerX, 200, 'desyrel', 'Score', 48);
        scoreText.anchor.x = 0.5;
        const scoreInfoText = WS.game.add.bitmapText(WS.game.world.centerX, 300, 'desyrel', scoreTextMessage, 48);
        scoreInfoText.anchor.x = 0.5;
        // scoreText.anchor.y = 0.5;
    }
};
