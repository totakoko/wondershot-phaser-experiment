module Wondershot.Components {
  export class World {

    arenaBordersWidth = 30;
    headerHeight = 80;

    startLines = [];

    constructor(game) {
      this.game = game;
    }
    preload() {
      this.game.load.image('starting-position', 'assets/images/croix.png');
      this.game.load.image('wall', 'assets/images/wall.png');
    }
    create() {

      this.worldCollisionGroup = this.game.worldCollisionGroup = this.game.physics.p2.createCollisionGroup();

      // pas besoin pour faire sortir les projectiles ?
      // this.game.physics.p2.updateBoundsCollisionGroup();

      let verticalHeight = this.game.world.height-this.headerHeight-2*this.arenaBordersWidth;

      // Define a block using bitmap data rather than an image sprite
      let horizontalLimitBitmap = this.game.add.bitmapData(this.game.world.width, this.arenaBordersWidth);
      let verticalLimitBitmap = this.game.add.bitmapData(this.arenaBordersWidth, verticalHeight);

      // bar de 200px en haut

      horizontalLimitBitmap.ctx.rect(0, 0, this.game.world.width, this.arenaBordersWidth);
      horizontalLimitBitmap.ctx.fillStyle = '#fff';
      horizontalLimitBitmap.ctx.fill();
      verticalLimitBitmap.ctx.rect(0, 0, this.arenaBordersWidth, verticalHeight);
      verticalLimitBitmap.ctx.fillStyle = '#fff';
      verticalLimitBitmap.ctx.fill();

      // Create a new sprite using the bitmap data
      this.limitTop = this.game.Groups.Objects.create(this.game.world.width/2, this.headerHeight+this.arenaBordersWidth/2, horizontalLimitBitmap);
      this.limitBottom = this.game.Groups.Objects.create(this.game.world.width/2, this.game.world.height-this.arenaBordersWidth/2, horizontalLimitBitmap);

      let verticalLimitPos = this.headerHeight + this.arenaBordersWidth + verticalHeight/2;
      this.limitLeft = this.game.Groups.Objects.create(this.arenaBordersWidth/2, verticalLimitPos, verticalLimitBitmap);
      this.limitRight = this.game.Groups.Objects.create(this.game.world.width-this.arenaBordersWidth/2, verticalLimitPos, verticalLimitBitmap);

      // Enable P2 Physics and set the block not to move
      this.game.physics.p2.enable([this.limitTop, this.limitBottom, this.limitLeft, this.limitRight], Wondershot.Config.Debug);
      [this.limitTop, this.limitBottom, this.limitLeft, this.limitRight].forEach(function(limit) {
        limit.body.static = true;
        limit.body.setMaterial(this.game.worldMaterial);
        limit.body.setCollisionGroup(this.worldCollisionGroup);
      }, this);
      // test Material

      let wall = this.game.Groups.Objects.create(120, 300, 'wall');
      let wall2 = this.game.Groups.Objects.create(280, 500, 'wall');

      this.game.physics.p2.enable([wall, wall2], Wondershot.Config.Debug);
      wall.body.static = true;
      wall2.body.static = true;
      wall.body.setMaterial(this.game.worldMaterial);
      wall2.body.setMaterial(this.game.worldMaterial);
      wall.body.setCollisionGroup(this.worldCollisionGroup);
      wall2.body.setCollisionGroup(this.worldCollisionGroup);


      this.loopVertical(wall);
      this.loopVertical(wall2, true);

      let startingPositions = [
         {x:40, y:120},
         {x:280, y:120},
         {x:40, y:580},
         {x:280, y:580}
       ];
       startingPositions.forEach(function(position) {
         this.game.Groups.Floor.create(position.x, position.y, 'starting-position', null);
       }, this);

    }
    update() {
    }

    loopVertical(entity, reverse) {
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
      this.game.add.tween(entity.body.velocity)
        .to({x: 0, y: reverse?-60: 60}, 2000, Phaser.Easing.Quadratic.In)
        .to({x: 0, y: 0}, 1000, Phaser.Easing.Quadratic.Out, false, 2000)
        .to({x: 0, y: reverse? 60:-60}, 2000, Phaser.Easing.Quadratic.In)
        .to({x: 0, y: 0}, 1000, Phaser.Easing.Quadratic.Out, false, 2000)
        .loop()
        .start();
    }

  }
}

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
