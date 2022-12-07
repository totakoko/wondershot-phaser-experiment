import { PlayerColor } from './Player'

import { depths } from '@/game/config'
import { Entity, EntityOptions } from '@/game/lib/Entity'
import { Position } from '@/game/lib/Position'
import { RoundScene } from '@/game/scenes/RoundScene'

export interface DeathMarkerOptions extends EntityOptions<RoundScene> {
  position: Position
  playerColor: PlayerColor
}

export class DeathMarker extends Entity<RoundScene> {
  public sprite!: Phaser.GameObjects.Sprite

  constructor (public readonly options: DeathMarkerOptions) {
    super(options)
  }

  create () {
    this.sprite = this.scene.add.sprite(this.options.position.x, this.options.position.y, 'player-death-marker')
    this.scene.Groups.Arena.add(this.sprite)
    this.sprite.setDepth(depths.Arena)
    this.sprite.tint = this.options.playerColor.tint
  }

  destroy () {
    this.sprite.destroy()
  }
}
