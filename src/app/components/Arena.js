import Phaser from 'phaser';
import WS from '../WS';
const log = require('misc/loglevel').getLogger('Arena'); // eslint-disable-line no-unused-vars

export default WS.Components.Arena = class Arena extends WS.Lib.Entity {
    static preload() {
        WS.game.load.image('wall', 'assets/images/wall.png');
    }
    constructor() {
        super();
        this.arenaBordersWidth = 30;
        this.startLines = [];
        this.startLocations = [
          {x: 90, y: 180},
          {x: 300, y: 180},
          {x: 90, y: 600},
          {x: 300, y: 600},
        ];
    }
    getStartPositions() {
      return this.startLocations;
    }
    create() {
        WS.game.stage.backgroundColor = '#91d49c';
        // pas besoin pour faire sortir les projectiles ?
        // WS.game.physics.p2.updateBoundsCollisionGroup();
        const verticalHeight = WS.game.world.height - 2 * this.arenaBordersWidth;
        // Define a block using bitmap data rather than an image sprite
        const horizontalLimitBitmap = WS.game.add.bitmapData(WS.game.world.width, this.arenaBordersWidth);
        const verticalLimitBitmap = WS.game.add.bitmapData(this.arenaBordersWidth, verticalHeight);
        // bar de 200px en haut
        horizontalLimitBitmap.ctx.rect(0, 0, WS.game.world.width, this.arenaBordersWidth);
        horizontalLimitBitmap.ctx.fillStyle = '#fff';
        horizontalLimitBitmap.ctx.fill();
        verticalLimitBitmap.ctx.rect(0, 0, this.arenaBordersWidth, verticalHeight);
        verticalLimitBitmap.ctx.fillStyle = '#fff';
        verticalLimitBitmap.ctx.fill();
        // Create a new sprite using the bitmap data
        const limitTop = WS.game.Groups.Arena.create(WS.game.world.width / 2, this.arenaBordersWidth / 2, horizontalLimitBitmap);
        const limitBottom = WS.game.Groups.Arena.create(WS.game.world.width / 2, WS.game.world.height - this.arenaBordersWidth / 2, horizontalLimitBitmap);
        const verticalLimitPos = this.arenaBordersWidth + verticalHeight / 2;
        const limitLeft = WS.game.Groups.Objects.create(this.arenaBordersWidth / 2, verticalLimitPos, verticalLimitBitmap);
        const limitRight = WS.game.Groups.Objects.create(WS.game.world.width - this.arenaBordersWidth / 2, verticalLimitPos, verticalLimitBitmap);
        [limitTop, limitBottom, limitLeft, limitRight].forEach(this.setArenaCollisionGroup);

        // TODO faire un petit calcul pour connaître la vélocité en fonction de from - to
        const walls = [
          { // haut-gauche
            from: {
              x: WS.Services.ScaleManager.xp(20),
              y: WS.Services.ScaleManager.yp(35),
            },
            to: {
              x: WS.Services.ScaleManager.xp(40),
              y: WS.Services.ScaleManager.yp(35),
            },
          },
          { // haut-droite
            from: {
              x: WS.Services.ScaleManager.xp(80),
              y: WS.Services.ScaleManager.yp(35),
            },
            to: {
              x: WS.Services.ScaleManager.xp(60),
              y: WS.Services.ScaleManager.yp(35),
            },
          },
          { // bas-gauche
            from: {
              x: WS.Services.ScaleManager.xp(40),
              y: WS.Services.ScaleManager.yp(65),
            },
            to: {
              x: WS.Services.ScaleManager.xp(20),
              y: WS.Services.ScaleManager.yp(65),
            },
          },
          { // bas-droite
            from: {
              x: WS.Services.ScaleManager.xp(60),
              y: WS.Services.ScaleManager.yp(65),
            },
            to: {
              x: WS.Services.ScaleManager.xp(80),
              y: WS.Services.ScaleManager.yp(65),
            },
          },
        ];
        walls.forEach(wallCoords => {
          this.createMovingWall(wallCoords.from, wallCoords.to);
        });
    }
    update() {
    }

    setArenaCollisionGroup(entity) {
      WS.game.physics.p2.enable(entity, WS.Config.Debug);
      entity.body.static = true;
      entity.body.setMaterial(WS.Services.PhysicsManager.materials.Arena);
      entity.body.setCollisionGroup(WS.Services.PhysicsManager.Arena.id);
      entity.body.collides(WS.Services.PhysicsManager.Arena.All);
    }

    createMovingWall(from, to) {
      log.info(`Creating moving wall (${from.x},${from.y}) -> (${to.x},${to.y})`);
      const wall = WS.game.Groups.Objects.create(from.x, from.y, 'wall');
      this.setArenaCollisionGroup(wall);

      const xDistance = to.x - from.x;
      const yDistance = to.y - from.y;

      const coefReduction = 2;
      /*
       * @method Phaser.Tween#to
       * @param {object} properties - An object containing the properties you want to tween, such as `Sprite.x` or `Sound.volume`. Given as a JavaScript object.
       * @param {number} [duration=1000] - Duration of this tween in ms. Or if `Tween.frameBased` is true this represents the number of frames that should elapse.
       * @param {function|string} [ease=null] - Easing function. If not set it will default to Phaser.Easing.Default, which is Phaser.Easing.Linear.None by default but can be over-ridden.
       * @param {boolean} [autoStart=false] - Set to `true` to allow this tween to start automatically. Otherwise call Tween.start().
       * @param {number} [delay=0] - Delay before this tween will start in milliseconds. Defaults to 0, no delay.
       * @param {number} [repeat=0] - Should the tween automatically restart once complete? If you want it to run forever set as -1. This only effects this individual tween, not any chained tweens.
       * @param {boolean} [yoyo=false] - A tween that yoyos will reverse itself and play backwards automatically. A yoyo'd tween doesn't fire the Tween.onComplete event, so listen for Tween.onLoop instead.
       * @return {Phaser.Tween} This Tween object.
       */
      WS.game.add.tween(wall.body.velocity)
          .to({x: xDistance / coefReduction, y: yDistance / coefReduction}, 2000, Phaser.Easing.Quadratic.In)
          .to({x: 0, y: 0}, 1000, Phaser.Easing.Quadratic.Out, false, 2000)
          .to({x: -xDistance / coefReduction, y: -yDistance / coefReduction}, 2000, Phaser.Easing.Quadratic.In)
          .to({x: 0, y: 0}, 1000, Phaser.Easing.Quadratic.Out, false, 2000)
          .loop()
          .start();
    }
};
/*
éléments de l'arène

bordures de l'arène : statique
éléments de décors : statique
éléments de décors : statique avec mouvements scriptés
téléporteurs (par couple) : déclencheur avec zone de téléportation et zone d'arriver (angle fixe)
armes: statique à pickup

format d'un asset

- texture et dimensions
- dimensions de hitbox

Exemple d'utilisation
- create
- update
*/
