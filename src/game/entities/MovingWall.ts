import log from 'loglevel'

import { depths } from '../config'

import { ROUND_START } from '@/game/events'
import { Entity, EntityOptions } from '@/game/lib/Entity'
import { Position } from '@/game/lib/Position'
import { RoundScene } from '@/game/scenes/RoundScene'

const logger = log.getLogger('Arena') // eslint-disable-line no-unused-vars

export interface MovingWallOptions extends EntityOptions<RoundScene> {
  from: Position
  to: Position
}

export class MovingWall extends Entity<RoundScene> {
  private sprite!: Phaser.Physics.Matter.Image
  private animationTimeline!: Phaser.Tweens.Timeline

  constructor (private readonly options: MovingWallOptions) {
    super(options)
  }

  create () {
    logger.info(`Creating moving wall (${this.options.from.x},${this.options.from.y}) -> (${this.options.to.x},${this.options.to.y})`)
    this.sprite = this.scene.matter.add.image(this.options.from.x, this.options.from.y, 'wall')
    this.sprite.setStatic(true)
    this.sprite.setBounce(1)

    this.scene.Groups.Arena.add(this.sprite)
    this.sprite.setDepth(depths.Arena)

    this.scene.events.once(ROUND_START, () => {
      this.animationTimeline = this.scene.tweens.timeline({
        targets: [this.sprite],
        loop: -1,
        loopDelay: 1000,
        tweens: [{
          ease: 'Linear',
          duration: 2000,
          ...this.options.to
        }, {
          ease: 'Linear',
          delay: 1000,
          duration: 2000,
          ...this.options.from
        }]
      })
    })
  }

  destroy (): void {
    this.animationTimeline.destroy()
  }
}
