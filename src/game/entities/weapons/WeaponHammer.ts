import log from 'loglevel'

import { Player } from '../Player'

import { WeaponFactoryConfig } from './lib/FactoryConfig'
import { WeaponCarried, WeaponCarriedOptions } from './lib/WeaponCarried'

import { WeaponOnGround, WeaponOnGroundOptions } from '@/game/entities/weapons/lib/WeaponOnGround'
import { radiansToDegrees } from '@/util'

const logger = log.getLogger('WeaponHammer') // eslint-disable-line no-unused-vars

export class WeaponOnGroundHammer extends WeaponOnGround {
  constructor (options: WeaponOnGroundOptions) {
    super({
      scene: options.scene,
      spriteName: 'weapon-hammer',
      factoryConfig: hammerFactoryConfig,
      position: options.position,
      initialAngle: options.initialAngle,
      dropOwner: options.dropOwner
    })
  }
}

const AttackAnimationIdleRotation = Math.PI * 5 / 4
const AttackAnimationEndRotation = Math.PI / 3
const WeaponAttachmentIdleRotation = Math.PI / 1.5
const WeaponAttachmentEndAngle = 0
const WeaponAttachmentIdleDistance = 20
const WeaponAttachmentEndDistance = 30
const LongAttackWeaponAttachmentDistance = 80
const WeaponHitAreaDistance = 50
const LongAttackHitAreaDistance = 100
const WeaponHitAreaSize = 25

const alternateAttackPowerThreshold = 70

interface AnimationData {
  weaponRotation: number
  weaponAttachmentRotation: number
  weaponAttachmentDistance: number
}

export class WeaponCarriedHammer extends WeaponCarried {
  attackAnimation?: Phaser.Tweens.Timeline

  attackAnimationData: AnimationData = {
    weaponRotation: AttackAnimationIdleRotation,
    weaponAttachmentRotation: WeaponAttachmentIdleRotation,
    weaponAttachmentDistance: WeaponAttachmentIdleDistance
  }

  constructor (options: WeaponCarriedOptions) {
    super({
      scene: options.scene,
      spriteName: 'weapon-hammer',
      factoryConfig: hammerFactoryConfig,
      player: options.player
    })
  }

  update () {
    // the weapon is placed slightly in front of the player
    const targetWeaponPositionRotation = this.player.sprite.rotation + this.attackAnimationData.weaponAttachmentRotation // small shift so as not to be in the middle of the player
    this.sprite.x = this.player.sprite.body.position.x + Math.cos(targetWeaponPositionRotation) * this.attackAnimationData.weaponAttachmentDistance
    this.sprite.y = this.player.sprite.body.position.y + Math.sin(targetWeaponPositionRotation) * this.attackAnimationData.weaponAttachmentDistance
    this.sprite.rotation = this.player.sprite.rotation + this.attackAnimationData.weaponRotation // rotation is relative to the player
  }

  fire (power: number) {
    if (this.weaponInUse) {
      logger.debug('Weapon in use')
      return
    }

    this.weaponInUse = true
    if (power < alternateAttackPowerThreshold) {
      // attaque simple
      this.mainAttack()
    } else {
      // saut + lancer du marteau au sol
      this.alternateAttack()
    }
  }

  // Animation en deux temps, d'abord, le marteau part en avant et tue les joueurs présents dans la zone
  // puis le marteau se replace et devient à nouveau utilisable
  private mainAttack () {
    logger.debug('mainAttack')
    this.attackAnimation = this.scene.tweens.timeline({
      targets: [this.attackAnimationData],
      ease: 'Linear',
      tweens: [
        {
          duration: 50,
          props: {
            weaponRotation: {
              from: AttackAnimationIdleRotation,
              to: AttackAnimationEndRotation
            },
            weaponAttachmentRotation: {
              from: WeaponAttachmentIdleRotation,
              to: WeaponAttachmentEndAngle
            },
            weaponAttachmentDistance: {
              from: WeaponAttachmentIdleDistance,
              to: WeaponAttachmentEndDistance
            }
          } as { [key in keyof AnimationData]: Phaser.Types.Tweens.TweenPropConfig },
          onComplete: () => {
            const hitAreaBody = this.scene.matter.add.circle(
              this.player.sprite.x + Math.cos(this.player.sprite.rotation) * WeaponHitAreaDistance,
              this.player.sprite.y + Math.sin(this.player.sprite.rotation) * WeaponHitAreaDistance,
              WeaponHitAreaSize,
              {
                isSensor: true,
                onCollideCallback: (pair: MatterJS.ICollisionPair) => {
                  const player = (pair.bodyA as any).gameObject?.getData('player') as Player
                  if (player !== this.player && player !== undefined) {
                    player.kill()
                  }
                }
              }
            )
            this.scene.time.delayedCall(50, () => {
              this.scene.matter.world.remove(hitAreaBody)
            })
          }
        },
        {
          duration: 100,
          props: {
            weaponRotation: {
              from: AttackAnimationEndRotation,
              to: AttackAnimationIdleRotation
            },
            weaponAttachmentRotation: {
              from: WeaponAttachmentEndAngle,
              to: WeaponAttachmentIdleRotation
            },
            weaponAttachmentDistance: {
              from: WeaponAttachmentEndDistance,
              to: WeaponAttachmentIdleDistance
            }
          } as { [key in keyof AnimationData]: Phaser.Types.Tweens.TweenPropConfig },
          onComplete: () => {
            this.weaponInUse = false
          }
        }
      ]
    })
  }

  // Animation en deux temps, d'abord, le marteau est jeté bien en avant, le joueur saute et lance le marteau
  private alternateAttack () {
    logger.debug('alternateAttack')
    this.player.stunned = true
    this.player.sprite.setVelocity(0)
    this.attackAnimation = this.scene.tweens.timeline({
      targets: [this.attackAnimationData],
      ease: 'Linear',
      tweens: [
        {
          duration: 200,
          props: {
            weaponRotation: {
              from: AttackAnimationIdleRotation,
              to: AttackAnimationEndRotation
            },
            weaponAttachmentRotation: {
              from: WeaponAttachmentIdleRotation,
              to: WeaponAttachmentEndAngle
            },
            weaponAttachmentDistance: {
              from: WeaponAttachmentIdleDistance,
              to: LongAttackWeaponAttachmentDistance
            }
          } as { [key in keyof AnimationData]: Phaser.Types.Tweens.TweenPropConfig },
          onComplete: () => {
            const hitAreaBody = this.scene.matter.add.circle(
              this.player.sprite.x + Math.cos(this.player.sprite.rotation) * LongAttackHitAreaDistance,
              this.player.sprite.y + Math.sin(this.player.sprite.rotation) * LongAttackHitAreaDistance,
              WeaponHitAreaSize,
              {
                isSensor: true,
                onCollideCallback: (pair: MatterJS.ICollisionPair) => {
                  const player = (pair.bodyA as any).gameObject?.getData('player') as Player
                  if (player !== this.player && player !== undefined) {
                    player.kill()
                  }
                }
              }
            )

            this.scene.time.delayedCall(50, () => {
              this.scene.matter.world.remove(hitAreaBody)
              this.dropOnGround(hitAreaBody.position, radiansToDegrees(this.player.sprite.rotation + this.attackAnimationData.weaponRotation))
            })
            this.scene.time.delayedCall(300, () => {
              this.player.stunned = false
            })
          }
        }
      ]
    })
  }
}

const hammerFactoryConfig: WeaponFactoryConfig = {
  dropEntity: WeaponOnGroundHammer,
  pickUpEntity: WeaponCarriedHammer
}
