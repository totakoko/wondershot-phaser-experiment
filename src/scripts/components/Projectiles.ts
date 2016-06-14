module Wondershot.Components {
  export class Projectiles {
    static const speed = Wondershot.Config.ProjectileSpeed;

    static init(game) {
      this.game = game;
      return this;
    }

    static preload() {
      this.game.load.image('projectile-arrow', 'assets/images/projectile-arrow.png');
      this.game.load.image('projectile-rock', 'assets/images/projectile-rock.png');
    }

    static initArrows() {
      this.arrowProjectiles = this.game.add.group(this.projectiles, 'projectiles-arrow');
      this.arrowProjectiles.createMultiple(50, 'projectile-arrow');
      this.arrowProjectiles.forEach(function(projectile) {
        projectile.scale.setTo(0.3);
        projectile.visible = false;
      });
      this.game.physics.p2.enable(this.arrowProjectiles, Wondershot.Config.Debug);

      this.arrowProjectiles.forEach(function(projectile) {
//         projectile.body.onBeginContact.add(this.hitHandler, this);

        //  Make kinematic - Kinematic means that the body will not be effected by
        //  physics such as gravity and collisions, but can still move and
        //  will fire collision events
        // projectile.body.kinematic = true;
      }, this);
    }

    static initRocks() {

      this.setupMaterial();
      this.rockProjectilesCollisionGroup = this.game.physics.p2.createCollisionGroup();
      this.rockProjectiles = this.game.add.group(this.projectiles, 'projectiles-rock');
      this.rockProjectiles.createMultiple(50, 'projectile-rock');
      this.rockProjectiles.forEach(function(projectile) {
        projectile.scale.setTo(0.3);
        projectile.visible = false;
      });
      this.game.physics.p2.enable(this.rockProjectiles, Wondershot.Config.Debug);
      this.rockProjectiles.forEach(function(projectile) {
        projectile.body.setCircle(10);
        projectile.body.fixedRotation = true;
        projectile.body.setMaterial(this.rockProjectileMaterial);
        projectile.body.setCollisionGroup(this.rockProjectilesCollisionGroup);
        // projectile.body.collides([this.game.players[0].playerCollisionGroup, this.rockProjectilesCollisionGroup], this.hitHandler, this);
        projectile.body.collides([this.rockProjectilesCollisionGroup, this.game.worldCollisionGroup], this.hitHandler, this);
        // projectile.body.data.damping = 0;
        // projectile.body.onBeginContact.add(this.hitHandler, this);
      }, this);
    }

    static setupMaterial() {
      this.rockProjectileMaterial = game.physics.p2.createMaterial('rockProjectileMaterial');

      contactMaterial = game.physics.p2.createContactMaterial(this.rockProjectileMaterial, this.game.worldMaterial);

      contactMaterial.friction = 0;     // Friction to use in the contact of these two materials.
      contactMaterial.restitution = 1.0;  // Restitution (i.e. how bouncy it is!) to use in the contact of these two materials.
      contactMaterial.stiffness = 1e16;    // Stiffness of the resulting ContactEquation that this ContactMaterial generate.
      contactMaterial.relaxation = 1;     // Relaxation of the resulting ContactEquation that this ContactMaterial generate.
      contactMaterial.frictionStiffness = 1e16;    // Stiffness of the resulting FrictionEquation that this ContactMaterial generate.
      contactMaterial.frictionRelaxation = 0;     // Relaxation of the resulting FrictionEquation that this ContactMaterial generate.
      contactMaterial.surfaceVelocity = 0;        // Will add surface velocity to this material. If bodyA rests on top if bodyB, and the surface velocity is positive, bodyA will slide to the right.

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

    static throwArrow(position, rotation, owner) {
      let projectile = this.arrowProjectiles.getFirstDead();
      projectile.owner = owner;
      projectile.reset(position.x, position.y);
      projectile.body.rotation = rotation;
      projectile.body.velocity.x = Math.cos(rotation) * this.speed;
      projectile.body.velocity.y = Math.sin(rotation) * this.speed;
    }

    static throwRock(position, rotation, owner) {

      let projectile = this.rockProjectiles.getFirstDead();
      projectile.owner = owner;
      projectile.reset(position.x, position.y);
      projectile.body.rotation = rotation;
      projectile.body.velocity.x = Math.cos(rotation) * this.speed;
      projectile.body.velocity.y = Math.sin(rotation) * this.speed;

      // setInterval(function() {
      //   console.log("speed =", projectile.body.velocity.x + projectile.body.velocity.y / 2);
      // }, 500);
    }

    static create() {

        this.projectiles = this.game.Groups.Projectiles;

        this.initArrows();
        this.initRocks();
    }

    static update() {

    }

    static render() {
      this.projectiles.forEachAlive(function(member) {
        this.game.debug.body(member);
      }, this);
    }
  }
}
