const WeaponSlingshotProjectile = WS.Components.WeaponSlingshotProjectile = class WeaponSlingshotProjectile extends WS.Lib.Entity {
    static preload() {
        WS.game.load.image('weapon-slingshot-projectile', 'assets/images/weapon-slingshot-projectile.png');
    }
    static create() {
        this.projectilesPool = new Phaser.Group(WS.game, WS.game.Groups.Projectiles, 'weapon-slingshot-projectiles');
        this.projectilesPool.createMultiple(10, 'weapon-slingshot-projectile');
        this.projectilesPool.forEach(function (projectile) {
            projectile.scale.setTo(0.3);
            projectile.visible = false;
        });
        WS.game.physics.p2.enable(this.projectilesPool, WS.Config.Debug);
        this.projectilesPool.forEach(function (projectile) {
            projectile.body.setCircle(10);
            projectile.body.fixedRotation = true;
            projectile.body.setMaterial(WS.Services.PhysicsManager.materials.WeaponSlingshot);
        }, this);
    }
    constructor(options) {
        super();
        let position = options.sprite.position;
        let rotation = options.sprite.rotation;
        let owner = options;
        let projectile = this.projectile = WeaponSlingshotProjectile.projectilesPool.getFirstDead();
        projectile.reset(position.x + Math.cos(rotation) * WS.Config.RockProjectileOffset, position.y + Math.sin(rotation) * WS.Config.RockProjectileOffset);
        projectile.body.rotation = options.sprite.rotation;
        projectile.body.velocity.x = Math.cos(rotation) * WeaponSlingshotProjectile.speed;
        projectile.body.velocity.y = Math.sin(rotation) * WeaponSlingshotProjectile.speed;
        projectile.body.setCollisionGroup(WS.Services.PhysicsManager['Projectile' + owner.playerNumber].id);
        projectile.body.collides(WS.Services.PhysicsManager['Projectile' + owner.playerNumber].World, this.worldHitHandler, this);
        projectile.body.collides(WS.Services.PhysicsManager['Projectile' + owner.playerNumber].OtherPlayers, this.playerHitHandler, this);
        projectile.data.owner = owner;
        projectile.data.bounceLeft = 3;
        projectile.tint = owner.playerColor.tint;

        projectile.body.onBeginContact.add(this.contactHandler);
    }
    // TODO, utiliser un contactHandler plutôt que world handler
    contactHandler(projectileBody, bodyB, shapeA, shapeB, equation) {
      console.log('projectile contact !', arguments);
    }
    worldHitHandler(projectileBody, bodyB, shapeA, shapeB, equation) {
        console.log('bounceLeft', projectileBody.sprite.data.bounceLeft);
        if (projectileBody.sprite.data.bounceLeft > 0) {
            projectileBody.sprite.data.bounceLeft--;
            return;
        }
        projectileBody.setZeroVelocity();
        projectileBody.setZeroForce();
    }
    playerHitHandler(projectileBody, bodyB, shapeA, shapeB, equation) {
        console.log(`Player ${projectileBody.sprite.data.owner.playerNumber} just hit ${bodyB.sprite.data.owner.playerNumber}`);
        bodyB.sprite.data.owner.kill();
    }
}
WeaponSlingshotProjectile.speed = WS.Config.ProjectileSpeed;
