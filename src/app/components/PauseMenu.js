const PauseMenu = WS.Components.PauseMenu = class PauseMenu extends WS.Lib.Entity {
    static preload() {
        WS.game.load.script('filterX', 'https://cdn.rawgit.com/photonstorm/phaser/c298a45d1fc0e90618736ade3782ee82a39f7108/v2/filters/BlurX.js');
        WS.game.load.script('filterY', 'https://cdn.rawgit.com/photonstorm/phaser/c298a45d1fc0e90618736ade3782ee82a39f7108/v2/filters/BlurY.js');
    }
    static create() {
        this.blurX = WS.game.add.filter('BlurX');
        this.blurY = WS.game.add.filter('BlurY');
        this.blurX.setResolution(800, 600);
        this.blurY.setResolution(800, 600);
        this.pauseBar = WS.game.Groups.Menus.add(new Phaser.Graphics(WS.game));
        this.pauseBar.beginFill(0x000000, 0.2);
        this.pauseBar.drawRect(0, WS.game.world.height / 2 - 50, WS.game.world.width, 100);
        this.pauseText = WS.game.Groups.Menus.add(new Phaser.Text(WS.game, 0, 0, "PAUSE", {
            font: "bold 32px Arial",
            fill: "#fff",
            boundsAlignH: "center",
            boundsAlignV: "middle"
        }));
        this.pauseText.setTextBounds(0, WS.game.world.height / 2 - 50, WS.game.world.width, 100);
        this.paused = false;
        this.update();
    }
    static update() {
        if (this.paused) {
            WS.game.Groups.Game.filters = [this.blurX, this.blurY];
            this.pauseBar.visible = true;
            this.pauseText.visible = true;
        }
        else {
            WS.game.Groups.Game.filters = null;
            this.pauseBar.visible = false;
            this.pauseText.visible = false;
        }
    }
    // actions
    static togglePause() {
        this.paused = WS.game.paused = !this.paused;
        WS.game.input.gamepad.pad1._buttons[Phaser.Gamepad.XBOX360_START].isDown = false;
        this.update();
    }
}
PauseMenu.paused = false;
