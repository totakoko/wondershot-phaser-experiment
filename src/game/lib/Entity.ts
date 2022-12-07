import { Stage } from './Stage'

export interface EntityOptions<S extends Phaser.Scene> {
  game?: Phaser.Game
  scene?: S
  stage?: Stage
}

export class Entity<S extends Phaser.Scene> {
  static nextEntityId = 1

  id: string
  game!: Phaser.Game
  scene!: S
  stage!: Stage

  entities: Array<Entity<any>> = []

  constructor (options: EntityOptions<S>) {
    if (options.game !== undefined) {
      this.game = options.game
    }
    if (options.scene !== undefined) {
      this.scene = options.scene
    }
    if (options.stage !== undefined) {
      this.stage = options.stage
    }
    this.entities = []
    this.id = `${this.constructor.name}-${Entity.nextEntityId++}`
  }

  register (entity: Entity<any>) {
    this.entities.push(entity)
  }

  destroy () {
    // TODO
  }

  // permet de précharger des assets
  static preload () {
    //
  }

  // permet de mettre à jour des choses pendant l'event loop
  create () {
    //
  }

  update () {
    //
  }

  render () {
    //
  }
}
