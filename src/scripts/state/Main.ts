module Wondershot.State {
  export class Main extends Phaser.State {
    components = [];

    // constructeur utilisé pour propager l'instance game partout
    constructor(game) {
      this.components = [
      ];
    }

    preload() {
      for (let component of this.components) {
        if (component.preload) {
          component.preload();
        }
      }
    }
    create() {

      mainMenuTitle = this.game.add.text(this.game.world.centerX, 150, 'Main Menu', { font: '42px Arial', fill: '#000' });
      mainMenuTitle.anchor.setTo(0.5, 0.5);

      optionBattle = this.game.add.text(this.game.world.centerX, 250, 'Battle', { font: '24px Arial', fill: '#000' });
      optionBattle.anchor.setTo(0.5, 0.5);
      optionBattle.inputEnabled = true;
      optionBattle.events.onInputUp.add(this.optionBattleSelected, this);

      // button = this.game.add.button(this.game.world.centerX - 95, 400, 'button', actionOnClick, this, 2, 1, 0);
      //
      // button.onInputUp.add(optionBattleSelected, this);

      for (let component of this.components) {
        if (component.create) {
          component.create();
        }
      }
    }
    optionBattleSelected() {
      console.log('battle is coming', arguments);
      this.game.state.start('battle');
    }

    update() {
      for (let component of this.components) {
        if (component.update) {
          component.update();
        }
      }
    }
    render() {
      for (let component of this.components) {
        if (component.render) {
          component.render();
        }
      }
      // FPS
      this.game.debug.text(this.game.time.fps, this.game.world.width - 25, 14, "#f00");
    }
  }
}
