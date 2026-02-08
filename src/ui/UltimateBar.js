import { COLORS } from '../config.js';

export default class UltimateBar {
  constructor(scene, x, y, width, height, fighter, flipped = false) {
    this.scene = scene;
    this.fighter = fighter;
    this.maxWidth = width - 4;
    this.flipped = flipped;
    
    // Background
    this.bg = scene.add.rectangle(x, y, width, height, 0x222222);
    this.bg.setOrigin(flipped ? 1 : 0, 0);
    this.bg.setStrokeStyle(2, COLORS.SECONDARY);
    
    // Ultimate fill
    this.fill = scene.add.rectangle(
      flipped ? x - 2 : x + 2, 
      y + 2, 
      0, 
      height - 4, 
      COLORS.SECONDARY
    );
    this.fill.setOrigin(flipped ? 1 : 0, 0);
    
    // Glow effect when ready
    this.glow = scene.add.rectangle(
      flipped ? x - 2 : x + 2,
      y + 2,
      this.maxWidth,
      height - 4,
      COLORS.SECONDARY,
      0
    );
    this.glow.setOrigin(flipped ? 1 : 0, 0);
    
    // Text
    const textX = flipped ? x - width / 2 : x + width / 2;
    this.text = scene.add.text(textX, y + height / 2, 'ULTIMATE', {
      fontSize: '12px',
      color: '#ffffff',
      fontFamily: 'Courier New',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5);
  }

  update() {
    const percent = this.fighter.ultimate.getPercent();
    const newWidth = this.maxWidth * percent;
    
    this.scene.tweens.add({
      targets: this.fill,
      width: newWidth,
      duration: 200,
      ease: 'Quad.easeOut'
    });
    
    // Pulse when ready
    if (this.fighter.ultimate.isReady()) {
      if (!this.glowTween || !this.glowTween.isPlaying()) {
        this.glowTween = this.scene.tweens.add({
          targets: this.glow,
          alpha: { from: 0.3, to: 0.7 },
          duration: 500,
          yoyo: true,
          repeat: -1
        });
      }
      this.text.setText('READY!');
      this.text.setColor('#ffff00');
    } else {
      if (this.glowTween) {
        this.glowTween.stop();
      }
      this.glow.setAlpha(0);
      this.text.setText('ULTIMATE');
      this.text.setColor('#ffffff');
    }
  }

  destroy() {
    if (this.glowTween) this.glowTween.stop();
    this.bg.destroy();
    this.fill.destroy();
    this.glow.destroy();
    this.text.destroy();
  }
}
