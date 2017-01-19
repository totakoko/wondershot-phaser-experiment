import Phaser from 'phaser';
import WS from '../WS';

export default WS.State.CharacterSelection = class CharacterSelection extends Phaser.State {
  create() {
      const mainMenuTitle = WS.game.add.text(WS.game.world.centerX, 42, 'Character Selection', {font: '42px Arial', fill: '#000'});
      mainMenuTitle.anchor.setTo(0.5, 0.5);

      // grille des états des joueurs
      this.playerStateIndicators = {};

      this.playerStateIndicators[1] = WS.game.add.text(WS.game.world.centerX * 2 / 3, WS.game.world.centerY * 2 / 3, '', {font: '60px Arial', fill: WS.Config.PlayerColors[1].hex});
      this.playerStateIndicators[1].anchor.setTo(0.5, 0.5);

      this.playerStateIndicators[2] = WS.game.add.text(WS.game.world.centerX * 4 / 3, WS.game.world.centerY * 2 / 3, '', {font: '60px Arial', fill: WS.Config.PlayerColors[2].hex});
      this.playerStateIndicators[2].anchor.setTo(0.5, 0.5);

      this.playerStateIndicators[3] = WS.game.add.text(WS.game.world.centerX * 2 / 3, WS.game.world.centerY * 4 / 3, '', {font: '60px Arial', fill: WS.Config.PlayerColors[3].hex});
      this.playerStateIndicators[3].anchor.setTo(0.5, 0.5);

      this.playerStateIndicators[4] = WS.game.add.text(WS.game.world.centerX * 4 / 3, WS.game.world.centerY * 4 / 3, '', {font: '60px Arial', fill: WS.Config.PlayerColors[4].hex});
      this.playerStateIndicators[4].anchor.setTo(0.5, 0.5);

      const startBattleButton = WS.game.add.text(WS.game.world.centerX, WS.game.world.height - 50, 'Go', {font: '24px Arial', fill: '#000'});
      startBattleButton.anchor.setTo(0.5, 0.5);
      startBattleButton.inputEnabled = true;
      startBattleButton.events.onInputUp.add(this.startBattleButtonSelected, this);

      this.activePlayers = {};
      WS.Services.PadManager.setPadsCallback(padNumber => {
        this.activePlayers[padNumber] = !this.activePlayers[padNumber];
        console.log(`P${padNumber} ${this.activePlayers[padNumber]}`);
      });

      // WS.Services.PhysicsManager.init();
  }
  startBattleButtonSelected() {
      const activePlayers = _.chain(this.activePlayers)
                             .map((val, key) => {
                               return val ? key : false;
                             })
                             .filter()
                             .value();
     console.log('CharacterSelection: selected players %s', activePlayers);

      WS.game.state.start('round', true, false, {
        battle: new WS.Lib.Battle({
          players: activePlayers
        })
      });
  }
  update() {
    for (const playerNumber of Object.keys(this.activePlayers)) {
      this.playerStateIndicators[playerNumber].text = this.activePlayers[playerNumber] ? 'X' : '';
    }
  }
};
