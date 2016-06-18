module Wondershot.Components {
  export class CollisionManager {

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
        console.debug('- %s', groupName);
        let groupAliases = groupList[groupName];
        Object.keys(groupAliases).forEach(function(groupAlias) {
          console.debug('  > %s', groupAlias);
          _this[groupName][groupAlias] = groupAliases[groupAlias].map(function(collisionGroupName) {
            console.debug('    * %s', collisionGroupName);
            return _this[collisionGroupName].id;
          });
        });
      });
    }
  }
}
