const Round = WS.State.Round = class Round extends Phaser.State {
    init(stateOptions) {
        this.battle = stateOptions.battle;
    }
    create() {
        console.log('round: create');
        WS.Services.PhysicsManager.init();

        this.components = [];

        this.pauseMenu = new WS.Components.PauseMenu();
        this.components.push(this.pauseMenu);
        this.components.push(new WS.Components.ScoreBoard(this.battle));
        let world = new WS.Components.World();
        this.components.push(world);

        // positions triées pour être dépilées simplement
        this.startLocations = _.chain(world.getStartPositions())
                              .shuffle()
                              .value();
        if (this.battle.players.length > this.startLocations.length) {
          throw new Error(`The world has only ${this.startLocations.length} start locations while there are ${this.activePlayers.length} active players.`);
        }

        this.players = {};
        this.battle.players.forEach((playerNumber) => {
            let player = this.players[playerNumber] = new WS.Components.Player({
              playerNumber: playerNumber,
              color: WS.Config.PlayerColors[playerNumber],
              pad: WS.Services.PadManager.getGamepad(playerNumber),
              startLocation: this.getNextStartLocation(),
            });
            player.pickupWeapon(new WS.Components.WeaponSlingshot());
            this.components.push(player);
        });

        WS.Components.WeaponSlingshotProjectile.create();

        this.components.forEach((component) => {
          component.create();
        });
    }
    getNextStartLocation() {
      return this.startLocations.splice(0, 1)[0];
    }
    update() {
        for (let component of this.components) {
            component.update();
        }
    }
    pauseUpdate() {
        // permet de mettre à jour les gamepad pour sortir de la pause
        if (WS.game.input.gamepad && WS.game.input.gamepad.active) {
            WS.game.input.gamepad.update();
        }
    }
    render() {
        for (let component of this.components) {
            component.render();
        }
        // FPS
        WS.game.debug.text(WS.game.time.fps, WS.game.world.width - 25, 14, "#f00");
    }
    shutdown() {
      console.log('Round: shutdown');
    }
}
