var Wondershot;
(function (Wondershot) {
    var Components;
    (function (Components) {
        var PauseMenu = (function () {
            function PauseMenu() {
            }
            PauseMenu.preload = function (game) {
                this.game = game;
                this.game.load.script('filterX', 'https://cdn.rawgit.com/photonstorm/phaser/master/filters/BlurX.js');
                this.game.load.script('filterY', 'https://cdn.rawgit.com/photonstorm/phaser/master/filters/BlurY.js');
            };
            PauseMenu.init = function (game) {
                this.game = game;
                this.blurX = this.game.add.filter('BlurX');
                this.blurY = this.game.add.filter('BlurY');
                this.pauseBar = this.game.world.getByName('info').add(new Phaser.Graphics(this.game));
                this.pauseBar.visibility = false;
                this.pauseBar.beginFill(0x000000, 0.2);
                this.pauseBar.drawRect(0, this.game.world.height / 2 - 50, this.game.world.width, 100);
                this.pauseText = this.game.world.getByName('info').add(new Phaser.Text(this.game, 0, 0, "PAUSE", {
                    font: "bold 32px Arial",
                    fill: "#fff",
                    boundsAlignH: "center",
                    boundsAlignV: "middle"
                }));
                this.pauseText.visibility = false;
                this.pauseText.setTextBounds(0, this.game.world.height / 2 - 50, this.game.world.width, 100);
                return this;
            };
            PauseMenu.togglePause = function () {
                if (this.game.world.filters) {
                    this.game.world.filters = null;
                    this.pauseBar.visibility = false;
                    this.pauseText.visibility = false;
                }
                else {
                    this.game.world.filters = [this.blurX, this.blurY];
                    this.pauseBar.visibility = true;
                    this.pauseText.visibility = true;
                }
            };
            return PauseMenu;
        }());
        Components.PauseMenu = PauseMenu;
    })(Components = Wondershot.Components || (Wondershot.Components = {}));
})(Wondershot || (Wondershot = {}));
