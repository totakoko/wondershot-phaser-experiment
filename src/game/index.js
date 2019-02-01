import Phaser from 'phaser'
import GameScalePlugin from 'phaser-plugin-game-scale'

import PreloadScene from '@/game/scenes/PreloadScene.js'
// import CharacterSelection from '@/game/states/CharacterSelection.js'
// import Main from '@/game/states/Main.js'
// import Preload from '@/game/states/Preload.js'
// import Round from '@/game/states/Round.js'
// import Config from '@/game/config.js'

export default class Game extends Phaser.Game {
  constructor (options) {
    super(Object.assign({
      type: Phaser.WEBGL,
      // width: Config.ArenaWidth,
      // height: Config.ArenaHeight,
      backgroundColor: 0xffffff,
      roundPixels: true,
      // transparent: false,
      // enableDebug: true,
      banner: false,
      audio: {
        disableWebAudio: true
      },
      scene: [
        PreloadScene
      ],
      plugins: {
        global: [{
          key: 'GameScalePlugin',
          plugin: GameScalePlugin,
          mapping: 'gameScale',
          data: {
            minHeight: 400
            // maxHeight: 800
          }
        }]
      }
    }, options))
    // this.canvas.style.transformOrigin = '0 center'
    // TODO init des services ?

    // this.state.add('boot', Boot)
    // this.state.add('preload', Preload)
    // this.state.add('main', Main)
    // this.state.add('characterSelection', CharacterSelection)
    // this.state.add('round', Round)

    // this.state.start('boot')
  }

  get centerX () {
    return this.sys.canvas.width / 2
  }

  get centerY () {
    return this.sys.canvas.height / 2
  }
}
