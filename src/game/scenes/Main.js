import Phaser from 'phaser'
import logger from 'loglevel'

const log = logger.getLogger('Main') // eslint-disable-line no-unused-vars

export default class Main extends Phaser.Scene {
  create () {
    const mainMenuTitle = this.add.text(this.world.centerX, 150, 'Main Menu', { font: '42px Arial', fill: '#000' })
    mainMenuTitle.anchor.setTo(0.5, 0.5)

    const optionBattle = this.add.text(this.world.centerX, 250, 'Battle', { font: '24px Arial', fill: '#000' })
    optionBattle.anchor.setTo(0.5, 0.5)
    optionBattle.inputEnabled = true
    optionBattle.events.onInputUp.add(this.optionBattleSelected, this)
    // button = this.add.button(this.world.centerX - 95, 400, 'button', actionOnClick, this, 2, 1, 0);
    //
    // button.onInputUp.add(optionBattleSelected, this);
    // for (let component of this.components) {
    //     if (component.create) {
    //         component.create();
    //     }
    // }
  }
  optionBattleSelected () {
    log.info('battle is coming', arguments)
    this.state.start('characterSelection')
  }
  update () {
    // for (let component of this.components) {
    //     if (component.update) {
    //         component.update();
    //     }
    // }
  }
  render () {
    // for (let component of this.components) {
    //     if (component.render) {
    //         component.render();
    //     }
    // }
    // FPS
    this.debug.text(this.time.fps, this.world.width - 25, 14, '#f00')
  }
}
