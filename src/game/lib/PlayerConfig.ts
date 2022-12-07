export type PlayerType = 'gamepad' | 'keyboard' | 'bot'

export interface PlayerConfig {
  id: number
  type: PlayerType
}
