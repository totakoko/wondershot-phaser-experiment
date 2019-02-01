const Config = {
  Debug: true,
  ArenaWidth: 600,
  // ArenaHeight: 600,
  ArenaHeight: 300,
  RoundsVictory: 5,
  HighPrecisionMovements: true,
  RockProjectileOffset: 30,
  PlayerColors: {
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
    },
    neutral: {
      tint: 0x8e8e8e,
      hex: '#8e8e8e'
    }
  }
}

export default Config
