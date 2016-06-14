module Wondershot.Components {
  export class PauseMenu {

    static paused = false;

    static init(game) {
      this.game = game;
      return this;
    }

    static preload() {
      this.game.load.script('filterX', 'https://cdn.rawgit.com/photonstorm/phaser/master/filters/BlurX.js');
      this.game.load.script('filterY', 'https://cdn.rawgit.com/photonstorm/phaser/master/filters/BlurY.js');
    }

    static create() {
      this.blurX = this.game.add.filter('BlurX');
      this.blurY = this.game.add.filter('BlurY');
      this.blurX.setResolution(800, 600);
      this.blurY.setResolution(800, 600);

      this.pauseBar = this.game.Groups.Menus.add(new Phaser.Graphics(this.game));
      this.pauseBar.beginFill(0x000000, 0.2);
      this.pauseBar.drawRect(0, this.game.world.height/2-50, this.game.world.width, 100);

      this.pauseText = this.game.Groups.Menus.add(
        new Phaser.Text(this.game, 0, 0, "PAUSE", {
          font: "bold 32px Arial",
          fill: "#fff",
          boundsAlignH: "center",
          boundsAlignV: "middle"
        })
      );
      this.pauseText.setTextBounds(0, this.game.world.height/2-50, this.game.world.width, 100);

      this.paused = false;

      this.update();
    }
  
    static update() {
      if (this.paused) {
        this.game.Groups.Game.filters = [this.blurX, this.blurY];
        this.pauseBar.visible = true;
        this.pauseText.visible = true;
      } else {
        this.game.Groups.Game.filters = null;
        this.pauseBar.visible = false;
        this.pauseText.visible = false;
      }
    }

    // actions
    static togglePause() {
      this.paused = this.game.paused = !this.paused;
      this.game.input.gamepad.pad1._buttons[Phaser.Gamepad.XBOX360_START].isDown = false;
      this.update();
    }
  }
}
