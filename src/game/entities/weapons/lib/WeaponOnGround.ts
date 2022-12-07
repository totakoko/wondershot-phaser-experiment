import { WeaponFactoryConfig } from './FactoryConfig'

import { depths } from '@/game/config'
import { Player } from '@/game/entities/Player'
import { Entity, EntityOptions } from '@/game/lib/Entity'
import { Position } from '@/game/lib/Position'
import { RoundScene } from '@/game/scenes/RoundScene'
import { getRandomNumber } from '@/util'

export interface WeaponOnGroundOptions extends EntityOptions<RoundScene> {
  position: Position
  initialAngle?: number
  dropOwner?: Player // the player that dropped the weapon
}

export interface FullWeaponOnGroundOptions extends EntityOptions<RoundScene> {
  spriteName: string
  factoryConfig: WeaponFactoryConfig
  position: Position
  initialAngle?: number
  dropOwner?: Player // the player that dropped the weapon
}

export class WeaponOnGround extends Entity<RoundScene> {
  public sprite!: Phaser.Physics.Matter.Image
  private readonly spawnAnimation: Phaser.Tweens.Tween
  private readonly rotateAnimation: Phaser.Tweens.Tween

  constructor (private readonly options: FullWeaponOnGroundOptions) {
    super(options)

    this.sprite = this.scene.matter.add.image(options.position.x, options.position.y, options.spriteName)
    this.scene.Groups.Objects.add(this.sprite)
    this.sprite.setDepth(depths.Objects)
    this.sprite.setCircle(0.8 * Math.max(this.sprite.width, this.sprite.height) / 2)
    this.sprite.setStatic(true)
    this.sprite.setAngle(options.initialAngle ?? getRandomNumber(-180, 180))
    this.sprite.setSensor(true) // trigger collision events, but don't react with colliding body physically

    this.spawnAnimation = this.scene.tweens.add({
      targets: [this.sprite],
      duration: 300,
      ease: 'Linear',
      props: {
        scale: {
          start: 0,
          from: 0,
          to: 1
        }
      }
    })

    // 1 rotation in 6 seconds
    this.rotateAnimation = this.scene.tweens.add({
      targets: [this.sprite],
      duration: 6000,
      loop: -1,
      ease: 'Linear',
      props: {
        angle: {
          from: this.sprite.angle + 0,
          to: this.sprite.angle + 359
        }
      }
    })

    // make the players pick up the weapon on collision
    this.sprite.setOnCollide((pair: Phaser.Types.Physics.Matter.MatterCollisionData) => {
      const player = pair.bodyA.gameObject.getData('player') as Player | undefined
      if (player != null && player?.weapon === null && player !== this.options.dropOwner) {
        this.scene.battle.stage.register(new this.options.factoryConfig.pickUpEntity({ // eslint-disable-line new-cap
          scene: this.scene,
          spriteName: this.sprite.name,
          factoryConfig: this.options.factoryConfig,
          player
        }))
        this.scene.battle.stage.remove(this)
      }
    })

    // reset the drop owner so that he can picks up the weapon after the second collision
    this.sprite.setOnCollideEnd((pair: Phaser.Types.Physics.Matter.MatterCollisionData) => {
      const player = pair.bodyA.gameObject.getData('player') as Player | undefined
      if (player === this.options.dropOwner) {
        this.options.dropOwner = undefined
      }
    })
  }

  destroy () {
    this.scene.tweens.remove(this.spawnAnimation)
    this.scene.tweens.remove(this.rotateAnimation)
    this.sprite.destroy()
  }
}
