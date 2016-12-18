let PauseMenu = WS.Components.PauseMenu,
    ScoreBoard = WS.Components.ScoreBoard,
    Projectiles = WS.Components.Projectiles,
    PlayerManager = WS.Components.PlayerManager,
    World = WS.Components.World,
    PhysicsManager = WS.Services.PhysicsManager,
    Weapon = WS.Components.Weapon;

const Battle = WS.State.Battle = class Battle extends Phaser.State {
    init(stateOptions) {
      console.log("init");
      this.activePlayers = stateOptions.activePlayers; // list of playerNumber
    }
    create() {
        console.log("create");
        this.components = [];
        WS.Services.PhysicsManager.init();

        this.components.push(new PauseMenu());
        let world = new World();
        this.components.push(world);
        // positions triées pour être dépilées simplement
        this.startLocations = _.chain(world.getStartPositions())
                              .shuffle()
                              .value();
        if (this.activePlayers.length > this.startLocations.length) {
          throw new Error(`The world has only ${this.startLocations.length} start locations while there are ${this.activePlayers.length} active players.`);
        }

        this.players = {};
        this.activePlayers.forEach((playerNumber) => {
            let player = this.players[playerNumber] = new WS.Components.Player({
              playerNumber: playerNumber,
              color: WS.Config.PlayerColors[playerNumber],
              pad: WS.Services.PadManager.getGamepad(playerNumber),
              startLocation: this.getNextStartLocation(),
            });
            player.pickupWeapon(new WS.Components.WeaponSlingshot());
            this.components.push(player);
        });


        // TODO setup weapon collision groups + bullets
        this.scoreBoard = new ScoreBoard(this.players);
        this.components.push(this.scoreBoard);

        WS.Components.WeaponSlingshotProjectile.create();

        this.components.forEach((component) => {component.create()});
        // for (let component of this.components) {
        //     component.create();
        // }
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
}
