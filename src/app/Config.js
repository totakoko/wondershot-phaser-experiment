import WS from './WS';

export const Config = WS.Config = {};
Config.Debug = true;
Config.PlayerSpeed = 2;

Config.ProjectileSpeed = 300;
Config.ArrowMinSpeed = 300;
Config.ArrowMaxSpeed = 600;

Config.ArenaWidth = 600;
Config.ArenaHeight = 600;
Config.RoundsVictory = 5;
Config.HighPrecisionMovements = true;
Config.RockProjectileOffset = 30;
Config.PlayerColors = {
    1: {
      name: 'Blue',
      tint: 0x3c569a,
      hex: '#3c569a',
    },
    2: {
      name: 'Red',
      tint: 0xed4a52,
      hex: '#ed4a52',
    },
    3: {
      name: 'Green',
      tint: 0x3aff08,
      hex: '#3aff08',
    },
    4: {
      name: 'Yellow',
      tint: 0xffff96,
      hex: '#ffff96',
    },
    neutral: {
      tint: 0x8e8e8e,
      hex: '#8e8e8e',
    },
};
