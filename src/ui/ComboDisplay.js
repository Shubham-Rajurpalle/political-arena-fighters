import { COLORS } from '../config.js';

export default class ComboDisplay {
  constructor(scene) {
    this.scene = scene;

    const centerX = scene.scale.width / 2;

    this.comboText = scene.add.text(centerX, 100, '', {
      fontSize: '48px',
      color: '#ffff00',
      fontFamily: 'Impact, Courier New',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 6
    }).setOrigin(0.5).setAlpha(0);

    this.comboText.setDepth(100);
  }

  showCombo(count) {
    const messages = [
      '',
      '',
      '',
      'NICE!',
      'GREAT!',
      'AWESOME!',
      'AMAZING!',
      'INCREDIBLE!',
      'UNSTOPPABLE!',
      'LEGENDARY!',
      'GODLIKE!'
    ];

    const message = messages[Math.min(count, messages.length - 1)] || 'LEGENDARY!';

    this.comboText.setText(`${count}x COMBO!\n${message}`);
    this.comboText.setAlpha(1);

    // Removed scale pulse - combo text stays at normal size
    // Removed all tweens - text stays visible at full opacity
  }

  destroy() {
    this.comboText.destroy();
  }
}
