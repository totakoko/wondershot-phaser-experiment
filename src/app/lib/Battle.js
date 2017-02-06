import _ from 'lodash';
import WS from '../WS';
// const log = require('misc/loglevel');
const log = require('misc/loglevel').getLogger('Battle'); // eslint-disable-line no-unused-vars

export default WS.Lib.Battle = class Battle {
  constructor(options) {
    this.players = options.players;
    if (this.players.length < 1) {
      throw new Error('Battle: 0 players');
    }
    log.info(`Initializing with ${this.players.length} players`);

    this.score = {};
    _.each(this.players, player => {
      this.score[player.id] = 0;
    });
  }

  notifyPlayerKilled(playerNumber) {
    log.info(`Player ${playerNumber} has died.`);
    this.alivePlayers.splice(this.alivePlayers.indexOf(playerNumber), 1);
    log.info(`Remaining players : ${this.alivePlayers}`);
    this.checkEndOfRound();
  }
  checkEndOfRound() {
    // si plus d'un joueur encore en jeu, ce n'est pas la fin
    if (this.alivePlayers.length > 1) {
      return;
    }

    // si aucun timer de fin n'est en cours
    // cad c'est la 1ère fois qu'on détecte la fin
    if (this.endOfRoundTimer === null) {
      this.endOfRoundTimer = WS.game.time.events.add(1000, () => {
        // let endOfRoundMessage = this.alivePlayers.length ? `Player ${this.alivePlayers[0]} wins !` : 'Draw !';
        let endOfRoundMessage;
        if (this.alivePlayers.length === 1) {
          endOfRoundMessage = `${WS.Config.PlayerColors[this.alivePlayers[0]].name} wins !`;
          this.addRoundVictory(this.alivePlayers[0]); // A FAIRE : mettre ça dans un autre état / écran de résultat
        } else if (this.alivePlayers.length === 0) {
          endOfRoundMessage = 'Draw !';
        }
        log.info(endOfRoundMessage);

        const endOfRoundMessageText = WS.game.add.bitmapText(WS.game.world.centerX, WS.game.world.centerY, 'desyrel', endOfRoundMessage, 64);
        endOfRoundMessageText.anchor.x = 0.5;
        endOfRoundMessageText.anchor.y = 0.5;

        WS.game.time.events.add(1500, () => {
          endOfRoundMessageText.destroy();
          this.showScoreBoard();
          // DEBUG round suivant directement
          // WS.game.state.start('round', true, false, {
          //   battle: this
          // });
        });
      });
    }
  }
  reset() {
    this.alivePlayers = _.map(this.players, 'id');
    this.stage = new WS.Lib.Stage();
    this.endOfRoundTimer = null;
  }
  addRoundVictory(playerNumber) {
      this.score[playerNumber]++;
      if (this.score[playerNumber] === WS.Config.RoundsVictory) {
          log.info(`Player ${playerNumber} has won the battle!`); // A FAIRE, quand c'est gagné, bah on ne recommence pas un autre round
          this.end();
      }
  }
  showScoreBoard() {
    this.stage.register(new WS.Components.ScoreBoard(this));

    WS.game.physics.p2.pause();
    WS.game.time.events.pause();
    WS.game.tweens.pauseAll();
    // après 3 secondes on démarre un nouveau round
    setTimeout(() => {
      WS.game.state.start('round', true, false, {
        battle: this
      });
    }, 3000);
  }

  end() {
    // fin du battle et démarrage d'un nouveau
    setTimeout(() => {
      WS.game.state.start('round', true, false, {
        battle: new WS.Lib.Battle({
          players: this.players
        })
      });
    }, 3000);
    // écran de résultat
    // puis redémarrage de battle pour menu principal
  }

};
