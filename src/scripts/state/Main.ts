let pauseMenu = Wondershot.Components.PauseMenu;
let scoreBoard = Wondershot.Components.ScoreBoard;
    Projectiles = Wondershot.Components.Projectiles,
    Player = Wondershot.Components.Player,
    World = Wondershot.Components.World;

module Wondershot.State {
  export class Main extends Phaser.State {
    pad1;
    indicator;
    player;
    components = [];
    constructor(game) {
      console.log('state constructor');
      this.components = [
        pauseMenu.init(game),
        scoreBoard.init(game),
        new World(game),
        Projectiles.init(game)
        // new Player(game, 1)
      ]
    }

    preload() {
      console.log('state preload');
      this.game.load.spritesheet('controller-indicator', 'assets/images/controller-indicator.png', 16, 16);

      for (let component of this.components) {
        if (component.preload) {
          component.preload();
        }
      }
    }
    create() {
	    this.game.time.advancedTiming = true;

      this.game.physics.startSystem(Phaser.Physics.P2JS);
      // this.game.physics.p2.applyGravity = false; // TODO pas encore besoin a priori

      this.game.worldMaterial = this.game.physics.p2.createMaterial('worldMaterial');
      //  4 trues = the 4 faces of the world in left, right, top, bottom order
      this.game.physics.p2.setWorldMaterial(this.game.worldMaterial, true, true, true, true);

      this.initGroups();

      // if !Wondershot.Components.Projectiles.init(this.game) return false;

      this.initBattle(1);

      for (let component of this.components) {
        if (component.create) {
          component.create();
        }
      }
    }
    initBattle() {

      this.game.stage.backgroundColor = '#91d49c';
//       this.stage.disableVisibilityChange = false; // met en pause le jeu si focus perdu et le reprends quand focus back
      this.game.input.gamepad.start();

      this.game.players = [];
      let player1 = new Player(this.game, 1);
      this.game.players.push(player1);
      this.components.push(player1);

    }
    initGroups() {
      // triés par z-index
      this.game.Groups = {};
      this.game.Groups.Game = this.game.add.group(game.world, 'game');
      this.game.Groups.Floor = this.game.add.group(this.game.Groups.Game, 'floor');
      this.game.Groups.Objects = this.game.add.group(this.game.Groups.Game, 'objects');
      this.game.Groups.Players = this.game.add.group(this.game.Groups.Game, 'players');
      this.game.Groups.Projectiles = this.game.add.group(this.game.Groups.Game, 'projectiles');
      this.game.Groups.UI = this.game.add.group(this.game.Groups.Game, 'ui');
      this.game.Groups.Menus = this.game.add.group(game.world, 'menus');
    }
    update() {
      for (let component of this.components) {
        if (component.update) {
          component.update();
        }
      }
    }
    pauseUpdate() {
      // permet de mettre à jour les gamepad pour sortir de la pause
      if (this.game.input.gamepad && this.game.input.gamepad.active) {
        this.game.input.gamepad.update();
      }
    }
    render() {
      for (let component of this.components) {
        if (component.render) {
          component.render();
        }
      }
      // FPS
      this.game.debug.text(this.game.time.fps, this.game.world.width-25, 14, "#f00");
    }
  }
}
