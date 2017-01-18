import Phaser from 'phaser';
import WS from '../';

export const PhysicsManager = class PhysicsManager {
  static init() {
    // If true then advanced profiling, including the fps rate, fps min/max, suggestedFps and msMin/msMax are updated.
    WS.game.time.advancedTiming = true;

    WS.game.physics.startSystem(Phaser.Physics.P2JS);
    WS.game.physics.p2.setImpactEvents(true); // http://phaser.io/docs/2.6.2/Phaser.Physics.P2.html#setImpactEvents
    // WS.game.physics.p2.applyGravity = false; // TODO pas encore besoin a priori
    //  4 trues = the 4 faces of the world in left, right, top, bottom order
    // WS.game.physics.p2.setWorldMaterial(WS.game.worldMaterial, true, true, true, true);
    this.initGroups();
    this.createCollisionGroups();
    this.createMaterials();
    //       this.stage.disableVisibilityChange = false; // met en pause le jeu si focus perdu et le reprends quand focus back

  }
  static initGroups() {
    // triés par z-index
    WS.game.Groups = {};
    WS.game.Groups.Game = WS.game.add.group(WS.game.world, 'game');
    WS.game.Groups.Floor = WS.game.add.group(WS.game.Groups.Game, 'floor');
    WS.game.Groups.Objects = WS.game.add.group(WS.game.Groups.Game, 'objects', false, true, Phaser.Physics.P2JS);
    WS.game.Groups.Players = WS.game.add.group(WS.game.Groups.Game, 'players', false, true, Phaser.Physics.P2JS);
    WS.game.Groups.Projectiles = WS.game.add.group(WS.game.Groups.Game, 'projectiles', false, true, Phaser.Physics.P2JS);
    WS.game.Groups.UI = WS.game.add.group(WS.game.Groups.Game, 'ui');
    WS.game.Groups.Menus = WS.game.add.group(WS.game.world, 'menus');
  }

  static createCollisionGroups() {
      let groupList = {
          World: {
              All: ['World', 'Projectile1', 'Projectile2', 'Projectile3', 'Projectile4', 'Player1', 'Player2', 'Player3', 'Player4'],
          },
          Projectile1: {
              World: ['World'],
              OtherPlayers: ['Player2', 'Player3', 'Player4'],
          },
          Projectile2: {
              World: ['World'],
              OtherPlayers: ['Player1', 'Player3', 'Player4'],
          },
          Projectile3: {
              World: ['World'],
              OtherPlayers: ['Player1', 'Player2', 'Player4'],
          },
          Projectile4: {
              World: ['World'],
              OtherPlayers: ['Player1', 'Player2', 'Player3'],
          },
          Player1: {
              World: ['World'],
              OtherProjectiles: ['Projectile2', 'Projectile3', 'Projectile4'],
              Objects: ['Objects'],
          },
          Player2: {
              World: ['World'],
              OtherProjectiles: ['Projectile1', 'Projectile3', 'Projectile4'],
              Objects: ['Objects'],
          },
          Player3: {
              World: ['World'],
              OtherProjectiles: ['Projectile1', 'Projectile2', 'Projectile4'],
              Objects: ['Objects'],
          },
          Player4: {
              World: ['World'],
              OtherProjectiles: ['Projectile1', 'Projectile2', 'Projectile3'],
              Objects: ['Objects'],
          },
          Objects: {
              World: ['World'],
              Players: ['Player1', 'Player2', 'Player3', 'Player4'],
          },
      };
      Object.keys(groupList).forEach((groupName) => {
          this[groupName] = {
              id: WS.game.physics.p2.createCollisionGroup()
          };
      });
      Object.keys(groupList).forEach((groupName) => {
          //         console.debug('- %s', groupName);
          let groupAliases = groupList[groupName];
          Object.keys(groupAliases).forEach((groupAlias) => {
              //           console.debug('  > %s', groupAlias);
              this[groupName][groupAlias] = groupAliases[groupAlias].map((collisionGroupName) => {
                  //             console.debug('    * %s', collisionGroupName);
                  return this[collisionGroupName].id;
              });
          });
      });
  }
  static createMaterials() {
      this.materials.World = WS.game.physics.p2.createMaterial('World');
      this.materials.WeaponSlingshot = WS.game.physics.p2.createMaterial('WeaponSlingshot');

      // slingshot
      const slingshotContactMaterial = WS.game.physics.p2.createContactMaterial(this.materials.WeaponSlingshot, this.materials.World);
      slingshotContactMaterial.friction = 0; // Friction to use in the contact of these two materials.
      slingshotContactMaterial.restitution = 1.0; // Restitution (i.e. how bouncy it is!) to use in the contact of these two materials.
      slingshotContactMaterial.stiffness = 1e16; // Stiffness of the resulting ContactEquation that this ContactMaterial generate.
      slingshotContactMaterial.relaxation = 1; // Relaxation of the resulting ContactEquation that this ContactMaterial generate.
      slingshotContactMaterial.frictionStiffness = 1e16; // Stiffness of the resulting FrictionEquation that this ContactMaterial generate.
      slingshotContactMaterial.frictionRelaxation = 0; // Relaxation of the resulting FrictionEquation that this ContactMaterial generate.
      slingshotContactMaterial.surfaceVelocity = 0; // Will add surface velocity to this material. If bodyA rests on top if bodyB, and the surface velocity is positive, bodyA will slide to the right.

  }
}
PhysicsManager.materials = {};
