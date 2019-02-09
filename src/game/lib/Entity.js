import logger from 'loglevel'
const log = logger.getLogger('Entity') // eslint-disable-line no-unused-vars

export default class Entity {
  constructor (options = {}) {
    this.game = options.game
    this.scene = options.scene
    this.components = []
    this.id = `${this.constructor.name}-${Entity.nextEntityId++}`
  }

  register (component) {
    this.components.push(component)
  }
  broadcast (event) {
    for (const component of this.components) {
      component.notify(event)
    }
  }

  // permet de précharger des assets
  static preload () {
  }

  // permet de mettre à jour des choses pendant l'event loop
  create () {
  }
  update () {
  }
  render () {
  }
}
Entity.nextEntityId = 1
