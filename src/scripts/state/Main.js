const Main = WS.State.Main = class Main extends Phaser.State {
  create() {
      const mainMenuTitle = WS.game.add.text(WS.game.world.centerX, 150, 'Main Menu', { font: '42px Arial', fill: '#000' });
      mainMenuTitle.anchor.setTo(0.5, 0.5);
      const optionBattle = WS.game.add.text(WS.game.world.centerX, 250, 'Battle', { font: '24px Arial', fill: '#000' });
      optionBattle.anchor.setTo(0.5, 0.5);
      optionBattle.inputEnabled = true;
      optionBattle.events.onInputUp.add(this.optionBattleSelected, this);
      // button = WS.game.add.button(WS.game.world.centerX - 95, 400, 'button', actionOnClick, this, 2, 1, 0);
      //
      // button.onInputUp.add(optionBattleSelected, this);
      // for (let component of this.components) {
      //     if (component.create) {
      //         component.create();
      //     }
      // }
  }
  optionBattleSelected() {
      console.log('battle is coming', arguments);
      WS.game.state.start('battle');
  }
  update() {
      // for (let component of this.components) {
      //     if (component.update) {
      //         component.update();
      //     }
      // }
  }
  render() {
      // for (let component of this.components) {
      //     if (component.render) {
      //         component.render();
      //     }
      // }
      // FPS
      WS.game.debug.text(WS.game.time.fps, WS.game.world.width - 25, 14, "#f00");
  }
}
