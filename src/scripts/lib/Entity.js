const Entity = WS.Lib.Entity = class Entity {
  constructor() {
    this.game = WS.game;
    this.components = [];
    this.id = `${this.constructor.name}-${Entity.nextEntityId++}`;
  }

  register(component) {
    this.components.push(component);
  }
  broadcast(event) {
    for (let component of this.components) {
      component.notify(event);
    }
  }

  // permet de précharger des assets
  static preload() {
  }

  // permet de mettre à jour des choses pendant l'event loop
  create() {
  }
  update() {
  }
  render() {
  }
}
Entity.nextEntityId = 1;
