import logger from 'loglevel'
import config from '@/game/config.js'
import Entity from '@/game/lib/Entity.js'
import * as _ from '@/util'
const log = logger.getLogger('Player') // eslint-disable-line no-unused-vars

export default class Player extends Entity {
  constructor (playerOptions) {
    super(playerOptions)
    this.playerNumber = playerOptions.playerNumber
    this.playerColor = playerOptions.color
    this.alive = true

    // this.sprite = this.scene.world.create(80 * this.playerNumber, 200, 'player');
    log.debug(`Player ${this.playerNumber} starting at position ${playerOptions.startLocation.x}:${playerOptions.startLocation.y}`)
    this.sprite = this.scene.matter.add.image(playerOptions.startLocation.x, playerOptions.startLocation.y, 'player')
    // this.sprite = this.scene.Groups.Players.create(playerOptions.startLocation.x, playerOptions.startLocation.y, 'player')
    this.scene.Groups.Players.add(this.sprite)
    this.sprite.setCircle(0.8 * Math.max(this.sprite.width, this.sprite.height) / 2)
    this.sprite.setScale(0.2)
    this.sprite.setMass(30)
    this.sprite.tint = this.playerColor.tint
    // this.sprite.data.owner = this
    this.sprite.setData('owner', this)
    this.jumping = false

    this.sprite.setFixedRotation()
    // this.sprite.body.damping = 1 // pas d'effet élastique sur les côtés
    // this.scene.physics.p2.enable(this.sprite, config.Debug)
    // this.sprite.body.setCircle(30)
    // this.sprite.body.fixedRotation = true
    // this.sprite.body.damping = 1 // pas d'effet élastique sur les côtés
    // log.debug(`collision group : Player${this.playerNumber}`)
    // const physics = PhysicsManager[`Player${this.playerNumber}`]
    // this.sprite.body.setCollisionGroup(physics.id)
    // this.sprite.body.collides(physics.Arena)
    // this.sprite.body.collides(physics.OtherProjectiles)
    // this.sprite.body.collides(physics.Objects)

    // this.onKilledEvent = new Phaser.Signal() // eslint-disable-line babel/new-cap
  }
  setInput (options) {
    if (options.movement) {
      this.movement = options.movement
    }
    // if (options.fireWeapon) {
    //   options.fireWeapon.onDown.removeAll()
    //   options.fireWeapon.onDown.add(this.loadWeapon, this)
    //   options.fireWeapon.onUp.removeAll()
    //   options.fireWeapon.onUp.add(this.releaseWeapon, this)
    // }
    // if (options.dropWeapon) {
    //   options.dropWeapon.onDown.removeAll()
    //   options.dropWeapon.onDown.add(this.dropWeapon, this)
    // }
    // if (options.jump) {
    //   options.jump.onDown.removeAll()
    //   options.jump.onDown.add(_.throttle(this.jump, 3000, { trailing: false }), this)
    // }
    if (options.togglePauseMenu) {
      // options.togglePauseMenu.onDown.removeAll()
      // options.togglePauseMenu.onDown.add(_.throttle(this.Components.PauseMenu.togglePause, 500, { trailing: false }), this.Components.PauseMenu)
      options.togglePauseMenu.removeAllListeners()
      options.togglePauseMenu.on('down', _.throttle(() => this.scene.events.emit('togglePause'), 500))
    }
  }
  update () {
    // if (this.sprite.alive && this.movement && !this.jumping && !this.scene.physics.p2.paused) {
    if (this.alive && this.movement && !this.jumping) {
      const moveX = this.movement.axes[0]
      const moveY = this.movement.axes[1]
      this.sprite.setVelocity(moveX * config.PlayerSpeed, moveY * config.PlayerSpeed)
      if (moveX || moveY) {
        this.sprite.rotation = Math.atan2(moveY, moveX)
        // this.sprite.body.x += moveX * PlayerSpeed
        // this.sprite.body.y += moveY * PlayerSpeed
        // this.sprite.setPosition(
        //   this.sprite.body.position.x + moveX * config.PlayerSpeed,
        //   this.sprite.body.position.y + moveY * config.PlayerSpeed
        // )
        // this.sprite.setVelocity(moveX * config.PlayerSpeed, moveY * config.PlayerSpeed)
        // this.sprite.body.position.x += moveX * config.PlayerSpeed
        // this.sprite.body.position.y += moveY * config.PlayerSpeed
        // this.sprite.x += moveX * config.PlayerSpeed
        // this.sprite.y += moveY * config.PlayerSpeed
      }
    }
  }
  // Actions
  pickupWeapon (weapon) {
    if (!this.alive) {
      log.warn(`Player ${this.playerNumber} is dead`)
      return
    }
    if (this.weapon) {
      log.warn(`Player ${this.playerNumber} already carries a weapon`)
      return
    }
    if (this.previousWeapon === weapon) {
      log.warn(`Player ${this.playerNumber} is on top of his previous weapon`)
      return
    }
    log.debug(`Player ${this.playerNumber} picks up ${weapon.id}`)
    // this.dropWeapon();
    this.weapon = weapon
    this.weapon.pickup(this)
  }
  dropWeapon () {
    if (this.weapon) {
      this.weapon.drop(this.sprite.body) // utilisé pour les propriétés x et y
      this.previousWeapon = this.weapon // on garde une référence de l'arme pour ne pas la reprendre directement au sol
      this.weapon = null
      setTimeout(() => {
        this.previousWeapon = null
      }, 100)
    }
  }
  loadWeapon () {
    if (this.loadingWeapon) {
      throw new Error("Can't load weapon again while still loading.")
    }
    this.loadingWeapon = {
      power: 0
    }
    this.loadingWeaponTween = this.scene.add.tween(this.loadingWeapon)
      .to({ power: 100 }, 1000, this.Phaser.Easing.Linear.None)
      .start()
      .onUpdateCallback(() => {
        console.log('loading power', this.loadingWeapon.power)
      })
  }
  releaseWeapon () {
    if (!this.loadingWeapon) {
      throw new Error("Can't release unloaded weapon.")
    }
    this.fireWeapon(this.loadingWeapon.power)
    this.loadingWeapon = null
    this.loadingWeaponTween.stop()
  }
  fireWeapon (power) {
    if (!this.alive) {
      log.warn(`Player ${this.playerNumber} is dead`)
      return
    }
    if (this.weapon === null) {
      log.debug('No weapon to fire !')
      return
    }
    log.debug(`Fire weapon ${this.weapon.constructor.name}`)
    this.weapon.fire(power)
  }
  jump () {
    if (!this.alive) {
      log.warn(`Player ${this.playerNumber} is dead`)
      return
    }
    const accelerationFactor = 50000
    const xForce = Math.cos(this.sprite.rotation) * accelerationFactor
    const yForce = Math.sin(this.sprite.rotation) * accelerationFactor
    log.debug(`Jump! (accel: ${xForce}:${yForce}`)

    // jumping part, the player can't control the movements
    this.jumping = true
    // const jumpingTween = this.scene.add.tween(this.sprite.body.force)
    //   .to({ x: xForce, y: yForce }, 100, Phaser.Easing.Linear.None)
    //   .to({ x: xForce / 10, y: yForce / 10 }, 150, Phaser.Easing.Linear.None)
    //   .start()
    // this.scene.tweens.timeline({
    //   targets: wall,
    //   loop: -1,
    //   loopDelay: 2000,
    //   tweens: [{
    //     ease: 'Linear',
    //     duration: 2000,
    //     delay: 2000,
    //     x: xForce,
    //     y: yForce,
    //   }, {
    //     ease: 'Linear',
    //     duration: 2000,
    //     ...from
    //   }]
    // })
    // jumpingTween.onComplete.add(() => {
    //   log.debug('Jump tween complete')
    //   this.jumping = false
    //   if (this.sprite.alive) {
    //     this.sprite.body.angularVelocity = 0 // TODO arranger ça avec les materials
    //   }
    // })
  }
  kill () {
    log.info(`kill player${this.playerNumber}`)
    this.alive = false

    const deathMarker = this.scene.Groups.Arena.create(this.sprite.x, this.sprite.y, 'player-death-marker').setOrigin()
    deathMarker.tint = this.playerColor.tint
    this.dropWeapon()
    this.sprite.destroy()
    // this.onKilledEvent.dispatch()
    this.emit('killed')
    // this.scene.state.callbackContext.battle.notifyPlayerKilled(this.playerNumber)
  }
}
