import Phaser from 'phaser'
import GameScalePlugin from 'phaser-plugin-game-scale'

import PreloadScene from '@/game/scenes/PreloadScene.js'
import MenuScene from '@/game/scenes/MenuScene.js'
import CharacterSelectionScene from '@/game/scenes/CharacterSelectionScene.js'
import RoundScene from '@/game/scenes/RoundScene.js'

export default class Game extends Phaser.Game {
  constructor (options) {
    super(Object.assign({
      type: Phaser.WEBGL,
      // width: config.ArenaWidth,
      // height: config.ArenaHeight,
      backgroundColor: 0xffffff,
      roundPixels: true,
      // pixelArt: true,
      // transparent: false,
      banner: false,
      audio: {
        disableWebAudio: true
      },
      input: {
        gamepad: true
      },
      physics: {
        default: 'matter',
        matter: {
          // enableSleeping: true,
          gravity: {
            x: 0,
            y: 0
          },
          debug: true
        }
      },
      scene: [
        PreloadScene,
        MenuScene,
        CharacterSelectionScene,
        RoundScene
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
  }
}
