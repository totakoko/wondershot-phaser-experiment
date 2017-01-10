const Weapon = WS.Components.Weapon = class Weapon extends WS.Lib.Entity {
    constructor(options) {
      super();
      this.owner = options.owner;
      this.state = 'ready';
    }
    setOwner(owner) {
        this.owner = owner;
    }
}
