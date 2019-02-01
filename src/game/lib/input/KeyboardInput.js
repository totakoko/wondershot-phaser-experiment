import logger from 'loglevel'
import AbstractInput from './AbstractInput'

const log = logger.getLogger('KeyboardInput') // eslint-disable-line no-unused-vars

export default class KeyboardInput extends AbstractInput {
  constructor (options) {
    super({
      fireWeapon: WS.game.input.keyboard.addKey(WS.Phaser.Keyboard.SPACEBAR),
      dropWeapon: WS.game.input.keyboard.addKey(WS.Phaser.Keyboard.SHIFT),
      jump: WS.game.input.keyboard.addKey(WS.Phaser.Keyboard.CONTROL),
      togglePauseMenu: WS.game.input.keyboard.addKey(WS.Phaser.Gamepad.ENTER)
    })
    this.axes = [0, 0]
    this.movement = {
      axes: this.axes
    }

    // onDown : on ajoute un mouvement dans la direction de la touche
    WS.game.input.keyboard.addKey(WS.Phaser.Keyboard.LEFT).onDown.add(() => {
      this.axes[0] -= 1
    })
    WS.game.input.keyboard.addKey(WS.Phaser.Keyboard.RIGHT).onDown.add(() => {
      this.axes[0] += 1
    })
    WS.game.input.keyboard.addKey(WS.Phaser.Keyboard.UP).onDown.add(() => {
      this.axes[1] -= 1
    })
    WS.game.input.keyboard.addKey(WS.Phaser.Keyboard.DOWN).onDown.add(() => {
      this.axes[1] += 1
    })

    // onUp : on supprime le mouvement dans la direction de la touche
    WS.game.input.keyboard.addKey(WS.Phaser.Keyboard.LEFT).onUp.add(() => {
      this.axes[0] += 1
    })
    WS.game.input.keyboard.addKey(WS.Phaser.Keyboard.RIGHT).onUp.add(() => {
      this.axes[0] -= 1
    })
    WS.game.input.keyboard.addKey(WS.Phaser.Keyboard.UP).onUp.add(() => {
      this.axes[1] += 1
    })
    WS.game.input.keyboard.addKey(WS.Phaser.Keyboard.DOWN).onUp.add(() => {
      this.axes[1] -= 1
    })
  }
}
