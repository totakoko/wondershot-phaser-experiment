const WeaponSlingshotProjectile = WS.Components.WeaponSlingshotProjectile = class WeaponSlingshotProjectile extends WS.Lib.Entity {
    static preload() {
        WS.game.load.image('weapon-slingshot-projectile', 'assets/images/weapon-slingshot-projectile.png');
    }
    static create() {
        // this.projectilesPool = new Phaser.Group(WS.game, WS.game.Groups.Projectiles, 'weapon-slingshot-projectiles');
        // this.projectilesPool.createMultiple(2000, 'weapon-slingshot-projectile');
        // this.projectilesPool.forEach(function (projectile) {
        //     projectile.scale.setTo(0.3);
        //     projectile.visible = false;
        // });
        // WS.game.physics.p2.enable(this.projectilesPool, WS.Config.Debug);
        // this.projectilesPool.forEach(function (projectile) {
        //     projectile.body.setCircle(10);
        //     projectile.body.fixedRotation = true;
        //     projectile.body.setMaterial(WS.Services.PhysicsManager.materials.WeaponSlingshot);
        // }, this);
    }
    constructor(options) {
        super();
        this.weapon = options.weapon;
        this.owner = options.owner;
        let position = this.owner.sprite.position;
        let rotation = this.owner.sprite.rotation;

        let projectile = this.projectile = WS.game.Groups.Projectiles.create(
          position.x + Math.cos(rotation) * WS.Config.RockProjectileOffset,
          position.y + Math.sin(rotation) * WS.Config.RockProjectileOffset,
          'weapon-slingshot-projectile'
        );

        projectile.scale.setTo(0.3);
        projectile.visible = true;
        WS.game.physics.p2.enable(this.projectilesPool, WS.Config.Debug);
        projectile.body.setCircle(10);
        // projectile.body.fixedRotation = true;
        projectile.body.setMaterial(WS.Services.PhysicsManager.materials.WeaponSlingshot);

        // let projectile = this.projectile = WeaponSlingshotProjectile.projectilesPool.getFirstDead();
        // projectile.reset(position.x + Math.cos(rotation) * WS.Config.RockProjectileOffset, position.y + Math.sin(rotation) * WS.Config.RockProjectileOffset);
        projectile.body.rotation = this.owner;

        projectile.body.velocity.x = Math.cos(rotation) * WeaponSlingshotProjectile.speed;
        projectile.body.velocity.y = Math.sin(rotation) * WeaponSlingshotProjectile.speed;
        projectile.body.setCollisionGroup(WS.Services.PhysicsManager['Projectile' + this.owner.playerNumber].id);
        projectile.body.collides(WS.Services.PhysicsManager['Projectile' + this.owner.playerNumber].World, this.worldHitHandler, this);
        projectile.body.collides(WS.Services.PhysicsManager['Projectile' + this.owner.playerNumber].OtherPlayers, this.playerHitHandler, this);
        projectile.data.class = this;
        projectile.data.bounceLeft = 3;
        projectile.tint = this.owner.playerColor.tint;

        projectile.body.onBeginContact.add(this.contactHandler);
    }
    // TODO, utiliser un contactHandler plutôt que
    contactHandler(projectileBody, bodyB, shapeA, shapeB, equation) {
      console.log('projectile contact !', arguments);
    }
    worldHitHandler(projectileBody, bodyB, shapeA, shapeB, equation) {
        const projectile = projectileBody.sprite.data.projectile;
        console.log('bounceLeft', projectileBody.sprite.data.bounceLeft);
        if (projectileBody.sprite.data.bounceLeft > 0) {
            projectileBody.sprite.data.bounceLeft--;
            return;
        }
        projectileBody.setZeroVelocity();
        projectileBody.setZeroForce();

        // on remet le projectile dans un groupe neutre
        projectile.body.setCollisionGroup(WS.Services.PhysicsManager['Projectile' + this.owner.playerNumber].id);
        projectile.body.collides(WS.Services.PhysicsManager['Projectile' + this.owner.playerNumber].World, this.worldHitHandler, this);
        projectile.body.collides(WS.Services.PhysicsManager['Projectile' + this.owner.playerNumber].OtherPlayers, this.playerHitHandler, this);

        projectile.tint = Config.PlayerColors.neutral.tint;

    }
    playerHitHandler(projectileBody, bodyB, shapeA, shapeB, equation) {
        console.log(`Player ${projectileBody.sprite.data.owner.playerNumber} just hit ${bodyB.sprite.data.owner.playerNumber}`);
        bodyB.sprite.data.owner.kill();
        projectileBody.sprite.data.class.weapon.reload();
        projectileBody.kill();

    }
}
WeaponSlingshotProjectile.speed = WS.Config.ProjectileSpeed;
