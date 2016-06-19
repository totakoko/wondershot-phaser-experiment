module Wondershot.Components {
  export class CollisionManager {
    static materials = {};

    static init(game) {
      this.game = game;
      return this;
    }

    static createCollisionGroups() {
      var _this = this;
      let groupList = {
        World: {
          All: ['World', 'Projectile1', 'Projectile2', 'Projectile3', 'Projectile4', 'Player1', 'Player2', 'Player3', 'Player4']
        },
        Projectile1: {
          World: ['World'],
          OtherPlayers: ['Player2', 'Player3', 'Player4']
        },
        Projectile2: {
          World: ['World'],
          OtherPlayers: ['Player1', 'Player3', 'Player4']
        },
        Projectile3: {
          World: ['World'],
          OtherPlayers: ['Player1', 'Player2', 'Player4']
        },
        Projectile4: {
          World: ['World'],
          OtherPlayers: ['Player1', 'Player2', 'Player3']
        },
        Player1: {
          World: ['World'],
          OtherProjectiles: ['Projectile2', 'Projectile3', 'Projectile4']
        },
        Player2: {
          World: ['World'],
          OtherProjectiles: ['Projectile1', 'Projectile3', 'Projectile4']
        },
        Player3: {
          World: ['World'],
          OtherProjectiles: ['Projectile1', 'Projectile2', 'Projectile4']
        },
        Player4: {
          World: ['World'],
          OtherProjectiles: ['Projectile1', 'Projectile2', 'Projectile3']
        },
      };

      Object.keys(groupList).forEach(function(groupName) {
        _this[groupName] = {
          id: _this.game.physics.p2.createCollisionGroup()
        };
      });

      Object.keys(groupList).forEach(function(groupName) {
//         console.debug('- %s', groupName);
        let groupAliases = groupList[groupName];
        Object.keys(groupAliases).forEach(function(groupAlias) {
//           console.debug('  > %s', groupAlias);
          _this[groupName][groupAlias] = groupAliases[groupAlias].map(function(collisionGroupName) {
//             console.debug('    * %s', collisionGroupName);
            return _this[collisionGroupName].id;
          });
        });
      });
    }

    static createMaterials() {
      this.materials.World = this.game.physics.p2.createMaterial('World');
      this.materials.WeaponSlingshot = this.game.physics.p2.createMaterial('WeaponSlingshot');

      this.createContactMaterials();
    }

    static createContactMaterials() {
      let contactMaterial = game.physics.p2.createContactMaterial(this.materials.WeaponSlingshot, this.materials.World);
      contactMaterial.friction = 0;     // Friction to use in the contact of these two materials.
      contactMaterial.restitution = 1.0;  // Restitution (i.e. how bouncy it is!) to use in the contact of these two materials.
      contactMaterial.stiffness = 1e16;    // Stiffness of the resulting ContactEquation that this ContactMaterial generate.
      contactMaterial.relaxation = 1;     // Relaxation of the resulting ContactEquation that this ContactMaterial generate.
      contactMaterial.frictionStiffness = 1e16;    // Stiffness of the resulting FrictionEquation that this ContactMaterial generate.
      contactMaterial.frictionRelaxation = 0;     // Relaxation of the resulting FrictionEquation that this ContactMaterial generate.
      contactMaterial.surfaceVelocity = 0;        // Will add surface velocity to this material. If bodyA rests on top if bodyB, and the surface velocity is positive, bodyA will slide to the right.
    }
  }
}
