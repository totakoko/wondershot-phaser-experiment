import WS from '../../WS';
const log = require('misc/loglevel').getLogger('KeyboardInput'); // eslint-disable-line no-unused-vars

export default WS.Lib.Input.KeyboardInput = class KeyboardInput extends WS.Lib.Input.AbstractInput {
  constructor(options) {
    super({
      fireWeapon: WS.game.input.keyboard.addKey(WS.Phaser.Keyboard.SPACEBAR),
      jump: WS.game.input.keyboard.addKey(WS.Phaser.Keyboard.CONTROL),
      togglePauseMenu: WS.game.input.keyboard.addKey(WS.Phaser.Gamepad.ENTER),
    });
    this.movement = [0, 0];

    // onDown : on ajoute un mouvement dans la direction de la touche
    WS.game.input.keyboard.addKey(WS.Phaser.Keyboard.LEFT).onDown.add(() => {
      this.movement[0] -= 1;
    });
    WS.game.input.keyboard.addKey(WS.Phaser.Keyboard.RIGHT).onDown.add(() => {
      this.movement[0] += 1;
    });
    WS.game.input.keyboard.addKey(WS.Phaser.Keyboard.UP).onDown.add(() => {
      this.movement[1] -= 1;
    });
    WS.game.input.keyboard.addKey(WS.Phaser.Keyboard.DOWN).onDown.add(() => {
      this.movement[1] += 1;
    });

    // onUp : on supprime le mouvement dans la direction de la touche
    WS.game.input.keyboard.addKey(WS.Phaser.Keyboard.LEFT).onUp.add(() => {
      this.movement[0] += 1;
    });
    WS.game.input.keyboard.addKey(WS.Phaser.Keyboard.RIGHT).onUp.add(() => {
      this.movement[0] -= 1;
    });
    WS.game.input.keyboard.addKey(WS.Phaser.Keyboard.UP).onUp.add(() => {
      this.movement[1] += 1;
    });
    WS.game.input.keyboard.addKey(WS.Phaser.Keyboard.DOWN).onUp.add(() => {
      this.movement[1] -= 1;
    });
  }
};
