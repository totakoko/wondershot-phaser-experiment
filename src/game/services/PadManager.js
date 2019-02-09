import logger from 'loglevel'
const log = logger.getLogger('PadManager') // eslint-disable-line no-unused-vars

export default class PadManager {
  constructor (gamepadPlugin) {
    this.gamepadPlugin = gamepadPlugin
    if (!gamepadPlugin) {
      throw new Error('Missing parameter gamepadPlugin')
    }
    // if (this.gamepadPlugin.total === 0) {
    //   throw new Error('PadManager: No gamepad found!')
    // }
    // PadManager.gamepadPlugin.start()
    this.gamepadPlugin.once('connected', function (pad) {
      //   'pad' is a reference to the gamepad that was just connected
      log.info(`PadManager: Gamepad connected`)
    })
  }
  // init (gamepadPlugin) {
  //   log.info('PadManager: Initializing')
  //   // if (PadManager.gamepadPlugin.gamepad.total === 0) {
  //   //   throw new Error('PadManager: No gamepad found!')
  //   // }

  //   // enregistrement du callback de connexion des gamepads
  //   // PadManager.gamepadPlugin.gamepad.onConnectCallback = this.onGamepadConnect.bind(this)
  //   // PadManager.gamepadPlugin.gamepad.onGamepadHandler = this.onGamepadConnect.bind(this)
  //   PadManager.gamepadPlugin.gamepad.once('connected', function (pad) {
  //     log.info(`PadManager: Gamepad connected`)
  //   //   'pad' is a reference to the gamepad that was just connected
  //   })
  // }
  // onGamepadConnect (padIndex) {
  //   log.info(`PadManager: Gamepad${padIndex + 1} connected`)
  //   // if battle started reregister events
  //   // this.players[playerNumber].registerGamepadButtons();
  // }

  setPadsCallback (callback) {
    // this.gamepadPlugin.addCallbacks(this, {
    //   onDown: function (buttonCode, value, padIndex) {
    //     callback(padIndex + 1) // eslint-disable-line standard/no-callback-literal
    //   }
    // })
  }

  getGamepad (padNumber) {
    return this.gamepadPlugin[`pad${padNumber}`]
  }
}
