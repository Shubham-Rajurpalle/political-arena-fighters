import Phaser from 'phaser';
import { GAME_CONFIG } from './config.js';
import BootScene from './scenes/BootScene.js';
import MainMenuScene from './scenes/MainMenuScene.js';
import CharacterSelectScene from './scenes/CharacterSelectScene.js';
import WeaponSelectScene from './scenes/WeaponSelectScene.js';
import BattleScene from './scenes/BattleScene.js';
import ResultScene from './scenes/ResultScene.js';

class PoliticalArenaFighters extends Phaser.Game {
  constructor() {
    const config = {
      ...GAME_CONFIG,
      scene: [
        BootScene,
        MainMenuScene,
        CharacterSelectScene,
        WeaponSelectScene,
        BattleScene,
        ResultScene
      ]
    };
    
    super(config);
  }
}

// Wait for DOM to load
window.addEventListener('load', () => {
  new PoliticalArenaFighters();
});
