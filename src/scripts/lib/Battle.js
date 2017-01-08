const Battle = WS.Lib.Battle = class Battle {
  constructor(options) {
    this.players = options.players;
    if (this.players.length < 1) {
      throw new Error('ScoreBoard: 0 players');
    }

    this.score = {};
    _.each(this.players, (playerNumber) => {
      this.score[playerNumber] = 0;
    });
  }

  addPoint(playerNumber) {
      this.score[playerNumber]++;
      if (this.score[playerNumber] === WS.Config.RoundsVictory) {
          console.log(`Player ${playerNumber} is victorious !`);
          // BattleManager.endRound()
      }
      // if (_.chain(this.players).map('alive').filter().value().length == 1) {
        setTimeout(() => {
          console.log('End of the round');
          // start next round
          WS.game.state.start('round', true, false, {
            battle: this
          });
        }, 2000);
      // }
  }

}
