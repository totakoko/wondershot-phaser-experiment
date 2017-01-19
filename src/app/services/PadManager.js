import WS from '../WS';

export default WS.Services.PadManager = class PadManager {
    static init() {
        console.log('PadManager: Initializing');
        WS.game.input.gamepad.start();
        if (!WS.game.input.gamepad.supported) {
            WS.game.destroy();
            throw new Error('PadManager: The Gamepad API not supported in this browser!');
        }

        // enregistrement du callback de connexion des gamepads
        WS.game.input.gamepad.onConnectCallback = this.onGamepadConnect.bind(this);
    }
    static onGamepadConnect(padIndex) {
        console.log(`PadManager: Gamepad${padIndex + 1} connected`);
        // if battle started reregister events
        // this.players[playerNumber].registerGamepadButtons();
    }

    static setPadsCallback(callback) {
      WS.game.input.gamepad.addCallbacks(this, {
        onDown: function (buttonCode, value, padIndex) {
          callback(padIndex + 1);
        }
      });
    }
    static getGamepad(playerNumber) {
      return WS.game.input.gamepad[`pad${playerNumber}`];
    }
};
