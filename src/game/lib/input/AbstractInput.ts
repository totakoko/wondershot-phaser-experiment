import { ControlledPlayer } from '@/game/entities/Player'

export interface InputOptions {
  scene: Phaser.Scene
  player: ControlledPlayer
}

export class AbstractInput {
  scene: Phaser.Scene
  player: ControlledPlayer

  constructor (protected readonly options: InputOptions) {
    this.scene = options.scene
    this.player = options.player
  }
}
