import log from 'loglevel'

import { Player } from '../../Player'

import { WeaponFactoryConfig } from './FactoryConfig'

import { depths } from '@/game/config'
import { Entity, EntityOptions } from '@/game/lib/Entity'
import { Position } from '@/game/lib/Position'
import { RoundScene } from '@/game/scenes/RoundScene'

const logger = log.getLogger('WeaponCarried') // eslint-disable-line no-unused-vars

export interface WeaponCarriedOptions extends EntityOptions<RoundScene> {
  player: Player
}

export interface FullWeaponCarriedOptions extends EntityOptions<RoundScene> {
  spriteName: string
  factoryConfig: WeaponFactoryConfig
  player: Player
}

export class WeaponCarried extends Entity<RoundScene> {
  player: Player
  sprite: Phaser.GameObjects.Sprite

  weaponInUse = false
  private readonly spawnAnimation: Phaser.Tweens.Timeline

  constructor (private readonly options: FullWeaponCarriedOptions) {
    super(options)

    this.player = options.player
    this.player.weapon = this

    logger.debug(`Player ${this.player.playerOptions.id} picks up ${this.id}`)

    this.sprite = this.scene.add.sprite(
      this.player.sprite.x,
      this.player.sprite.y,
      options.spriteName
    )
    this.scene.Groups.PlayerItems.add(this.sprite)
    this.sprite.setDepth(depths.PlayerItems)

    this.spawnAnimation = this.scene.tweens.timeline({
      targets: [this.sprite],
      ease: 'Linear',
      tweens: [
        {
          duration: 150,
          props: {
            scale: {
              from: 1,
              to: 1.5
            }
          }
        },
        {
          duration: 200,
          props: {
            scale: {
              from: 1.5,
              to: 1
            }
          }
        }
      ]
    })
  }

  destroy () {
    this.spawnAnimation.destroy()
    this.sprite.destroy()
  }

  dropOnGround (position: Position, initialAngle?: number) {
    this.player.weapon = null
    this.scene.battle.stage.register(new this.options.factoryConfig.dropEntity({ // eslint-disable-line new-cap
      scene: this.scene,
      spriteName: this.options.spriteName,
      factoryConfig: this.options.factoryConfig,
      position,
      initialAngle,
      dropOwner: this.player
    }))
    this.scene.battle.stage.remove(this)
  }

  fire (power: number) {
    throw new Error(`not implemented (${power})`)
  }
}
