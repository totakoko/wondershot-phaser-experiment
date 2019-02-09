import logger from 'loglevel'
import Entity from '@/game/lib/Entity.js'
import config from '@/game/config.js'
const log = logger.getLogger('Arena') // eslint-disable-line no-unused-vars

export default class Arena extends Entity {
  // static preload () {
  //   this.scene.load.image('wall', 'assets/images/wall.png')
  // }
  constructor (options) {
    super(options)
    this.startLines = []
    this.startLocations = [
      { x: config.xp(15), y: config.yp(15) },
      { x: config.xp(85), y: config.yp(15) },
      { x: config.xp(15), y: config.yp(85) },
      { x: config.xp(85), y: config.yp(85) }
    ]
    // this.lines = []

    this.outerWalls = [
      { x: 0, y: 0, width: config.ArenaWidth, height: config.ArenaBordersWidth },
      { x: 0, y: 0, width: config.ArenaBordersWidth, height: config.ArenaHeight },
      { x: 0, y: config.ArenaHeight - config.ArenaBordersWidth, width: config.ArenaWidth, height: config.ArenaBordersWidth },
      { x: config.ArenaWidth - config.ArenaBordersWidth, y: 0, width: config.ArenaBordersWidth, height: config.ArenaHeight }
    ]

    this.movingBlocks = [
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
  }
  getStartPositions () {
    return this.startLocations
  }
  create () {
    this.scene.cameras.main.setBackgroundColor('#91d49c')
    // pas besoin pour faire sortir les projectiles ?
    // this.scene.physics.p2.updateBoundsCollisionGroup();

    const wallColor = 0x505050
    this.outerWalls.forEach(outerWall => {
      this.scene.add.rectangle(outerWall.x, outerWall.y, outerWall.width, outerWall.height, wallColor).setOrigin(0)
    })
    // [limitTop, limitBottom, limitLeft, limitRight].forEach(this.setArenaCollisionGroup)

    this.movingBlocks.forEach(wallCoords => {
      this.createMovingWall(wallCoords.from, wallCoords.to)
    })
  }
  update () {
  }

  setArenaCollisionGroup (entity) {
    this.scene.physics.p2.enable(entity, this.Config.Debug)
    entity.body.static = true
    entity.body.setMaterial(this.Services.PhysicsManager.materials.Arena)
    entity.body.setCollisionGroup(this.Services.PhysicsManager.Arena.id)
    entity.body.collides(this.Services.PhysicsManager.Arena.All)
  }

  createMovingWall (from, to) {
    log.info(`Creating moving wall (${from.x},${from.y}) -> (${to.x},${to.y})`)
    // const wall = this.scene.Groups.Objects.create(from.x, from.y, 'wall')
    const wall = this.scene.matter.add.image(from.x, from.y, 'wall')
    this.scene.Groups.Objects.add(wall)
    // this.setArenaCollisionGroup(wall)

    // const line = new Phaser.Geom.Line(from.x, from.y, to.x, to.y)
    // this.lines.push(line)

    this.scene.tweens.timeline({
      targets: wall,
      loop: -1,
      loopDelay: 2000,
      tweens: [{
        ease: 'Linear',
        duration: 2000,
        delay: 2000,
        ...to
      }, {
        ease: 'Linear',
        duration: 2000,
        ...from
      }]
    })
  }
  // render () {
  //   _.each(this.lines, line => {
  //     this.scene.debug.geom(line, 'black')
  //   })
  // }
}
/*
éléments de l'arène

bordures de l'arène : statique
éléments de décors : statique
éléments de décors : statique avec mouvements scriptés
téléporteurs (par couple) : déclencheur avec zone de téléportation et zone d'arriver (angle fixe)
armes: statique à pickup

format d'un asset

- texture et dimensions
- dimensions de hitbox

Exemple d'utilisation
- create
- update
*/
