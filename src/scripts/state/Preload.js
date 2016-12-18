const Preload = WS.State.Preload = class Preload extends Phaser.State {
    preload() {
        this.preloadBar = this.add.sprite(WS.game.world.centerX, WS.game.world.centerY, 'preload-bar');
        this.preloadBar.anchor.setTo(0.5, 0.5);
        this.load.setPreloadSprite(this.preloadBar);

        // const entities = [
        //   PhysicsManager,
        //   PauseMenu,
        //   Player,
        //   PlayersManager,
        //   ScoreBoard,
        //   Weapon,
        //   WeaponSlingshot,
        //   WeaponSlingshotProjectile,
        //   World,
        // ];
        for (let entityName of Object.keys(WS.Components)) {
          // console.log(`preloading ${entityName}`)
          WS.Components[entityName].preload();
        }
    }
    create() {
        // setTimeout(() => {
        WS.Services.PadManager.init();
        // WS.game.state.start('characterSelection');
        WS.game.state.start('battle', true, false, {
          activePlayers: ["1", "2"]
        });
        // }, 1000);
    }
}
