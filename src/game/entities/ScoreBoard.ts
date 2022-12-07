import { config } from '../config'

import { Entity } from '@/game/lib/Entity'
import { RoundScene } from '@/game/scenes/RoundScene'

export class ScoreBoard extends Entity<RoundScene> {
  private scoreTitle!: Phaser.GameObjects.BitmapText
  private scoreDetails!: Phaser.GameObjects.BitmapText

  private mainCamera!: Phaser.Cameras.Scene2D.Camera
  private menuCamera!: Phaser.Cameras.Scene2D.Camera

  create () {
    const currentGameObjects = this.scene.children.getAll()

    const scoreTextMessage = [...this.scene.battle.score.entries()]
      .map(([playerId, score]) => `Player ${playerId} : ${score}`)
      .join('\n')
    this.scoreTitle = this.scene.add.bitmapText(config.centerX, config.yp(20), 'desyrel', 'Score', 96).setOrigin()
    this.scoreDetails = this.scene.add.bitmapText(config.centerX, config.centerY, 'desyrel', scoreTextMessage, 64).setOrigin()

    // the main camera should not render the score board items
    this.mainCamera = this.scene.cameras.main
    this.scene.children.getAll()
    this.mainCamera.ignore([this.scoreTitle, this.scoreDetails])
    // add a new camera to render the score board
    this.menuCamera = this.scene.cameras.add()
    this.menuCamera.setName('scoreBoard')
    this.menuCamera.ignore(currentGameObjects)

    this.mainCamera.setPostPipeline('BlurPostFX')
  }

  destroy () {
    this.mainCamera.resetPostPipeline()
    this.scoreTitle.destroy()
    this.scoreDetails.destroy()
  }
}
