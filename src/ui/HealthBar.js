import { COLORS } from '../config.js';

export default class HealthBar {
  constructor(scene, x, y, width, height, fighter, flipped = false) {
    this.scene = scene;
    this.fighter = fighter;
    this.maxWidth = width - 4;
    this.flipped = flipped;
    
    // Background
    this.bg = scene.add.rectangle(x, y, width, height, 0x222222);
    this.bg.setOrigin(flipped ? 1 : 0, 0);
    this.bg.setStrokeStyle(2, COLORS.PRIMARY);
    
    // Health fill
    this.fill = scene.add.rectangle(
      flipped ? x - 2 : x + 2, 
      y + 2, 
      this.maxWidth, 
      height - 4, 
      COLORS.HEALTH_GREEN
    );
    this.fill.setOrigin(flipped ? 1 : 0, 0);
    
    // Text
    const textX = flipped ? x - width / 2 : x + width / 2;
    this.text = scene.add.text(textX, y + height / 2, '', {
      fontSize: '16px',
      color: '#ffffff',
      fontFamily: 'Courier New',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5);
    
    // Name
    this.nameText = scene.add.text(textX, y - 5, fighter.characterData.name, {
      fontSize: '14px',
      color: COLORS.PRIMARY,
      fontFamily: 'Courier New',
      fontStyle: 'bold'
    }).setOrigin(0.5, 1);
  }

  update() {
    const percent = this.fighter.health.current / this.fighter.health.max;
    const newWidth = this.maxWidth * percent;
    
    // Smooth transition
    this.scene.tweens.add({
      targets: this.fill,
      width: newWidth,
      duration: 200,
      ease: 'Quad.easeOut'
    });
    
    // Color based on health
    if (percent > 0.6) {
      this.fill.setFillStyle(COLORS.HEALTH_GREEN);
    } else if (percent > 0.3) {
      this.fill.setFillStyle(COLORS.HEALTH_YELLOW);
    } else {
      this.fill.setFillStyle(COLORS.HEALTH_RED);
    }
    
    this.text.setText(`${Math.ceil(this.fighter.health.current)}/${this.fighter.health.max}`);
  }

  destroy() {
    this.bg.destroy();
    this.fill.destroy();
    this.text.destroy();
    this.nameText.destroy();
  }
}
