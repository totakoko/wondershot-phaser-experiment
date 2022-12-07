import 'phaser'
import log from 'loglevel'

import { Game } from '@/game/Game'

import './style.css'

log.setDefaultLevel('info')
log.setLevel('info')

// log.setLevel('info')
// log.setLevel('debug')
// log.getLogger('Player').setLevel('debug')
log.getLogger('Battle').setLevel('debug')
// log.getLogger('Arena').setLevel('warn')

window.addEventListener('load', () => {
  (window as any).game = new Game()
})
