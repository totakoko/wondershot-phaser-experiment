const Weapon = WS.Components.Weapon = class Weapon extends WS.Lib.Entity {
    constructor() {
      super();
    }
    setOwner(owner) {
        this.owner = owner;
    }
}
