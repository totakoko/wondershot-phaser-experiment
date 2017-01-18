import WS from '../';

export default class Weapon extends WS.Lib.Entity {
    constructor(options) {
      super();
      this.owner = options.owner;
    }
    changeState(newState) {
      this.state.cleanup();
      this.state = newState;
    }
    fire() {
      throw new Error('Not implemented');
    }
}
