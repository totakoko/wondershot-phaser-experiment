
import { MovingWall } from './MovingWall'

import { config, depths } from '@/game/config'
import { Entity } from '@/game/lib/Entity'
import { Position } from '@/game/lib/Position'
import { RoundScene } from '@/game/scenes/RoundScene'

interface MovingMotion {
  from: Position
  to: Position
}

const wallColor = 0x505050 // grey

const startLocations: Position[] = [
  { x: config.xp(15), y: config.yp(15) },
  { x: config.xp(85), y: config.yp(15) },
  { x: config.xp(15), y: config.yp(85) },
  { x: config.xp(85), y: config.yp(85) }
]

const outerWalls = [
  { x: 0, y: 0, width: config.ArenaWidth, height: config.ArenaBordersWidth },
  { x: 0, y: 0, width: config.ArenaBordersWidth, height: config.ArenaHeight },
  { x: 0, y: config.ArenaHeight - config.ArenaBordersWidth, width: config.ArenaWidth, height: config.ArenaBordersWidth },
  { x: config.ArenaWidth - config.ArenaBordersWidth, y: 0, width: config.ArenaBordersWidth, height: config.ArenaHeight }
]

const movingBlocks: MovingMotion[] = [
  { // haut-gauche
    from: {
      x: config.xp(22),
      y: config.yp(35)
    },
    to: {
      x: config.xp(40),
      y: config.yp(35)
    }
  },
  { // haut-droite
    from: {
      x: config.xp(78),
      y: config.yp(35)
    },
    to: {
      x: config.xp(60),
      y: config.yp(35)
    }
  },
  { // bas-gauche
    from: {
      x: config.xp(40),
      y: config.yp(65)
    },
    to: {
      x: config.xp(22),
      y: config.yp(65)
    }
  },
  { // bas-droite
    from: {
      x: config.xp(60),
      y: config.yp(65)
    },
    to: {
      x: config.xp(78),
      y: config.yp(65)
    }
  }
]

export class Arena extends Entity<RoundScene> {
  startLines = []
  walls: MovingWall[] = []

  getStartPositions () {
    return [...startLocations]
  }

  create () {
    this.scene.cameras.main.setBackgroundColor('#91d49c')

    outerWalls.forEach(outerWall => {
      this.scene.Groups.Arena.add(
        this.scene.add.rectangle(outerWall.x, outerWall.y, outerWall.width, outerWall.height, wallColor)
          .setOrigin(0)
          .setDepth(depths.Arena)
      )
    })

    this.walls = movingBlocks.map(wallCoords => new MovingWall({
      scene: this.scene,
      stage: this.stage,
      from: wallCoords.from,
      to: wallCoords.to
    }))
    this.stage.registerMany(this.walls)
  }
}
