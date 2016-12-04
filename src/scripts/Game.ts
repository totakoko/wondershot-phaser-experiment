/// <reference path="definitions/phaser.comments.d.ts"/>

module Wondershot {
  export class Game extends Phaser.Game {
    constructor() {
      super({
        width: 400,
        height: 700,
        transparent: false,
        enableDebug: true
      });

      // arena is 800x600

      this.state.add('boot', State.Boot);
      this.state.add('preload', State.Preload);
      this.state.add('main', State.Main);
      this.state.add('battle', State.Battle);

      this.state.start('boot');
    }
  }
}
