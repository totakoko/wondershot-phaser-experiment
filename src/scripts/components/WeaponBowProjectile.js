const WeaponBowProjectile = WS.Components.WeaponBowProjectile = class WeaponBowProjectile extends WS.Lib.Entity {
    static preload() {
        WS.game.load.image('weapon-slingshot-projectile', 'assets/images/weapon-slingshot-projectile.png');
    }
    static create() {
        this.projectilesPool = new Phaser.Group(WS.game, WS.game.Groups.Projectiles, 'weapon-slingshot-projectiles');
        this.projectilesPool.createMultiple(2000, 'weapon-slingshot-projectile');
        this.projectilesPool.forEach(function (projectile) {
            projectile.scale.setTo(0.3);
            projectile.visible = false;
        });
        WS.game.physics.p2.enable(this.projectilesPool, WS.Config.Debug);
        this.projectilesPool.forEach(function (projectile) {
            projectile.body.setCircle(10);
            projectile.body.fixedRotation = true;
            projectile.body.setMaterial(WS.Services.PhysicsManager.materials.WeaponBow);
        }, this);
    }
    constructor(options) {
        super();
        this.weapon = options.weapon;
        this.owner = options.owner;
        let position = this.owner.sprite.position;
        let rotation = this.owner.sprite.rotation;

        let projectile = this.projectile = WeaponBowProjectile.projectilesPool.getFirstDead();
        projectile.reset(position.x + Math.cos(rotation) * WS.Config.RockProjectileOffset, position.y + Math.sin(rotation) * WS.Config.RockProjectileOffset);
        projectile.body.rotation = rotation;

        let arrowSpeed = this.getArrowSpeed(options.power);
        projectile.body.velocity.x = Math.cos(rotation) * arrowSpeed;
        projectile.body.velocity.y = Math.sin(rotation) * arrowSpeed;
        console.log(`velocity ${projectile.body.velocity.x}:${projectile.body.velocity.y}
              arrowSpeed = ${arrowSpeed}`);
        projectile.body.setCollisionGroup(WS.Services.PhysicsManager['Projectile' + this.owner.playerNumber].id);
        projectile.body.collides(WS.Services.PhysicsManager['Projectile' + this.owner.playerNumber].World, this.worldHitHandler, this);
        projectile.body.collides(WS.Services.PhysicsManager['Projectile' + this.owner.playerNumber].OtherPlayers, this.playerHitHandler, this);
        projectile.data.owner = this.owner;
        projectile.tint = this.owner.playerColor.tint;

        // projectile.body.onBeginContact.add(this.contactHandler);
    }

    getArrowSpeed(power) {
      return power * (WS.Config.ArrowMaxSpeed - WS.Config.ArrowMinSpeed) / 100 + WS.Config.ArrowMinSpeed
    }
    // TODO, utiliser un contactHandler plutôt que
    contactHandler(projectileBody, bodyB, shapeA, shapeB, equation) {
      console.log('contactHandler projectile contact !', arguments);
      this.stop(projectileBody);
    }
    worldHitHandler(projectileBody, bodyB, shapeA, shapeB, equation) {
      console.log('worldHitHandler projectile contact !', arguments);
      this.stop(projectileBody);
    }
    stop(projectileBody) {
      projectileBody.setZeroVelocity();
      projectileBody.setZeroForce();
    }
    playerHitHandler(projectileBody, bodyB, shapeA, shapeB, equation) {
        console.log(`Player ${projectileBody.sprite.data.owner.playerNumber} just hit ${bodyB.sprite.data.owner.playerNumber}`);
        bodyB.sprite.data.owner.kill();
    }
}
WeaponBowProjectile.speed = WS.Config.ProjectileSpeed;
