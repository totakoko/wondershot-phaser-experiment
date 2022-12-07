import { config } from '@/game/config'

export class MenuScene extends Phaser.Scene {
  constructor () {
    super({
      key: 'MenuScene'
    })
  }

  create () {
    this.add.text(config.centerX, 150, 'Main Menu', { font: '42px Arial', color: '#000' }).setOrigin()

    const battleButton = this.add.text(config.centerX, 250, 'Battle', { font: '24px Arial', color: '#000' })
      .setOrigin()
      .setPadding(20)
      .setBackgroundColor('#dddddd')
      .setInteractive()
      .on('pointerover', () => {
        battleButton.setBackgroundColor('#777777')
        this.input.setDefaultCursor('pointer')
      })
      .on('pointerout', () => {
        battleButton.setBackgroundColor('#dddddd')
        this.input.setDefaultCursor('default')
      })
      .on('pointerdown', () => {
        this.scene.start('CharacterSelectionScene')
      })
  }
}
