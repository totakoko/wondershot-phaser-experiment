import logger from 'loglevel'
const log = logger.getLogger('PadManager') // eslint-disable-line no-unused-vars

export default WS.Services.PadManager = class PadManager {
  static init () {
    log.info('PadManager: Initializing')
    WS.game.input.gamepad.start()
    if (!WS.game.input.gamepad.supported) {
      WS.game.destroy()
      throw new Error('PadManager: The Gamepad API not supported in this browser!')
    }

    // enregistrement du callback de connexion des gamepads
    WS.game.input.gamepad.onConnectCallback = this.onGamepadConnect.bind(this)
  }
  static onGamepadConnect (padIndex) {
    log.info(`PadManager: Gamepad${padIndex + 1} connected`)
    // if battle started reregister events
    // this.players[playerNumber].registerGamepadButtons();
  }

  static setPadsCallback (callback) {
    WS.game.input.gamepad.addCallbacks(this, {
      onDown: function (buttonCode, value, padIndex) {
        callback(padIndex + 1)
      }
    })
  }
  static getGamepad (playerNumber) {
    return WS.game.input.gamepad[`pad${playerNumber}`]
  }
}
