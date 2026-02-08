import { COLORS } from '../config.js';

export default class ResultScene extends Phaser.Scene {
  constructor() {
    super({ key: 'ResultScene' });
  }

  init(data) {
    this.result = data.result || 'timeout';
  }

  create() {
    const width = this.scale.width;
    const height = this.scale.height;
    
    this.cameras.main.setBackgroundColor('#0a0a1a');
    
    // Determine winner
    let title, subtitle, color;
    
    if (this.result === 'player_wins') {
      title = 'VICTORY!';
      subtitle = 'YOU WIN!';
      color = COLORS.PRIMARY;
      this.createFireworks();
    } else if (this.result === 'enemy_wins') {
      title = 'DEFEAT';
      subtitle = 'YOU LOSE';
      color = COLORS.ENEMY;
    } else {
      title = 'TIME OUT';
      subtitle = 'DRAW';
      color = COLORS.HEALTH_YELLOW;
    }
    
    // Title
    const titleText = this.add.text(width / 2, height / 3, title, {
      fontSize: '96px',
      color: color,
      fontFamily: 'Impact, Courier New',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 10
    }).setOrigin(0.5);
    
    // Pulse animation
    this.tweens.add({
      targets: titleText,
      scale: { from: 0, to: 1 },
      duration: 500,
      ease: 'Back.easeOut'
    });
    
    this.tweens.add({
      targets: titleText,
      scale: { from: 1, to: 1.1 },
      duration: 1000,
      delay: 500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
    
    // Subtitle
    this.add.text(width / 2, height / 3 + 100, subtitle, {
      fontSize: '36px',
      color: '#ffffff',
      fontFamily: 'Courier New',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    // Buttons
    this.createButton(
      width / 2 - 130,
      height / 2 + 100,
      'REMATCH',
      () => this.scene.start('BattleScene')
    );
    
    this.createButton(
      width / 2 + 130,
      height / 2 + 100,
      'MAIN MENU',
      () => this.scene.start('MainMenuScene')
    );
    
    // Stats (if available)
    const stats = this.registry.get('battleStats') || {};
    if (stats.comboMax) {
      const statsText = `
Max Combo: ${stats.comboMax || 0}
Total Damage: ${stats.totalDamage || 0}
Accuracy: ${stats.accuracy || 0}%
      `;
      
      this.add.text(width / 2, height - 100, statsText, {
        fontSize: '18px',
        color: '#aaaaaa',
        fontFamily: 'Courier New',
        align: 'center'
      }).setOrigin(0.5);
    }
  }

  createFireworks() {
    for (let i = 0; i < 5; i++) {
      this.time.delayedCall(i * 300, () => {
        const x = Phaser.Math.Between(200, this.scale.width - 200);
        const y = Phaser.Math.Between(100, this.scale.height / 2);
        
        const colors = [COLORS.PRIMARY, COLORS.SECONDARY, COLORS.HEALTH_GREEN];
        const color = Phaser.Utils.Array.GetRandom(colors);
        
        for (let j = 0; j < 20; j++) {
          const angle = (Math.PI * 2 * j) / 20;
          const particle = this.add.rectangle(x, y, 4, 4, color);
          
          this.tweens.add({
            targets: particle,
            x: x + Math.cos(angle) * 100,
            y: y + Math.sin(angle) * 100,
            alpha: 0,
            duration: 1000,
            ease: 'Cubic.easeOut',
            onComplete: () => particle.destroy()
          });
        }
      });
    }
  }

  createButton(x, y, text, callback) {
    const button = this.add.container(x, y);
    
    const bg = this.add.rectangle(0, 0, 220, 60, 0x000000, 0.8);
    bg.setStrokeStyle(3, COLORS.PRIMARY);
    
    const label = this.add.text(0, 0, text, {
      fontSize: '24px',
      color: COLORS.PRIMARY,
      fontFamily: 'Courier New',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    
    button.add([bg, label]);
    button.setSize(220, 60);
    button.setInteractive();
    
    button.on('pointerover', () => {
      bg.setFillStyle(COLORS.PRIMARY, 0.3);
      label.setColor('#ffffff');
      this.tweens.add({
        targets: button,
        scale: 1.05,
        duration: 100
      });
    });
    
    button.on('pointerout', () => {
      bg.setFillStyle(0x000000, 0.8);
      label.setColor('#00ffff');
      this.tweens.add({
        targets: button,
        scale: 1,
        duration: 100
      });
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
