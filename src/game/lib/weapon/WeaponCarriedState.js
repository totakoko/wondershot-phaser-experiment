import logger from 'loglevel'
import WeaponState from './WeaponState.js'
const log = logger.getLogger('WeaponCarriedState') // eslint-disable-line no-unused-vars

/*
Etat des armes portées par un joueur avec en commun :
- l'animation de pickup/spawn (constructor)
- le déplacement de l'arme avec le joueur (update)
- l'animation de l'attaque (update)
- la détection de collision avec un joueur
- le tir de projectile
*/
export default class WeaponCarriedState extends WeaponState {
  /*
  options = {
    spriteName
  }
  */
  constructor (weapon, options) {
    super(weapon)
    this.owner = options.owner

    this.sprite = WS.game.Groups.Objects.create(
      this.owner.sprite.body.x,
      this.owner.sprite.body.y,
      options.spriteName
    )
    this.sprite.anchor.setTo(0.5)

    this.spawnAnimation = WS.game.add.tween(this.sprite.scale)
      .to({ x: 1.5, y: 1.5 }, 150, WS.Phaser.Easing.Linear.None)
      .to({ x: 1, y: 1 }, 200, WS.Phaser.Easing.Linear.None)
      .start()
  }
  fire (power) {
    throw new Error('Not implemented')
  }
  update () {
    throw new Error('Not implemented')
  }
  cleanup () {
    this.sprite.destroy()
    this.spawnAnimation.manager.remove(this.spawnAnimation)
  }
}
