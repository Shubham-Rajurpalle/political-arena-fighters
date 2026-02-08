import { COLORS } from '../config.js';

export default class CharacterSelectScene extends Phaser.Scene {
  constructor() {
    super({ key: 'CharacterSelectScene' });
  }

  create() {
    const width = this.scale.width;
    const height = this.scale.height;
    
    this.cameras.main.setBackgroundColor('#0a0a1a');
    
    const characters = this.cache.json.get('characters').characters;
    
    // Title
    this.add.text(width / 2, 50, 'SELECT YOUR FIGHTER', {
      fontSize: '48px',
      color: COLORS.PRIMARY,
      fontFamily: 'Impact, Courier New',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 6
    }).setOrigin(0.5);
    
    // Character cards
    const cardWidth = 250;
    const spacing = 50;
    const startX = (width - (characters.length * cardWidth + (characters.length - 1) * spacing)) / 2;
    
    characters.forEach((char, index) => {
      const x = startX + index * (cardWidth + spacing) + cardWidth / 2;
      const y = height / 2;
      
      this.createCharacterCard(x, y, char);
    });
    
    // Back button
    const backButton = this.createButton(
      80, height - 40,
      'BACK',
      () => this.scene.start('MainMenuScene')
    );
  }

  createCharacterCard(x, y, character) {
    const card = this.add.container(x, y);
    
    // Background
    const bg = this.add.rectangle(0, 0, 220, 300, 0x000000, 0.8);
    bg.setStrokeStyle(3, COLORS.PRIMARY);
    
    // Character visual
    const colors = {
      balanced: COLORS.PRIMARY,
      speed: 0x00ff00,
      tank: 0xff0000
    };
    
    const charRect = this.add.rectangle(0, -60, 100, 120, colors[character.archetype] || COLORS.PRIMARY);
    
    // Name
    const name = this.add.text(0, 30, character.name, {
      fontSize: '20px',
      color: '#ffffff',
      fontFamily: 'Courier New',
      fontStyle: 'bold',
      align: 'center',
      wordWrap: { width: 200 }
    }).setOrigin(0.5);
    
    // Stats
    const stats = `
HP: ${character.stats.health}
SPD: ${character.stats.speed}
ATK: ${character.stats.attack}
DEF: ${character.stats.defense}
    `;
    
    const statsText = this.add.text(0, 90, stats, {
      fontSize: '14px',
      color: '#aaaaaa',
      fontFamily: 'Courier New',
      align: 'center'
    }).setOrigin(0.5);
    
    card.add([bg, charRect, name, statsText]);
    card.setSize(220, 300);
    card.setInteractive();
    
    card.on('pointerover', () => {
      bg.setFillStyle(COLORS.PRIMARY, 0.2);
      this.tweens.add({
        targets: card,
        scale: 1.05,
        duration: 200
      });
    });
    
    card.on('pointerout', () => {
      bg.setFillStyle(0x000000, 0.8);
      this.tweens.add({
        targets: card,
        scale: 1,
        duration: 200
      });
    });
    
    card.on('pointerdown', () => {
      this.tweens.add({
        targets: card,
        scale: 0.95,
        duration: 100,
        yoyo: true,
        onComplete: () => {
          this.registry.set('selectedCharacter', character);
          this.scene.start('WeaponSelectScene');
        }
      });
    });
    
    return card;
  }

  createButton(x, y, text, callback) {
    const button = this.add.container(x, y);
    
    const bg = this.add.rectangle(0, 0, 120, 40, 0x000000, 0.8);
    bg.setStrokeStyle(2, COLORS.SECONDARY);
    
    const label = this.add.text(0, 0, text, {
      fontSize: '18px',
      color: COLORS.SECONDARY,
      fontFamily: 'Courier New',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    button.add([bg, label]);
    button.setSize(120, 40);
    button.setInteractive();
    
    button.on('pointerover', () => {
      bg.setFillStyle(COLORS.SECONDARY, 0.3);
      this.tweens.add({ targets: button, scale: 1.05, duration: 100 });
    });
    
    button.on('pointerout', () => {
      bg.setFillStyle(0x000000, 0.8);
      this.tweens.add({ targets: button, scale: 1, duration: 100 });
    });
    
    button.on('pointerdown', () => {
      this.tweens.add({
        targets: button,
        scale: 0.95,
        duration: 50,
        yoyo: true,
        onComplete: callback
      });
    });
    
    return button;
  }
}
