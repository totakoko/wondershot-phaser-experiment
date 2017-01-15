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

      const remainingPlayers = _.chain(this.players).map('alive').filter().value().length;

      console.log(`${remainingPlayers} remaining players.`);
      if (remainingPlayers === 1) {
        WS.game.time.events.add(2000, () => {
          console.log('End of the round');
          // start next round
          WS.game.state.start('round', true, false, {
            battle: this
          });
        });
      }
  }

  resetStage() {
    this.stage = new WS.Lib.Stage();
  }

}
