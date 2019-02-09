import logger from 'loglevel'

const log = logger.getLogger('AbstractInput') // eslint-disable-line no-unused-vars

export default class AbstractInput {
  constructor (options) {
    this.scene = options.scene
    this.movement = options.movement
    this.fireWeapon = options.fireWeapon
    this.dropWeapon = options.dropWeapon
    this.jump = options.jump
    this.togglePauseMenu = options.togglePauseMenu
  }
}
