import logger from 'loglevel'
import Entity from '@/game/lib/Entity.js'
const log = logger.getLogger('Weapon') // eslint-disable-line no-unused-vars

export default class Weapon extends Entity {
  constructor (options) {
    super()
    this.states = options.states
  }
  pickup (owner) {
    this.changeStateToCarried({
      owner: owner
    })
  }
  drop (position) {
    this.changeStateToGround({
      position: {
        x: position.x,
        y: position.y
      }
    })
  }
  fire (power) {
    this.state.fire(power)
  }
  update () {
    // if (!WS.game.physics.p2.paused) {
    //   this.state.update()
    // }
  }

  changeStateToGround (options) {
    this.changeState(new this.states.Ground(this, options))
  }
  changeStateToCarried (options) {
    this.changeState(new this.states.Carried(this, options))
  }
  changeStateToFlying (options) {
    this.changeState(new this.states.Flying(this, options))
  }
  changeState (newState) {
    if (this.state) {
      this.state.cleanup()
    }
    this.state = newState
  }
}

/*

-'("'("("
")")'")'

TODO quand on initialise une arme, il faudrait pouvoir choisir son état (carried ou ground)

Donc en 2 temps :
On crée l'arme, puis après on doit forcément lui donner un état sinon, gros warning. Dans le update on check s'il y a un état actif sinon alerte.

Sinon, pour créer l'arme et on a le choix,
- attachToGround()
- attachToPlayer()
derrière, ça fait juste changer l'état

On pourrait avoir un controleur qui gère l'assignation des armes au joueurs, afin que la logique ne soit pas, soit du côté joueur, soit du côté arme.

*/
