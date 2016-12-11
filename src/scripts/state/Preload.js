const Preload = WS.State.Preload = class Preload extends Phaser.State {
    preload() {
        this.preloadBar = this.add.sprite(290, 290, 'preload-bar');
        this.load.setPreloadSprite(this.preloadBar);

        // const entities = [
        //   CollisionManager,
        //   PauseMenu,
        //   Player,
        //   PlayersManager,
        //   ScoreBoard,
        //   Weapon,
        //   WeaponSlingshot,
        //   WeaponSlingshotProjectile,
        //   World,
        // ];
        // entities.forEach(function(entity) {
        //   console.log(`preloading ${entity}`)
        //   entity.preload(game);
        // })
        // const entities = [
        //   CollisionManager,
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
          console.log(`preloading ${entityName}`)
          WS.Components[entityName].preload();
        }
    }
    create() {
        // setTimeout(() => {
        WS.game.state.start('battle');
        // }, 1000);
    }
}
