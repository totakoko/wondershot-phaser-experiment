import { PlayerColor } from './entities/Player'

const playerColors: { [key: number]: PlayerColor } = {
  1: {
    name: 'Blue',
    tint: 0x3c569a,
    hex: '#3c569a'
  },
  2: {
    name: 'Red',
    tint: 0xed4a52,
    hex: '#ed4a52'
  },
  3: {
    name: 'Green',
    tint: 0x3aff08,
    hex: '#3aff08'
  },
  4: {
    name: 'Yellow',
    tint: 0xffff96,
    hex: '#ffff96'
  }
}
const defaultPlayerColor: PlayerColor = {
  name: 'Default',
  tint: 0x8e8e8e,
  hex: '#8e8e8e'
}

export function getPlayerColors (playerId: number): PlayerColor {
  return playerColors[playerId] ?? defaultPlayerColor
}

export const config = {
  Debug: true,
  ArenaWidth: 1024,
  ArenaHeight: 768,
  ArenaBordersWidth: 30,
  PlayerSpeed: 4,
  JumpSpeed: 1,
  JumpDuration: 200,
  RoundsVictory: 5,
  HighPrecisionMovements: true,
  RockProjectileOffset: 30,

  get centerX () {
    return this.ArenaWidth / 2
  },

  get centerY () {
    return this.ArenaHeight / 2
  },

  xp (percentage: number): number {
    return percentage * this.ArenaWidth / 100
  },

  yp (percentage: number): number {
    return percentage * this.ArenaHeight / 100
  }
}

export const depths = {
  Arena: 10,
  Objects: 20,
  Players: 30,
  PlayerItems: 40,
  Projectiles: 50,
  UI: 60
}
