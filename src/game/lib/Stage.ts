import { Entity } from './Entity'

export class Stage {
  private readonly entities: Array<Entity<any>> = []

  register<T extends Entity<any>> (entity: T): T {
    entity.stage = this
    entity.create()
    this.entities.push(entity)
    return entity
  }

  registerMany<T extends Entity<any>> (entities: T[]) {
    entities.forEach(entity => {
      this.register(entity)
    })
  }

  remove (entity: Entity<any>) {
    entity.destroy()
    const index = this.entities.indexOf(entity)
    if (index !== -1) {
      this.entities.splice(index, 1)
    }
  }

  destroy () {
    this.entities.forEach(entity => {
      this.remove(entity)
    })
  }

  // permet de mettre à jour des choses pendant l'event loop
  create () {
    this.entities.forEach(entity => {
      entity.create()
    })
  }

  update () {
    this.entities.forEach(entity => {
      entity.update()
    })
  }

  pauseUpdate () {
    // permet de mettre à jour les gamepad pour sortir de la pause
    // if (WS.game.input.gamepad && WS.game.input.gamepad.active) {
    //   WS.game.input.gamepad.update()
    // }
  }

  render () {
    this.entities.forEach(entity => {
      entity.render()
    })
  }
}
