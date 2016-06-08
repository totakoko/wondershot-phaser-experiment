var Wondershot;
(function (Wondershot) {
    var Components;
    (function (Components) {
        var Projectiles = (function () {
            function Projectiles() {
            }
            Projectiles.init = function (game) {
                _game = game;
                projectiles = _game.world.getByName('projectiles');
                projectiles.enableBody = true;
                projectiles.physicsBodyType = Phaser.Physics.ARCADE;
                projectiles.createMultiple(50, 'projectile');
                projectiles.setAll('checkWorldBounds', true);
                projectiles.setAll('outOfBoundsKill', true);
                return this;
            };
            Projectiles.new = function (position, rotation, owner) {
                var projectile = projectiles.getFirstDead();
                projectile.reset(position.x, position.y);
                projectile.anchor.setTo(0.0, 0.5);
                projectile.scale.setTo(0.3);
                projectile.rotation = rotation;
                projectile.body.velocity.x = Math.cos(rotation) * this.speed;
                projectile.body.velocity.y = Math.sin(rotation) * this.speed;
                projectile.owner = owner;
            };
            Projectiles.update = function () {
            };
            Projectiles.render = function () {
                projectiles.forEachAlive(function (member) {
                    _game.debug.body(member);
                }, this);
            };
            Projectiles.speed = Wondershot.Config.ProjectileSpeed;
            return Projectiles;
        }());
        Components.Projectiles = Projectiles;
    })(Components = Wondershot.Components || (Wondershot.Components = {}));
})(Wondershot || (Wondershot = {}));
