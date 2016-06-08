module Wondershot.Components {
  export class Projectiles {
    static const speed = Wondershot.Config.ProjectileSpeed;


    static init(game) {
      this.game = game;

      projectiles = this.game.world.getByName('projectiles');

      projectiles.createMultiple(50, 'projectile');
      projectiles.forEach(function(projectile) {
        projectile.scale.setTo(0.3);
        projectile.visible = false;
      });


//       this.game.physics.p2.enable(projectiles, true);

//       projectiles.forEach(function(projectile) {
//         projectile.body.onBeginContact.add(this.hitHandler, this);
//       }, this);

//       projectiles.setAll('checkWorldBounds', false);
//       projectiles.setAll('outOfBoundsKill', true);

      return this;
    }

    static hitHandler(body, bodyB, shapeA, shapeB, equation) {
      //  The block hit something.
      //  
      //  This callback is sent 5 arguments:
      //  
      //  The Phaser.Physics.P2.Body it is in contact with. *This might be null* if the Body was created directly in the p2 world.
      //  The p2.Body this Body is in contact with.
      //  The Shape from this body that caused the contact.
      //  The Shape from the contact body.
      //  The Contact Equation data array.
      //  
      //  The first argument may be null or not have a sprite property, such as when you hit the world bounds.
      if (body) {
        result = 'You last hit: ' + body.sprite.key;
      } else {
        result = 'You last hit: The wall :)';
      }
    }

    static new(position, rotation, owner) {
      let projectile = projectiles.getFirstDead();
      projectile.reset(position.x, position.y);

      this.game.physics.p2.enable(projectile, true);

      projectile.body.rotation = rotation + Math.PI/2;
//       projectile.body.moveForward(100);
      
//       projectile.body.rotation = rotation;
      projectile.owner = owner;
//       projectile.anchor.setTo(0.0, 0.5);
//       projectile.scale.setTo(0.3);
//       projectile.body.fixedRotation = false;
//       projectile.rotation = rotation; // radiant
//       let rotationInverva = setInterval(function() {
//         projectile.body.rotation += .1;
//       }, 30);
//       setTimeout(function() {
//         clearInterval(rotationInverva);
//       }, 2000)

      projectile.body.velocity.x = Math.cos(rotation) * this.speed;
      projectile.body.velocity.y = Math.sin(rotation) * this.speed;
//       projectile.body.setZeroDamping();
//       projectile.body.setZeroForce();
    }

    static update() {

    }

    static render() {
      projectiles.forEachAlive(function(member) {
        this.game.debug.body(member);
      }, this);
    }
  }
}
