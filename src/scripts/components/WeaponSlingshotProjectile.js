const WeaponSlingshotProjectile = WS.Components.WeaponSlingshotProjectile = class WeaponSlingshotProjectile extends WS.Lib.Entity {
    static preload() {
        WS.game.load.image('weapon-slingshot-projectile', 'assets/images/weapon-slingshot-projectile.png');
    }
    constructor(options) {
        super();
        this.bounceLeft = 3;
        this.weapon = options.weapon;
        this.owner = options.owner;
        let position = this.owner.sprite.position;
        let rotation = this.owner.sprite.rotation;

        let projectile = this.sprite = WS.game.Groups.Projectiles.create(
          position.x + Math.cos(rotation) * WS.Config.RockProjectileOffset,
          position.y + Math.sin(rotation) * WS.Config.RockProjectileOffset,
          'weapon-slingshot-projectile'
        );

        projectile.scale.setTo(0.3);
        projectile.visible = true;
        // WS.game.physics.p2.enable(projectile, WS.Config.Debug);
        projectile.body.setCircle(10);
        projectile.body.fixedRotation = true;
        projectile.body.setMaterial(WS.Services.PhysicsManager.materials.WeaponSlingshot);

        // let projectile = this.projectile = WeaponSlingshotProjectile.projectilesPool.getFirstDead();
        // projectile.reset(position.x + Math.cos(rotation) * WS.Config.RockProjectileOffset, position.y + Math.sin(rotation) * WS.Config.RockProjectileOffset);
        projectile.body.rotation = this.owner;

        projectile.body.velocity.x = Math.cos(rotation) * WS.Config.ProjectileSpeed;
        projectile.body.velocity.y = Math.sin(rotation) * WS.Config.ProjectileSpeed;

        const projectilePhysics = WS.Services.PhysicsManager['Projectile' + this.owner.playerNumber];
        projectile.body.setCollisionGroup(projectilePhysics.id);
        projectile.body.collides(projectilePhysics.World, this.worldHitHandler, this);
        projectile.body.collides(projectilePhysics.OtherPlayers, this.playerHitHandler, this);

        projectile.body.onBeginContact.add(this.contactHandler);
        this.setOwner(this.owner);
    }
    setOwner(owner) {
      this.owner = owner;
      if (owner === null) {
        this.sprite.tint = Config.PlayerColors.neutral.tint;
      } else {
        this.sprite.tint = this.owner.playerColor.tint;
      }
    }
    // TODO, utiliser un contactHandler plutôt que
    contactHandler(projectileBody, bodyB, shapeA, shapeB, equation) {
      console.log('projectile contact !', arguments);
    }
    worldHitHandler(projectileBody, bodyB, shapeA, shapeB, equation) {
        const projectile = projectileBody.sprite.data.projectile;
        console.log('bounceLeft', projectile.bounceLeft);
        if (projectile.bounceLeft > 0) {
            projectile.bounceLeft--;
            return;
        }
        projectileBody.setZeroVelocity();
        projectileBody.setZeroForce();

        // on remet le projectile dans un groupe neutre
        this.setOwner(null);
        projectile.body.setCollisionGroup(WS.Services.PhysicsManager['Projectile' + this.owner.playerNumber].id);
        projectile.body.collides(WS.Services.PhysicsManager['Projectile' + this.owner.playerNumber].World, this.worldHitHandler, this);
        projectile.body.collides(WS.Services.PhysicsManager['Projectile' + this.owner.playerNumber].OtherPlayers, this.playerHitHandler, this);
    }
    playerHitHandler(projectileBody, bodyB, shapeA, shapeB, equation) {
        const projectile = projectileBody.sprite.data.projectile;
        console.log(`Player ${projectile.owner.playerNumber} just hit ${bodyB.sprite.data.owner.playerNumber}`);
        bodyB.sprite.data.owner.kill();
        projectile.weapon.reload();
        projectileBody.kill();

    }

    render() {
      WS.game.debug.body(this.sprite);
    }
}
