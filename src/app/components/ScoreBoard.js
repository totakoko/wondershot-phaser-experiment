import WS from '../';

export default class ScoreBoard extends WS.Lib.Entity {
    constructor(battle) {
      super();
      this.battle = battle;
    }
    create() {
        this.scoreText = WS.game.Groups.UI.add(new Phaser.Text(WS.game, WS.game.world.width / 2, 0, '', { font: '12px Arial' }));
        this.scoreText.anchor.setTo(0.5, 0);
        this.update();
    }
    update() {
        let scoreText = '';
        for (const playerNumber in this.battle.score) {
          scoreText += `Player ${playerNumber} : ${this.battle.score[playerNumber]} \n`;
        }
        this.scoreText.text = scoreText;
    }
}
