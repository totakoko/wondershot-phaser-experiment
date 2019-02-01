import WS from '../../WS'
import logger from 'loglevel'
const log = logger.getLogger('WeaponState') // eslint-disable-line no-unused-vars

export default WS.Lib.Weapon.WeaponState = class WeaponState {
  constructor (weapon) {
    this.weapon = weapon
    log.debug(`${this.weapon.id} > Changing state to ${this.constructor.name}`)
  }
  // pickup() {
  //   throw new Error('Not implemented');
  // }
  fire () {
    throw new Error('Not implemented')
  }
  update () {
  }
  cleanup () {
  }
  playerHitKillHandler (projectileBody, playerBody, shapeA, shapeB, equation) {
    log.info(`Player ${this.owner.playerNumber} just hit ${playerBody.sprite.data.owner.playerNumber}`)
    playerBody.sprite.data.owner.kill()
  }
}
