import * as dat from 'dat.gui'
import Phaser from 'phaser'
import logger from 'loglevel'
import AbstractInput from './AbstractInput'

const log = logger.getLogger('KeyboardInput') // eslint-disable-line no-unused-vars

export default class KeyboardInput extends AbstractInput {
  constructor (options) {
    super({
      scene: options.scene,
      fireWeapon: options.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
      dropWeapon: options.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT),
      jump: options.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.CTRL),
      togglePauseMenu: options.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC)
    })
    this.axes = [0, 0]
    this.movement = {
      axes: this.axes
    }

    const gui = new dat.GUI()
    gui.add(this.movement.axes, 0).listen()
    gui.add(this.movement.axes, 1).listen()

    const scene = options.scene
    // onDown : on ajoute un mouvement dans la direction de la touche
    scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)
      .on('down', () => {
        console.log('left down')
        this.axes[0] -= 1
      })
      .on('up', () => {
        console.log('left up')
        this.axes[0] += 1
      })
    scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)
      .on('down', () => {
        console.log('right down')
        this.axes[0] += 1
      })
      .on('up', () => {
        console.log('right up')
        this.axes[0] -= 1
      })
    scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP)
      .on('down', () => {
        this.axes[1] -= 1
      })
      .on('up', () => {
        this.axes[1] += 1
      })
    scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN)
      .on('down', () => {
        this.axes[1] += 1
      })
      .on('up', () => {
        this.axes[1] -= 1
      })

    // onUp : on supprime le mouvement dans la direction de la touche
    // scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT).onUp.on('down', () => {
    //   this.axes[0] += 1
    // })
    // scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT).onUp.on('down', () => {
    //   this.axes[0] -= 1
    // })
    // scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP).onUp.on('down', () => {
    //   this.axes[1] += 1
    // })
    // scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN).onUp.on('down', () => {
    //   this.axes[1] -= 1
    // })
  }
}
