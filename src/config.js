export const GAME_CONFIG = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: 1280,
  height: 720,
  backgroundColor: '#1a1a2e',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 800 },
      debug: false
    }
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  render: {
    pixelArt: false,
    antialias: true
  }
};

export const CONSTANTS = {
  // Movement
  WALK_SPEED: 200,
  RUN_SPEED: 350,
  DASH_SPEED: 600,
  DASH_DURATION: 200,
  DASH_COOLDOWN: 1000,
  JUMP_FORCE: -500,
  DOUBLE_JUMP_FORCE: -400,
  AIR_CONTROL: 0.6,

  // Combat
  LIGHT_DAMAGE: 5,
  HEAVY_DAMAGE: 15,
  LIGHT_KNOCKBACK_X: 50,
  LIGHT_KNOCKBACK_Y: -20,
  HEAVY_KNOCKBACK_X: 100,
  HEAVY_KNOCKBACK_Y: -40,

  // Frame data (at 60fps)
  LIGHT_STARTUP: 50,
  LIGHT_ACTIVE: 83,
  LIGHT_RECOVERY: 133,
  HEAVY_STARTUP: 200,
  HEAVY_ACTIVE: 133,
  HEAVY_RECOVERY: 333,

  // Game - EXTENDED BATTLE TIME
  BATTLE_TIME: 180,  // 3 minutes for longer fights!
  MAX_ROUNDS: 5,     // Best of 5 rounds
  COMBO_TIMEOUT: 2000,

  // Screen
  GROUND_Y: 620,
  LEFT_BOUND: 100,
  RIGHT_BOUND: 1180,

  // Audience
  AUDIENCE_DECAY_RATE: 2,
  AUDIENCE_COMBO_GAIN: 2,
  AUDIENCE_ULTIMATE_GAIN: 20
};

export const COLORS = {
  PRIMARY: 0x00ffff,
  SECONDARY: 0xff00ff,
  PLAYER: 0x0088ff,
  ENEMY: 0xff3366,
  HEALTH_GREEN: 0x00ff00,
  HEALTH_YELLOW: 0xffff00,
  HEALTH_RED: 0xff0000,
  DAMAGE_NUMBER: 0xffffff,
  CRITICAL: 0xff0000,
  COMBO: 0xffff00
};
