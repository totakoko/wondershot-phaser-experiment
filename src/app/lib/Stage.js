import WS from '../WS';

export default WS.Lib.Stage = class Stage {
  constructor() {
    this.game = WS.game;
    this.entities = [];
  }

  register(entity) {
    entity.stage = this;
    this.entities.push(entity);
  }

  // permet de mettre à jour des choses pendant l'event loop
  create() {
    this.entities.forEach(entity => {
      entity.create();
    });
  }
  update() {
    this.entities.forEach(entity => {
      entity.update();
    });
  }
  pauseUpdate() {
    // permet de mettre à jour les gamepad pour sortir de la pause
    if (WS.game.input.gamepad && WS.game.input.gamepad.active) {
        WS.game.input.gamepad.update();
    }
  }
  render() {
    this.entities.forEach(entity => {
      entity.render();
    });
  }
};
