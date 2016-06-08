let pauseMenu = Wondershot.Components.PauseMenu;

module Wondershot.State {
  export class Main extends Phaser.State {
    pad1;
    indicator;
    player;
    components = [];

    preload() {
      this.game.load.image('player', 'assets/images/player.png');
      this.game.load.image('wall', 'assets/images/wall.png');
      this.game.load.image('projectile', 'assets/images/projectile.png');
      this.game.load.spritesheet('controller-indicator', 'assets/images/controller-indicator.png', 16, 16);

      pauseMenu.preload(this.game);
    }
    create() {
	  this.game.time.advancedTiming = true;

      this.game.physics.startSystem(Phaser.Physics.P2JS);
      this.game.physics.p2.applyGravity = false;

      this.game.stage.backgroundColor = '#91d49c';


      this.initGroups();

      // if !Wondershot.Components.Projectiles.init(this.game) return false;
      this.game.input.gamepad.start();
      // if !Wondershot.Components.Player.new(this.game, 1) return false;
      // if !Wondershot.Components.Player.new(this.game, 2) return false;
      this.scoreBoard = Wondershot.Components.ScoreBoard.init(this.game);
      this.components.push(this.scoreBoard);
      this.components.push(Wondershot.Components.Projectiles.init(this.game));
      this.components.push(Wondershot.Components.Player.new(this.game, 1));
      this.components.push(Wondershot.Components.Player.new(this.game, 2));

      pauseMenu.init(this.game);
      this.input.gamepad.pad1.getButton(Phaser.Gamepad.XBOX360_START).onDown.add(_.throttle(pauseMenu.togglePause, 500, {trailing: false}), pauseMenu);

    }

    initGroups() {
      this.infoGroup = this.game.add.group(game.world, 'info');
      this.arenaGroup = this.game.add.group(game.world, 'arena');
      this.playersGroup = this.game.add.group(game.world, 'players');
      this.projectilesGroup = this.game.add.group(game.world, 'projectiles');
    }
    update() {
      for (let component of this.components) {
        component.update();
      }
      game.physics.arcade.overlap(this.projectilesGroup, this.playersGroup, this.playerCollisionHandler, null, this);
      game.physics.arcade.overlap(this.projectilesGroup, this.arenaGroup, this.arenaCollisionHandler, null, this);
    }
    playerCollisionHandler(projectile, sprite) {
      // don't collide if the projectile is owned by the player
      if (sprite.owner === projectile.owner) {
        return;
      }

      console.log(`Player ${projectile.owner} touched player ${sprite.owner}`);
      this.scoreBoard.addPoint(projectile.owner);
      projectile.kill();
    }
    arenaCollisionHandler(projectile, sprite) {
      console.debug('collision !');
      projectile.kill();
    }
    render() {
//       for (let component of this.components) {
//         if (component.render) {
//           component.render();
//         }
//       }{
	  this.game.debug.text(this.game.time.fps, this.game.world.width-25, 14, "#f00");

      debugSpriteRecursive(this.game.world);
    }
  }
  function debugSpriteRecursive(parent) {
    parent.forEachAlive(function(member) {
      if (member.children && member.children.length > 0) {
        return debugSpriteRecursive(member);
      }
      this.game.debug.body(member);
    }, this);
  }
}
