const WeaponSlingshotProjectile = Wondershot.Components.WeaponSlingshotProjectile = class WeaponSlingshotProjectile {
    constructor(options) {
        let position = options.sprite.position;
        let rotation = options.sprite.rotation;
        let owner = options;
        let projectile = this.projectile = WeaponSlingshotProjectile.projectilesPool.getFirstDead();
        projectile.reset(position.x + Math.cos(rotation) * Wondershot.Config.RockProjectileOffset, position.y + Math.sin(rotation) * Wondershot.Config.RockProjectileOffset);
        projectile.body.rotation = options.sprite.rotation;
        projectile.body.velocity.x = Math.cos(rotation) * WeaponSlingshotProjectile.speed;
        projectile.body.velocity.y = Math.sin(rotation) * WeaponSlingshotProjectile.speed;
        projectile.body.setCollisionGroup(Components.CollisionManager['Projectile' + owner.playerNumber].id);
        projectile.body.collides(Components.CollisionManager['Projectile' + owner.playerNumber].World, this.worldHitHandler, this);
        projectile.body.collides(Components.CollisionManager['Projectile' + owner.playerNumber].OtherPlayers, this.playerHitHandler, this);
        projectile.data.owner = owner;
        projectile.data.bounceLeft = 3;
        projectile.tint = owner.playerColor;
    }
    static preload() {
        this.game.load.image('weapon-slingshot-projectile', 'assets/images/weapon-slingshot-projectile.png');
    }
    static create() {
        this.projectilesPool = new Phaser.Group(this.game, this.game.Groups.Projectiles, 'weapon-slingshot-projectiles');
        this.projectilesPool.createMultiple(10, 'weapon-slingshot-projectile');
        this.projectilesPool.forEach(function (projectile) {
            projectile.scale.setTo(0.3);
            projectile.visible = false;
        });
        this.game.physics.p2.enable(this.projectilesPool, Wondershot.Config.Debug);
        this.projectilesPool.forEach(function (projectile) {
            projectile.body.setCircle(10);
            projectile.body.fixedRotation = true;
            projectile.body.setMaterial(Components.CollisionManager.materials.WeaponSlingshot);
        }, this);
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
        Wondershot.Components.PlayerManager.killPlayer(bodyB.sprite.data.owner);
    }
}
WeaponSlingshotProjectile.speed = Wondershot.Config.ProjectileSpeed;
