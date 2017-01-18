import Phaser from 'phaser';
import WS from '../';

export default class Round extends Phaser.State {
    init(stateOptions) {
        this.battle = stateOptions.battle;
    }
    create() {
        console.log('round: create');
        WS.Services.PhysicsManager.init();


        this.battle.resetStage();

        this.pauseMenu = new WS.Components.PauseMenu();
        this.battle.stage.register(this.pauseMenu)
        this.battle.stage.register(new WS.Components.ScoreBoard(this.battle));
        let world = new WS.Components.World();
        this.battle.stage.register(world)

        // positions triées pour être dépilées simplement
        this.startLocations = _.chain(world.getStartPositions())
                              .shuffle()
                              .value();
        if (this.battle.players.length > this.startLocations.length) {
          throw new Error(`The world has only ${this.startLocations.length} start locations while there are ${this.activePlayers.length} active players.`);
        }

        this.players = {};
        this.battle.players.forEach((playerNumber) => {
            const player = this.players[playerNumber] = new WS.Components.PlayerBot({
              playerNumber: playerNumber,
              color: WS.Config.PlayerColors[playerNumber],
              pad: WS.Services.PadManager.getGamepad(playerNumber),
              startLocation: this.getNextStartLocation(),
            });
            const weapon = new WS.Components.WeaponSlingshot({
              owner: player,
            });
            player.pickupWeapon(weapon);
            this.battle.stage.register(weapon)
            this.battle.stage.register(player)
        });

        this.battle.stage.create();
    }
    getNextStartLocation() {
      return this.startLocations.splice(0, 1)[0];
    }
    update() {
        this.battle.stage.update();
    }
    pauseUpdate() {
        this.battle.stage.pauseUpdate();
    }
    render() {
        this.battle.stage.render();
        // FPS
        WS.game.debug.text(WS.game.time.fps, WS.game.world.width - 25, 14, "#f00");
    }
    shutdown() {
      console.log('Round: shutdown');
    }
}
