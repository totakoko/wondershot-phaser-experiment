import logger from 'loglevel'
const log = logger.getLogger('PadManager') // eslint-disable-line no-unused-vars

export default class PadManager {
  // constructor (gamepadPlugin) {
  //   this.gamepadPlugin = gamepadPlugin
  //   if (!gamepadPlugin) {
  //     throw new Error('Missing parameter gamepadPlugin')
  //   }
  //   // if (this.gamepadPlugin.total === 0) {
  //   //   throw new Error('PadManager: No gamepad found!')
  //   // }
  //   // PadManager.gamepadPlugin.start()
  //   this.gamepadPlugin.once('connected', function (pad) {
  //     //   'pad' is a reference to the gamepad that was just connected
  //     log.info(`PadManager: Gamepad connected`)
  //   })
  // }
  static init (gamepadPlugin) {
    PadManager.gamepadPlugin = gamepadPlugin
    if (!gamepadPlugin) {
      throw new Error('Missing parameter gamepadPlugin')
    }
    log.info('PadManager: Initializing')

    PadManager.gamepadPlugin.once('connected', function (pad) {
      //   'pad' is a reference to the gamepad that was just connected
      log.info(`PadManager: Gamepad connected`)
    })
    // if (PadManager.gamepadPlugin.total === 0) {
    //   throw new Error('PadManager: No gamepad found!')
    // }

    // enregistrement du callback de connexion des gamepads
    // PadManager.gamepadPlugin.gamepad.onConnectCallback = this.onGamepadConnect.bind(this)
    // PadManager.gamepadPlugin.gamepad.onGamepadHandler = this.onGamepadConnect.bind(this)
    // PadManager.gamepadPlugin.gamepad.once('connected', function (pad) {
    //   log.info(`PadManager: Gamepad connected`)
    // //   'pad' is a reference to the gamepad that was just connected
    // })
  }
  // onGamepadConnect (padIndex) {
  //   log.info(`PadManager: Gamepad${padIndex + 1} connected`)
  //   // if battle started reregister events
  //   // this.players[playerNumber].registerGamepadButtons();
  // }

  static setPadsCallback (callback) {
    // this.gamepadPlugin.addCallbacks(this, {
    //   onDown: function (buttonCode, value, padIndex) {
    //     callback(padIndex + 1) // eslint-disable-line standard/no-callback-literal
    //   }
    // })
  }

  static getGamepad (padNumber) {
    return PadManager.gamepadPlugin[`pad${padNumber}`]
  }
}
