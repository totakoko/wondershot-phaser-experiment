var Wondershot;
(function (Wondershot) {
    var Components;
    (function (Components) {
        var Player = (function () {
            function Player(game, padnumber) {
                this.speed = Wondershot.Config.PlayerSpeed;
                this.game = game;
                this.pad = this.game.input.gamepad['pad' + padnumber];
                this.playernumber = padnumber;
                this.indicator = this.game.world.getByName('info').create(10 + (40 * (padnumber - 1)), 10, 'controller-indicator');
                this.indicator.scale.x = this.indicator.scale.y = 2;
                this.indicator.animations.frame = 1;
                this.player = this.game.world.getByName('players').create(300 * padnumber, 300, 'player');
                game.physics.arcade.enable(this.player);
                this.player.anchor.setTo(0.5, 0.5);
                this.player.scale.setTo(0.2);
                this.player.owner = padnumber;
                this.player.body.collideWorldBounds = true;
                if (!this.pad.connected) {
                    this.game.destroy();
                    throw new Error("Gamepad " + padnumber + " is not connected");
                }
                this.registerGamepadButtons();
            }
            Player.new = function (game, playernumber) {
                return new Player(game, playernumber);
            };
            Player.prototype.registerGamepadButtons = function () {
                this.pad.getButton(Phaser.Gamepad.XBOX360_A).onDown.add(_.throttle(this.shoot, 500, { trailing: false }), this);
            };
            Player.prototype.update = function () {
                this.updatePadIndicator();
                if (Wondershot.Config.HighPrecisionMovements) {
                    this.updatePrecisePlayerPosition();
                }
                else {
                    this.updatePlayerPosition();
                }
            };
            Player.prototype.updatePlayerPosition = function () {
                if (this.pad.connected) {
                    var moveX = this.pad._axes[0];
                    var moveY = this.pad._axes[1];
                    if (moveX || moveY) {
                        this.player.rotation = Math.atan2(moveY, moveX);
                        this.player.x += moveX * this.speed;
                        this.player.y += moveY * this.speed;
                    }
                }
            };
            Player.prototype.updatePrecisePlayerPosition = function () {
                if (this.pad.connected) {
                    var moveX = this.pad._rawPad.axes[0];
                    var moveY = this.pad._rawPad.axes[1];
                    if (moveX || moveY) {
                        this.player.rotation = Math.atan2(moveY, moveX);
                        this.player.x += moveX * this.speed;
                        this.player.y += moveY * this.speed;
                    }
                }
            };
            Player.prototype.updatePadIndicator = function () {
                if (this.game.input.gamepad.supported && this.game.input.gamepad.active && this.pad.connected) {
                    this.indicator.animations.frame = 0;
                }
                else {
                    this.indicator.animations.frame = 1;
                }
            };
            Player.prototype.shoot = function () {
                Wondershot.Components.Projectiles.new(this.player.position, this.player.rotation, this.playernumber);
            };
            Player.prototype.render = function () {
                this.game.debug.body(this.player);
            };
            return Player;
        }());
        Components.Player = Player;
    })(Components = Wondershot.Components || (Wondershot.Components = {}));
})(Wondershot || (Wondershot = {}));
