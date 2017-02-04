import WS from '../WS';
const log = require('misc/loglevel').getLogger('Weapon'); // eslint-disable-line no-unused-vars

export default WS.Components.Weapon = class Weapon extends WS.Lib.Entity {
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
};
