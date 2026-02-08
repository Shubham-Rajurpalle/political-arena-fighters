import { COLORS } from '../config.js';

export default class MainMenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainMenuScene' });
  }

  create() {
    const width = this.scale.width;
    const height = this.scale.height;
    
    // Indian tricolor gradient background
    const graphics = this.add.graphics();
    graphics.fillGradientStyle(0xFF9933, 0xFF9933, 0x138808, 0x138808, 1, 1, 1, 1);
    graphics.fillRect(0, 0, width, height / 3);
    graphics.fillGradientStyle(0xFFFFFF, 0xFFFFFF, 0xFF9933, 0xFF9933, 1, 1, 1, 1);
    graphics.fillRect(0, height / 3, width, height / 3);
    graphics.fillGradientStyle(0x138808, 0x138808, 0x000080, 0x000080, 1, 1, 1, 1);
    graphics.fillRect(0, height * 2 / 3, width, height / 3);
    
    // Animated background particles (stars)
    this.createParticles();
    
    // Animated grid overlay
    this.createBackgroundGrid();
    
    // Dark overlay for readability
    const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.6);
    
    // Epic title with glow
    const title = this.add.text(width / 2, height / 4 - 20, 'POLITICAL', {
      fontSize: '84px',
      color: '#FF9933',
      fontFamily: 'Impact, Arial Black',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 10
    }).setOrigin(0.5);
    
    const titleLine2 = this.add.text(width / 2, height / 4 + 60, 'ARENA', {
      fontSize: '96px',
      color: '#FFFFFF',
      fontFamily: 'Impact, Arial Black',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 12
    }).setOrigin(0.5);
    
    const titleLine3 = this.add.text(width / 2, height / 4 + 150, 'FIGHTERS', {
      fontSize: '84px',
      color: '#138808',
      fontFamily: 'Impact, Arial Black',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 10
    }).setOrigin(0.5);
    
    // Title glow effect
    [title, titleLine2, titleLine3].forEach((text, index) => {
      this.tweens.add({
        targets: text,
        scale: { from: 1, to: 1.05 },
        duration: 1000 + index * 200,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    });
    
    // Epic subtitle with Indian flag colors
    const subtitle = this.add.text(width / 2, height / 4 + 210, 'THE ULTIMATE POLITICAL SHOWDOWN', {
      fontSize: '22px',
      color: '#FFD700',
      fontFamily: 'Impact, Arial',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5);
    
    // Glowing "PRESS START" style button
    const playButton = this.createGlowingButton(
      width / 2, 
      height / 2 + 80, 
      'START BATTLE',
      () => this.scene.start('CharacterSelectScene')
    );
    
    // Controls button
    const instructionsButton = this.createButton(
      width / 2,
      height / 2 + 170,
      'CONTROLS & GUIDE',
      () => this.showInstructions()
    );
    
    // Credits
    this.add.text(width / 2, height - 50, '🇮🇳 MADE IN INDIA 🇮🇳', {
      fontSize: '18px',
      color: '#FFD700',
      fontFamily: 'Impact',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    // Version info
    this.add.text(width - 10, height - 10, 'v2.0 - EPIC EDITION', {
      fontSize: '12px',
      color: '#888888',
      fontFamily: 'Courier New'
    }).setOrigin(1);
    
    // Instructions display
    this.instructionsPanel = null;
  }

  createParticles() {
    // Create floating particles
    for (let i = 0; i < 30; i++) {
      const x = Math.random() * this.scale.width;
      const y = Math.random() * this.scale.height;
      const size = 2 + Math.random() * 3;
      
      const particle = this.add.circle(x, y, size, 0xFFFFFF, 0.6);
      
      this.tweens.add({
        targets: particle,
        y: y - 100,
        alpha: { from: 0.6, to: 0 },
        duration: 3000 + Math.random() * 2000,
        repeat: -1,
        delay: Math.random() * 2000
      });
    }
  }

  createBackgroundGrid() {
    const graphics = this.add.graphics();
    graphics.lineStyle(1, 0xFFFFFF, 0.05);
    
    for (let x = 0; x < this.scale.width; x += 40) {
      graphics.lineBetween(x, 0, x, this.scale.height);
    }
    
    for (let y = 0; y < this.scale.height; y += 40) {
      graphics.lineBetween(0, y, this.scale.width, y);
    }
    
    // Animate grid
    this.tweens.add({
      targets: graphics,
      alpha: { from: 0.3, to: 0.6 },
      duration: 2000,
      yoyo: true,
      repeat: -1
    });
  }

  createGlowingButton(x, y, text, callback) {
    const button = this.add.container(x, y);
    
    // Glow layer
    const glow = this.add.rectangle(0, 0, 340, 70, 0xFF9933, 0.3);
    glow.setStrokeStyle(0, 0xFF9933);
    
    // Main button
    const bg = this.add.rectangle(0, 0, 320, 60, 0x000000, 0.9);
    bg.setStrokeStyle(4, 0xFF9933);
    
    const label = this.add.text(0, 0, text, {
      fontSize: '32px',
      color: '#FF9933',
      fontFamily: 'Impact, Arial Black',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5);
    
    button.add([glow, bg, label]);
    button.setSize(320, 60);
    button.setInteractive();
    
    // Pulsing glow
    this.tweens.add({
      targets: glow,
      scale: { from: 1, to: 1.1 },
      alpha: { from: 0.3, to: 0.6 },
      duration: 800,
      yoyo: true,
      repeat: -1
    });
    
    button.on('pointerover', () => {
      bg.setFillStyle(0xFF9933, 0.3);
      label.setColor('#ffffff');
      this.tweens.add({
        targets: button,
        scale: 1.1,
        duration: 150
      });
    });
    
    button.on('pointerout', () => {
      bg.setFillStyle(0x000000, 0.9);
      label.setColor('#FF9933');
      this.tweens.add({
        targets: button,
        scale: 1,
        duration: 150
      });
    });
    
    button.on('pointerdown', () => {
      this.tweens.add({
        targets: button,
        scale: 0.95,
        duration: 100,
        yoyo: true,
        onComplete: callback
      });
    });
    
    return button;
  }

  createButton(x, y, text, callback) {
    const button = this.add.container(x, y);
    
    const bg = this.add.rectangle(0, 0, 280, 50, 0x000000, 0.8);
    bg.setStrokeStyle(3, 0x138808);
    
    const label = this.add.text(0, 0, text, {
      fontSize: '20px',
      color: '#138808',
      fontFamily: 'Impact, Arial',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    button.add([bg, label]);
    button.setSize(280, 50);
    button.setInteractive();
    
    button.on('pointerover', () => {
      bg.setFillStyle(0x138808, 0.3);
      label.setColor('#ffffff');
      this.tweens.add({ targets: button, scale: 1.05, duration: 100 });
    });
    
    button.on('pointerout', () => {
      bg.setFillStyle(0x000000, 0.8);
      label.setColor('#138808');
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

  showInstructions() {
    if (this.instructionsPanel) {
      this.instructionsPanel.destroy();
      this.instructionsPanel = null;
      return;
    }
    
    const width = this.scale.width;
    const height = this.scale.height;
    
    this.instructionsPanel = this.add.container(width / 2, height / 2);
    
    const bg = this.add.rectangle(0, 0, 600, 400, 0x000000, 0.95);
    bg.setStrokeStyle(3, COLORS.PRIMARY);
    
    const title = this.add.text(0, -170, 'CONTROLS', {
      fontSize: '32px',
      color: COLORS.PRIMARY,
      fontFamily: 'Courier New',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    const controls = `
MOVEMENT:
Arrow Keys - Move Left/Right
Up Arrow - Jump (press twice for double jump)
Shift - Dash

COMBAT:
Z - Light Attack
X - Heavy Attack
C - Ranged Weapon
A - Block

SPECIAL MOVES:
S - Special Ability
D - Ultimate (when charged)

Press ESC to pause
    `;
    
    const controlsText = this.add.text(0, 20, controls, {
      fontSize: '16px',
      color: '#ffffff',
      fontFamily: 'Courier New',
      align: 'left'
    }).setOrigin(0.5);
    
    const closeButton = this.add.text(0, 170, '[CLICK TO CLOSE]', {
      fontSize: '18px',
      color: COLORS.SECONDARY,
      fontFamily: 'Courier New',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    this.instructionsPanel.add([bg, title, controlsText, closeButton]);
    this.instructionsPanel.setDepth(1000);
    
    bg.setInteractive();
    bg.on('pointerdown', () => {
      this.instructionsPanel.destroy();
      this.instructionsPanel = null;
    });
  }
}
