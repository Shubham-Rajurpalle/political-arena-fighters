import { COLORS } from '../config.js';

export default class WeaponSelectScene extends Phaser.Scene {
  constructor() {
    super({ key: 'WeaponSelectScene' });
  }

  create() {
    const width = this.scale.width;
    const height = this.scale.height;
    
    this.cameras.main.setBackgroundColor('#0a0a1a');
    
    const weapons = this.cache.json.get('weapons').weapons;
    const selectedCharacter = this.registry.get('selectedCharacter');
    
    // Title
    this.add.text(width / 2, 50, 'SELECT YOUR WEAPON', {
      fontSize: '48px',
      color: COLORS.PRIMARY,
      fontFamily: 'Impact, Courier New',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 6
    }).setOrigin(0.5);
    
    // Selected character display
    this.add.text(width / 2, 120, `Fighter: ${selectedCharacter.name}`, {
      fontSize: '24px',
      color: '#ffffff',
      fontFamily: 'Courier New'
    }).setOrigin(0.5);
    
    // Weapon cards
    const cardWidth = 280;
    const spacing = 40;
    const startX = (width - (weapons.length * cardWidth + (weapons.length - 1) * spacing)) / 2;
    
    weapons.forEach((weapon, index) => {
      const x = startX + index * (cardWidth + spacing) + cardWidth / 2;
      const y = height / 2 + 50;
      
      this.createWeaponCard(x, y, weapon, selectedCharacter);
    });
    
    // Back button
    this.createButton(
      80, height - 40,
      'BACK',
      () => this.scene.start('CharacterSelectScene')
    );
  }

  createWeaponCard(x, y, weapon, character) {
    const card = this.add.container(x, y);
    
    // Background
    const bg = this.add.rectangle(0, 0, 260, 280, 0x000000, 0.8);
    bg.setStrokeStyle(3, COLORS.SECONDARY);
    
    // Weapon visual
    const weaponColor = parseInt(weapon.projectile.color) || COLORS.SECONDARY;
    const weaponRect = this.add.rectangle(0, -60, 80, 40, weaponColor);
    
    // Name
    const name = this.add.text(0, 0, weapon.name, {
      fontSize: '20px',
      color: '#ffffff',
      fontFamily: 'Courier New',
      fontStyle: 'bold',
      align: 'center',
      wordWrap: { width: 240 }
    }).setOrigin(0.5);
    
    // Category badge
    const category = this.add.text(0, 25, weapon.category.toUpperCase(), {
      fontSize: '12px',
      color: COLORS.SECONDARY,
      fontFamily: 'Courier New',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    // Stats
    const stats = `
DMG: ${weapon.stats.damage}
AMMO: ${weapon.stats.ammo}
RANGE: ${weapon.stats.range}
    `;
    
    const statsText = this.add.text(0, 80, stats, {
      fontSize: '14px',
      color: '#aaaaaa',
      fontFamily: 'Courier New',
      align: 'center'
    }).setOrigin(0.5);
    
    card.add([bg, weaponRect, name, category, statsText]);
    card.setSize(260, 280);
    card.setInteractive();
    
    card.on('pointerover', () => {
      bg.setFillStyle(COLORS.SECONDARY, 0.2);
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
          this.registry.set('selectedWeapon', weapon);
          this.startBattle(character, weapon);
        }
      });
    });
    
    return card;
  }

  startBattle(character, weapon) {
    // Select AI counter-strategy
    const characters = this.cache.json.get('characters').characters;
    const weapons = this.cache.json.get('weapons').weapons;
    
    // Simple AI selection (random different character)
    let aiCharacter;
    do {
      aiCharacter = Phaser.Utils.Array.GetRandom(characters);
    } while (aiCharacter.id === character.id);
    
    // Random weapon
    const aiWeapon = Phaser.Utils.Array.GetRandom(weapons);
    
    this.registry.set('aiCharacter', aiCharacter);
    this.registry.set('aiWeapon', aiWeapon);
    
    this.scene.start('BattleScene');
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
