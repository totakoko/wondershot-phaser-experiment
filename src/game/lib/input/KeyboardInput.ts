import { Position } from '../Position'

import { AbstractInput, InputOptions } from './AbstractInput'

export class KeyboardInput extends AbstractInput {
  movementAxes: Position = {
    x: 0,
    y: 0
  }

  constructor (options: InputOptions) {
    super(options)

    this.player.setMovementAxes(this.movementAxes)

    this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
      .on('down', () => {
        this.player.loadWeapon()
      })
      .on('up', () => {
        this.player.releaseWeapon()
      })
    this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.CTRL)
      .on('down', () => {
        this.player.jump()
      })
    this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT)
      .on('down', () => {
        this.player.dropWeapon()
      })
    // pause is already global

    // onDown : on ajoute un mouvement dans la direction de la touche
    // onUp : on supprime le mouvement dans la direction de la touche
    this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)
      .on('down', () => {
        this.movementAxes.x -= 1
      })
      .on('up', () => {
        this.movementAxes.x += 1
      })
    this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)
      .on('down', () => {
        this.movementAxes.x += 1
      })
      .on('up', () => {
        this.movementAxes.x -= 1
      })
    this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP)
      .on('down', () => {
        this.movementAxes.y -= 1
      })
      .on('up', () => {
        this.movementAxes.y += 1
      })
    this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN)
      .on('down', () => {
        this.movementAxes.y += 1
      })
      .on('up', () => {
        this.movementAxes.y -= 1
      })
  }
}
