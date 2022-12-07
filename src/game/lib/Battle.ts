import log from 'loglevel'

import { PlayerConfig } from './PlayerConfig'
import { Stage } from './Stage'

import { config } from '@/game/config'
import { ROUND_END } from '@/game/events'
import { RoundScene } from '@/game/scenes/RoundScene'

const logger = log.getLogger('Battle') // eslint-disable-line no-unused-vars

export class Battle {
  public score: Map<number, number> = new Map()
  public alivePlayers: number[] = []
  public stage: Stage = new Stage()
  public scene!: RoundScene // will be registered in the scene

  constructor (public readonly players: PlayerConfig[]) {
    if (this.players.length < 1) {
      throw new Error('Battle: no player was added')
    }
    logger.info(`Initializing with ${this.players.length} players`)

    this.players.forEach(player => {
      this.score.set(player.id, 0)
    })
  }

  killPlayer (playerId: number) {
    logger.info(`Player ${playerId} has died.`)
    this.alivePlayers.splice(this.alivePlayers.indexOf(playerId), 1)
    logger.info(`Remaining players : ${this.alivePlayers}`)
    this.checkEndOfRound()
  }

  checkEndOfRound () {
    // continue while there are more than 1 player ingame
    if (this.alivePlayers.length > 1) {
      return
    }

    if (this.alivePlayers.length === 1) {
      this.addRoundVictory(this.alivePlayers[0])
    }
    // nothing in case of draw

    this.scene.events.emit(ROUND_END)
  }

  reset () {
    this.alivePlayers = this.players.map(player => player.id)
    this.stage = new Stage()
  }

  addRoundVictory (playerId: number) {
    this.score.set(playerId, this.score.get(playerId)! + 1)
    if (this.score.get(playerId) === config.RoundsVictory) {
      logger.info(`Player ${playerId} has won the battle!`)
      // TODO do not start another round
    }
  }
}
