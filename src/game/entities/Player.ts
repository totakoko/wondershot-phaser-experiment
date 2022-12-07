import log from 'loglevel'

import { DeathMarker } from './DeathMarker'
import { WeaponCarried } from './weapons/lib/WeaponCarried'

import { config, depths } from '@/game/config'
import { PLAYER_KILLED } from '@/game/events'
import { Entity, EntityOptions } from '@/game/lib/Entity'
import { Position } from '@/game/lib/Position'
import { RoundScene } from '@/game/scenes/RoundScene'
import { throttle } from '@/util'

const logger = log.getLogger('Player') // eslint-disable-line no-unused-vars

export interface PlayerOptions extends EntityOptions<RoundScene> {
  id: number
  color: PlayerColor
  startLocation: Position
}

export interface ControlledPlayer {
  setMovementAxes: (axes: Position) => void
  loadWeapon: () => void
  releaseWeapon: () => void
  dropWeapon: () => void
  jump: () => void
  getPlayerId: () => number
}

export interface PlayerInputOptions {
  movement: {
    axes: number[][]
  }
  fireWeapon: Phaser.Events.EventEmitter
  dropWeapon: Phaser.Events.EventEmitter
  jump: Phaser.Events.EventEmitter
}

export interface PlayerColor {
  name: string
  tint: number
  hex: string
}

export class Player extends Entity<RoundScene> implements ControlledPlayer {
  public sprite!: Phaser.Physics.Matter.Image
  public weapon: WeaponCarried | null = null

  // used by the loaded attack of the hammer to freeze the player
  public stunned = false

  // state
  private alive = true
  private jumping = false
  private movementAxes: Position = {
    x: 0,
    y: 0
  }

  private isLoadingWeapon = false
  private loadingWeaponTween: Phaser.Tweens.Tween | null = null

  constructor (public readonly playerOptions: PlayerOptions) {
    super(playerOptions)
  }

  create () {
    logger.debug(`Player ${this.playerOptions.id} starting at position ${this.playerOptions.startLocation.x}:${this.playerOptions.startLocation.y}`)
    this.sprite = this.scene.matter.add.image(this.playerOptions.startLocation.x, this.playerOptions.startLocation.y, 'player')
    this.scene.Groups.Players.add(this.sprite)
    this.sprite.setDepth(depths.Players)
    this.sprite.setCircle(0.8 * Math.max(this.sprite.width, this.sprite.height) / 2)
    this.sprite.setScale(0.2)
    this.sprite.setMass(30)
    this.sprite.setFixedRotation()
    this.sprite.tint = this.playerOptions.color.tint
    this.sprite.setData('player', this)
  }

  /*
  Le mouvement ne se fait que dans le update mais pourrait se faire ailleurs
  En fait, chaque axe doit être rafraichi, donc autant le mettre dans le update.

  Concernant les actions, il n'y a pas besoin de les mettre dans le update, mais il faut pouvoir les déclencher via un événement.

  Soit le Player assigne automatiquement l'input.jump => player.jump
  Soit c'est l'input qui s'ocucpe de faire ça, et le player n'a aucune information sur l'input, à part pour le mouvement.

  */
  update () {
    if (!this.alive || this.jumping || this.stunned || !this.scene.matter.world.enabled) {
      return
    }
    if (this.alive && !this.jumping) {
      const moveX = this.movementAxes.x
      const moveY = this.movementAxes.y
      this.sprite.setVelocity(moveX * config.PlayerSpeed, moveY * config.PlayerSpeed)
      if (moveX !== 0 || moveY !== 0) {
        this.sprite.rotation = Math.atan2(moveY, moveX)
      }
    }
  }

  destroy () {
    this.sprite.destroy()
    if (this.loadingWeaponTween !== null) {
      this.scene.tweens.remove(this.loadingWeaponTween)
    }
    if (this.weapon !== null) {
      this.scene.battle.stage.remove(this.weapon)
    }
  }

  // Actions
  setMovementAxes (movementAxes: Position) {
    this.movementAxes = movementAxes
  }

  dropWeapon () {
    if (this.weapon != null) {
      this.weapon.dropOnGround(this.sprite.body.position)
    }
  }

  loadWeapon () {
    if (this.isLoadingWeapon) {
      throw new Error("Can't load weapon again while still loading.")
    }
    this.isLoadingWeapon = true
    this.loadingWeaponTween = this.scene.tweens.addCounter({
      duration: 1000,
      ease: 'Linear',
      from: 0,
      to: 100
    })
  }

  releaseWeapon () {
    if (!this.isLoadingWeapon) {
      throw new Error("Can't release unloaded weapon.")
    }
    this.fireWeapon(this.loadingWeaponTween!.getValue())
    this.isLoadingWeapon = false
    this.loadingWeaponTween!.stop()
  }

  private fireWeapon (power: number) {
    if (!this.alive) {
      logger.warn(`Player ${this.playerOptions.id} is dead`)
      return
    }
    if (this.weapon === null) {
      logger.debug('No weapon to fire !')
      return
    }
    logger.debug(`Fire weapon ${this.weapon.constructor.name}`)
    this.weapon.fire(power)
  }

  jump = throttle(() => {
    if (!this.alive) {
      logger.warn(`Player ${this.playerOptions.id} is dead`)
      return
    }

    // we can't tween the trust force directly...
    // so we use a simple callback
    this.jumping = true
    this.sprite.thrust(config.JumpSpeed)
    this.scene.time.delayedCall(config.JumpDuration, () => {
      this.jumping = false
    })
  }, 3000)

  kill () {
    this.alive = false

    this.scene.battle.stage.register(new DeathMarker({
      scene: this.scene,
      playerColor: this.playerOptions.color,
      position: this.sprite.body.position
    }))
    this.scene.battle.stage.remove(this)
    this.scene.events.emit(PLAYER_KILLED, this.playerOptions.id)
  }

  getPlayerId (): number {
    return this.playerOptions.id
  }
}
