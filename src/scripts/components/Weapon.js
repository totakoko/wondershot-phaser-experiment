const Weapon = WS.Components.Weapon = class Weapon extends WS.Lib.Entity {
    constructor(options) {
      super();
      this.owner = options.owner;
    }
    changeState(newState) {
      this.state.cleanup();
      this.state = newState;
    }
    setOwner(owner) {
      this.owner = owner;
    }
    fire() {
      throw new Error('Not implemented');
    }
}
