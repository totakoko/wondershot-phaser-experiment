import { Player } from '../Player'

import { WeaponFactoryConfig } from './lib/FactoryConfig'
import { WeaponCarried, WeaponCarriedOptions } from './lib/WeaponCarried'

import { depths } from '@/game/config'
import { WeaponOnGround, WeaponOnGroundOptions } from '@/game/entities/weapons/lib/WeaponOnGround'
import { Entity, EntityOptions } from '@/game/lib/Entity'
import { RoundScene } from '@/game/scenes/RoundScene'

export class WeaponOnGroundSlingshot extends WeaponOnGround {
  constructor (options: WeaponOnGroundOptions) {
    super({
      scene: options.scene,
      spriteName: 'weapon-slingshot',
      factoryConfig: slingshotFactoryConfig,
      position: options.position,
      initialAngle: options.initialAngle,
      dropOwner: options.dropOwner
    })
  }
}

const WeaponCarriedDistance = 30

export class WeaponCarriedSlingshot extends WeaponCarried {
  constructor (options: WeaponCarriedOptions) {
    super({
      scene: options.scene,
      spriteName: 'weapon-slingshot',
      factoryConfig: slingshotFactoryConfig,
      player: options.player
    })
  }

  update () {
    // the weapon is placed slightly in front of the player
    const targetWeaponPositionRotation = this.player.sprite.rotation + 0.2 // small shift so as not to be in the middle of the player
    this.sprite.x = this.player.sprite.body.position.x + Math.cos(targetWeaponPositionRotation) * WeaponCarriedDistance
    this.sprite.y = this.player.sprite.body.position.y + Math.sin(targetWeaponPositionRotation) * WeaponCarriedDistance
    this.sprite.angle = this.player.sprite.angle + 90 // rotation is relative to the player
  }

  fire (power: number) {
    this.scene.battle.stage.register(new WeaponSlingshotProjectile({
      scene: this.scene,
      player: this.player,
      power
    }))
    // remove the weapon from the player
    this.player.weapon = null
    this.scene.battle.stage.remove(this)
  }
}

const ProjectileMinimumSpeed = 10
const ProjectileMaximumSpeed = 30
const ProjectileMinimumSize = 8
const ProjectileMaximumSize = 16
const ProjectileOffset = 50

function getProjectileSpeed (power: number) {
  return power * (ProjectileMaximumSpeed - ProjectileMinimumSpeed) / 100 + ProjectileMinimumSpeed
}

function getProjectileSize (power: number) {
  return 20 - power * (ProjectileMaximumSize - ProjectileMinimumSize) / 100
}

const ProjectileMaximumBounces = 3
const ProjectileSpriteSizeRadio = 24

export interface WeaponSlingshotProjectileOptions extends EntityOptions<RoundScene> {
  player: Player
  power: number
}

class WeaponSlingshotProjectile extends Entity<RoundScene> {
  public sprite!: Phaser.Physics.Matter.Image

  bounceLeft = ProjectileMaximumBounces

  constructor (private readonly options: WeaponSlingshotProjectileOptions) {
    super(options)

    const ownerPosition = this.options.player.sprite.body.position
    const ownerRotation = this.options.player.sprite.rotation

    this.sprite = this.scene.matter.add.image(
      ownerPosition.x + Math.cos(ownerRotation) * ProjectileOffset,
      ownerPosition.y + Math.sin(ownerRotation) * ProjectileOffset,
      'weapon-slingshot-projectile'
    )
    this.scene.Groups.Projectiles.add(this.sprite)
    this.sprite.setDepth(depths.Projectiles)

    const projectileSize = getProjectileSize(this.options.power)
    const projectileSpeed = getProjectileSpeed(this.options.power)
    this.sprite.tint = this.options.player.playerOptions.color.tint
    this.sprite.setScale(projectileSize / ProjectileSpriteSizeRadio)
    this.sprite.setCircle(projectileSize)
    this.sprite.setRotation(ownerRotation)
    this.sprite.setVelocity(Math.cos(ownerRotation) * projectileSpeed, Math.sin(ownerRotation) * projectileSpeed)
    this.sprite.setMass(0.001)
    this.sprite.setBounce(1)
    this.sprite.setFriction(0, 0, 0)

    this.sprite.setOnCollideWith(this.scene.matter.world.getAllBodies(), () => {
      this.bounceLeft--
      if (this.bounceLeft < 0) {
        // convert the projectile to a weapon on the ground
        this.scene.battle.stage.register(new WeaponOnGroundSlingshot({ // eslint-disable-line new-cap
          scene: this.scene,
          position: this.sprite.body.position
        }))
        this.scene.battle.stage.remove(this)
      }
    })
    // TODO do not bounce with the owner
    this.sprite.setOnCollideWith(this.scene.Groups.Players.getChildren(), (bodyA: MatterJS.BodyType) => {
      const player = bodyA.gameObject?.getData('player') as Player
      if (player !== undefined) {
        if (player !== this.options.player) {
          player.kill()
        } else if (player.weapon === null) {
          this.scene.battle.stage.register(new WeaponCarriedSlingshot({
            scene: this.scene,
            player
          }))
          this.scene.battle.stage.remove(this)
        }
      }
    })
  }

  destroy () {
    this.sprite.destroy()
  }
}

const slingshotFactoryConfig: WeaponFactoryConfig = {
  dropEntity: WeaponOnGroundSlingshot,
  pickUpEntity: WeaponCarriedSlingshot
}
