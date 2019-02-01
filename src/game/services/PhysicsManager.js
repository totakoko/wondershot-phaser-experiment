import Phaser from 'phaser'
import logger from 'loglevel'
const log = logger.getLogger('PhysicsManager') // eslint-disable-line no-unused-vars

export const PhysicsManager = WS.Services.PhysicsManager = class PhysicsManager {
  static init () {
    // If true then advanced profiling, including the fps rate, fps min/max, suggestedFps and msMin/msMax are updated.
    WS.game.time.advancedTiming = true

    WS.game.physics.startSystem(Phaser.Physics.P2JS)

    PhysicsManager.resume()
    WS.game.physics.p2.setImpactEvents(true) // http://phaser.io/docs/2.6.2/Phaser.Physics.P2.html#setImpactEvents
    // WS.game.physics.p2.applyGravity = false; // TODO pas encore besoin a priori
    //  4 trues = the 4 faces of the world in left, right, top, bottom order
    // WS.game.physics.p2.setArenaMaterial(WS.game.worldMaterial, true, true, true, true);
    this.initGroups()
    this.createCollisionGroups()
    this.createMaterials()
    //       this.stage.disableVisibilityChange = false; // met en pause le jeu si focus perdu et le reprends quand focus back
  }
  static initGroups () {
    // triés par z-index
    WS.game.Groups = {}
    WS.game.Groups.Game = WS.game.add.group(WS.game.world, 'game')
    WS.game.Groups.Arena = WS.game.add.group(WS.game.Groups.Game, 'arena')
    WS.game.Groups.Objects = WS.game.add.group(WS.game.Groups.Game, 'objects')
    WS.game.Groups.Players = WS.game.add.group(WS.game.Groups.Game, 'players')
    WS.game.Groups.Projectiles = WS.game.add.group(WS.game.Groups.Game, 'projectiles')
    WS.game.Groups.UI = WS.game.add.group(WS.game.Groups.Game, 'ui')
    WS.game.Groups.Menus = WS.game.add.group(WS.game.world, 'menus')
  }

  static createCollisionGroups () {
    const groupList = {
      Arena: {
        All: ['Arena', 'Objects', 'Projectile1', 'Projectile2', 'Projectile3', 'Projectile4', 'Player1', 'Player2', 'Player3', 'Player4']
      },
      Projectile1: {
        Arena: ['Arena'],
        OtherPlayers: ['Player2', 'Player3', 'Player4']
      },
      Projectile2: {
        Arena: ['Arena'],
        OtherPlayers: ['Player1', 'Player3', 'Player4']
      },
      Projectile3: {
        Arena: ['Arena'],
        OtherPlayers: ['Player1', 'Player2', 'Player4']
      },
      Projectile4: {
        Arena: ['Arena'],
        OtherPlayers: ['Player1', 'Player2', 'Player3']
      },
      Player1: {
        Arena: ['Arena'],
        OtherProjectiles: ['Projectile2', 'Projectile3', 'Projectile4'],
        Objects: ['Objects']
      },
      Player2: {
        Arena: ['Arena'],
        OtherProjectiles: ['Projectile1', 'Projectile3', 'Projectile4'],
        Objects: ['Objects']
      },
      Player3: {
        Arena: ['Arena'],
        OtherProjectiles: ['Projectile1', 'Projectile2', 'Projectile4'],
        Objects: ['Objects']
      },
      Player4: {
        Arena: ['Arena'],
        OtherProjectiles: ['Projectile1', 'Projectile2', 'Projectile3'],
        Objects: ['Objects']
      },
      Objects: {
        Arena: ['Arena'],
        Players: ['Player1', 'Player2', 'Player3', 'Player4']
      }
    }
    // définit les groupes de collision sur l'objet PhysicsManager
    Object.keys(groupList).forEach(groupName => {
      this[groupName] = {
        id: WS.game.physics.p2.createCollisionGroup()
      }
    })
    Object.keys(groupList).forEach(groupName => {
      //         console.debug('- %s', groupName);
      const groupAliases = groupList[groupName]
      Object.keys(groupAliases).forEach(groupAlias => {
        //           console.debug('  > %s', groupAlias);
        this[groupName][groupAlias] = groupAliases[groupAlias].map(collisionGroupName => {
          //             console.debug('    * %s', collisionGroupName);
          return this[collisionGroupName].id
        })
      })
    })
  }
  static createMaterials () {
    this.materials.Arena = WS.game.physics.p2.createMaterial('Arena')
    this.materials.WeaponSlingshot = WS.game.physics.p2.createMaterial('WeaponSlingshot')

    // Arena - WeaponSlingshot
    const slingshotContactMaterial = WS.game.physics.p2.createContactMaterial(this.materials.WeaponSlingshot, this.materials.Arena)
    slingshotContactMaterial.friction = 0 // Friction to use in the contact of these two materials.
    slingshotContactMaterial.restitution = 1.0 // Restitution (i.e. how bouncy it is!) to use in the contact of these two materials.
    slingshotContactMaterial.stiffness = 1e16 // Stiffness of the resulting ContactEquation that this ContactMaterial generate.
    slingshotContactMaterial.relaxation = 1 // Relaxation of the resulting ContactEquation that this ContactMaterial generate.
    slingshotContactMaterial.frictionStiffness = 1e16 // Stiffness of the resulting FrictionEquation that this ContactMaterial generate.
    slingshotContactMaterial.frictionRelaxation = 0 // Relaxation of the resulting FrictionEquation that this ContactMaterial generate.
    slingshotContactMaterial.surfaceVelocity = 0 // Will add surface velocity to this material. If bodyA rests on top if bodyB, and the surface velocity is positive, bodyA will slide to the right.
  }
  static pause () {
    WS.game.physics.p2.pause()
    WS.game.time.events.pause()
    WS.game.tweens.pauseAll()
  }
  static resume () {
    WS.game.physics.p2.resume()
    WS.game.time.events.resume()
    WS.game.tweens.resumeAll()
  }
}
PhysicsManager.materials = {}
