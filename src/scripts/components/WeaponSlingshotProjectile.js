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
            projectile.body.setMaterial(WS.Services.CollisionManager.materials.WeaponSlingshot);
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
        projectile.body.setCollisionGroup(WS.Services.CollisionManager['Projectile' + owner.playerNumber].id);
        projectile.body.collides(WS.Services.CollisionManager['Projectile' + owner.playerNumber].World, this.worldHitHandler, this);
        projectile.body.collides(WS.Services.CollisionManager['Projectile' + owner.playerNumber].OtherPlayers, this.playerHitHandler, this);
        projectile.data.owner = owner;
        projectile.data.bounceLeft = 3;
        projectile.tint = owner.playerColor;
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
        console.log('rock projectile just hit %s%s', bodyB.sprite.key, bodyB.sprite.data.owner);
        // console.log('playerHitHandler', body.sprite.key);
        WS.Components.PlayerManager.killPlayer(bodyB.sprite.data.owner);
    }
}
WeaponSlingshotProjectile.speed = WS.Config.ProjectileSpeed;
