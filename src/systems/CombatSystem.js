import { COLORS } from '../config.js';

export default class CombatSystem {
  constructor(scene) {
    this.scene = scene;
  }

  checkCombat(fighter1, fighter2) {
    // Check fighter1 hitting fighter2
    const hits1 = fighter1.hitbox.checkCollision(fighter2.hitbox);
    if (hits1.length > 0) {
      hits1.forEach(hit => {
        if (!fighter2.isBlocking) {
          fighter2.takeDamage(hit.damage, hit.knockback);
          const combo = fighter1.registerComboHit();
          this.onHitLanded(fighter1, fighter2, hit.damage, combo);
        } else {
          fighter2.takeDamage(hit.damage * 0.2);
          this.onHitBlocked(fighter1, fighter2);
        }
      });
    }

    // Check fighter2 hitting fighter1
    const hits2 = fighter2.hitbox.checkCollision(fighter1.hitbox);
    if (hits2.length > 0) {
      hits2.forEach(hit => {
        if (!fighter1.isBlocking) {
          fighter1.takeDamage(hit.damage, hit.knockback);
          const combo = fighter2.registerComboHit();
          this.onHitLanded(fighter2, fighter1, hit.damage, combo);
        } else {
          fighter1.takeDamage(hit.damage * 0.2);
          this.onHitBlocked(fighter2, fighter1);
        }
      });
    }
  }

  checkSpecialCollision(fighter1, fighter2, specialData) {
    const distance = Phaser.Math.Distance.Between(
      fighter1.x, fighter1.y,
      fighter2.x, fighter2.y
    );

    if (distance <= specialData.radius) {
      fighter2.takeDamage(specialData.damage);

      if (specialData.type === 'ground_pound' && specialData.stun) {
        fighter2.stun(specialData.stun);
      }

      this.onHitLanded(fighter1, fighter2, specialData.damage, 0);
      return true;
    }

    return false;
  }

  onHitLanded(attacker, defender, damage, combo) {
    // Screen shake disabled for better UX
    // const intensity = Math.min(damage / 100, 0.02);
    // this.scene.cameras.main.shake(100, intensity);

    // Damage number
    this.showDamageNumber(defender.x, defender.y - 50, damage, combo >= 3);

    // Hit spark
    this.createHitSpark(defender.x, defender.y);

    // Combo display
    if (combo >= 3) {
      this.showComboText(combo);
    }

    // Ultimate meter for attacker
    attacker.ultimate.gainMeter(damage);
  }

  onHitBlocked(attacker, defender) {
    // Block spark
    this.createBlockSpark(defender.x, defender.y);
  }

  showDamageNumber(x, y, damage, isCritical) {
    const color = isCritical ? '#ff0000' : '#ffffff';
    const size = isCritical ? '32px' : '24px';

    const text = this.scene.add.text(x, y, Math.floor(damage), {
      fontSize: size,
      color: color,
      fontFamily: 'Courier New',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5);

    this.scene.tweens.add({
      targets: text,
      y: y - 50,
      alpha: 0,
      duration: 1000,
      ease: 'Cubic.easeOut',
      onComplete: () => text.destroy()
    });
  }

  createHitSpark(x, y) {
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI * 2 * i) / 8;
      const spark = this.scene.add.rectangle(x, y, 4, 4, COLORS.PRIMARY);

      this.scene.tweens.add({
        targets: spark,
        x: x + Math.cos(angle) * 30,
        y: y + Math.sin(angle) * 30,
        alpha: 0,
        duration: 200,
        onComplete: () => spark.destroy()
      });
    }
  }

  createBlockSpark(x, y) {
    for (let i = 0; i < 5; i++) {
      const spark = this.scene.add.rectangle(
        x + (Math.random() - 0.5) * 20,
        y - 20 - Math.random() * 20,
        3, 3, 0x4444ff
      );

      this.scene.tweens.add({
        targets: spark,
        y: y + 20,
        alpha: 0,
        duration: 300,
        onComplete: () => spark.destroy()
      });
    }
  }

  showComboText(combo) {
    if (this.scene.comboDisplay) {
      this.scene.comboDisplay.showCombo(combo);
    }
  }
}
