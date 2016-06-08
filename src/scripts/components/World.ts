module Wondershot.Components {
  export class World {

    constructor(game) {
      this.game = game;
    }
    create() {
      // position de départ
      

    // Define a block using bitmap data rather than an image sprite
    var blockShape = this.game.add.bitmapData(this.game.world.width, 200);

    // Fill the block with black color
    blockShape.ctx.rect(0, 0, me.game.world.width, 200);
    blockShape.ctx.fillStyle = '000';
    blockShape.ctx.fill();

    // Create a new sprite using the bitmap data
    me.block = me.game.add.sprite(0, 0, blockShape);

    // Enable P2 Physics and set the block not to move
    me.game.physics.p2.enable(me.block);
    me.block.body.static = true;
    me.block.anchor.setTo(0, 0);
    }
    update() {
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
