import { BlurPostFX } from './pipelines/BlurPostFX'
import { CharacterSelectionScene } from './scenes/CharacterSelectionScene'
import { MenuScene } from './scenes/MenuScene'
import { PreloadScene } from './scenes/PreloadScene'
import { RoundScene } from './scenes/RoundScene'

export class Game extends Phaser.Game {
  constructor (options?: Phaser.Types.Core.GameConfig) {
    super(Object.assign({
      type: Phaser.WEBGL,
      scale: {
        mode: Phaser.Scale.CENTER_HORIZONTALLY,
        autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
        parent: 'app'
      },
      backgroundColor: 0xffffff,
      // roundPixels: true,
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
          gravity: false
          // debug: true // uncomment to show bodies and hitboxes
        }
      },
      scene: [
        PreloadScene,
        MenuScene,
        CharacterSelectionScene,
        RoundScene
      ],
      pipeline: { BlurPostFX } as any // type issue
    } as Phaser.Types.Core.GameConfig, options))
  }
}
