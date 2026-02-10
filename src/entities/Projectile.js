export default class Projectile extends Phaser.GameObjects.Container {
  constructor(scene, config) {
    super(scene, config.x, config.y);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.weaponData = config.weaponData;
    this.owner = config.owner;
    this.damage = config.damage;
    this.hasHit = false;

    const color = parseInt(config.weaponData.projectile.color) || 0xffff00;
    const size = config.weaponData.projectile.size || 10;
    const glowColor = parseInt(config.weaponData.projectile.glowColor || config.weaponData.projectile.color) || color;

    // Create projectile visual
    this.createProjectileVisual(color, glowColor, size);

    this.body.setVelocity(config.velocityX, config.velocityY);
    this.body.setAllowGravity(false);
    this.body.setCircle(size);

    this.distanceTraveled = 0;
    this.maxRange = config.weaponData.stats.range;

    // Trail effect
    if (config.weaponData.projectile.trail) {
      this.createEnhancedTrail(color, glowColor);
    }

    // Tracking
    this.tracking = config.weaponData.stats.tracking || false;
    this.target = config.target || null;

    // Rotation for missiles
    if (config.weaponData.category === 'missile') {
      this.rotation = Math.atan2(config.velocityY, config.velocityX);
    }
  }

  createProjectileVisual(color, glowColor, size) {
    // Outer glow
    this.glow = this.scene.add.circle(0, 0, size * 1.8, glowColor, 0.3);
    this.add(this.glow);

    // Pulsing glow animation
    this.scene.tweens.add({
      targets: this.glow,
      scale: { from: 1, to: 1.3 },
      alpha: { from: 0.3, to: 0.6 },
      duration: 300,
      yoyo: true,
      repeat: -1
    });

    // Main projectile
    this.core = this.scene.add.circle(0, 0, size, color);
    this.add(this.core);

    // Inner highlight
    this.highlight = this.scene.add.circle(-size * 0.3, -size * 0.3, size * 0.4, 0xffffff, 0.8);
    this.add(this.highlight);

    // For missiles, add fins
    if (this.weaponData.category === 'missile') {
      const fin1 = this.scene.add.triangle(
        -size, 0,
        0, -size * 0.8,
        0, size * 0.8,
        size, 0,
        color
      );
      this.add(fin1);
    }
  }

  createEnhancedTrail(color, glowColor) {
    this.trailTimer = this.scene.time.addEvent({
      delay: 30,
      callback: () => {
        // Outer glow trail
        const trailGlow = this.scene.add.circle(
          this.x, this.y,
          this.core.radius * 2,
          glowColor, 0.4
        );

        this.scene.tweens.add({
          targets: trailGlow,
          scale: 1.5,
          alpha: 0,
          duration: 400,
          onComplete: () => trailGlow.destroy()
        });

        // Core trail
        const trail = this.scene.add.circle(
          this.x, this.y,
          this.core.radius,
          color, 0.6
        );

        this.scene.tweens.add({
          targets: trail,
          scale: 0.5,
          alpha: 0,
          duration: 300,
          onComplete: () => trail.destroy()
        });
      },
      loop: true
    });
  }

  update(delta) {
    if (this.hasHit) return;

    const velocity = new Phaser.Math.Vector2(this.body.velocity.x, this.body.velocity.y);
    this.distanceTraveled += velocity.length() * delta / 1000;

    // Tracking logic
    if (this.tracking && this.target && this.target.active) {
      const angle = Phaser.Math.Angle.Between(
        this.x, this.y,
        this.target.x, this.target.y
      );

      const currentAngle = Math.atan2(this.body.velocity.y, this.body.velocity.x);
      const angleDiff = Phaser.Math.Angle.Wrap(angle - currentAngle);

      const newAngle = currentAngle + angleDiff * 0.05;
      const speed = velocity.length();

      this.body.setVelocity(
        Math.cos(newAngle) * speed,
        Math.sin(newAngle) * speed
      );

      this.rotation = newAngle;
    }

    // Range check
    if (this.distanceTraveled >= this.maxRange) {
      this.explode();
      this.destroy();
    }

    // Out of bounds check
    if (this.x < -50 || this.x > 1330 || this.y < -50 || this.y > 770) {
      this.destroy();
    }
  }

  onHit(target) {
    if (this.hasHit) return;
    this.hasHit = true;

    target.takeDamage(this.damage);

    // Impact flash
    const flash = this.scene.add.circle(this.x, this.y, 20, 0xffffff, 1);
    this.scene.tweens.add({
      targets: flash,
      alpha: 0,
      scale: 2,
      duration: 150,
      onComplete: () => flash.destroy()
    });

    // Explosion if applicable
    if (this.weaponData.stats.explosionRadius) {
      this.explode();
    }

    this.destroy();
  }

  explode() {
    const radius = this.weaponData.stats.explosionRadius || 50;
    const color = parseInt(this.weaponData.projectile.color);

    // Main explosion flash
    const flash = this.scene.add.circle(this.x, this.y, radius, 0xffffff, 1);
    this.scene.tweens.add({
      targets: flash,
      alpha: 0,
      scale: 1.5,
      duration: 200,
      onComplete: () => flash.destroy()
    });

    // Colored explosion ring
    const ring = this.scene.add.circle(this.x, this.y, 10, color, 0);
    ring.setStrokeStyle(6, color, 1);

    this.scene.tweens.add({
      targets: ring,
      radius: radius,
      alpha: 0,
      duration: 400,
      ease: 'Cubic.easeOut',
      onComplete: () => ring.destroy()
    });

    // Explosion particles
    for (let i = 0; i < 20; i++) {
      const angle = (Math.PI * 2 * i) / 20;
      const particle = this.scene.add.circle(
        this.x, this.y, 4, color
      );

      this.scene.tweens.add({
        targets: particle,
        x: this.x + Math.cos(angle) * radius,
        y: this.y + Math.sin(angle) * radius,
        alpha: 0,
        duration: 500,
        ease: 'Cubic.easeOut',
        onComplete: () => particle.destroy()
      });
    }

    // Screen shake disabled for better UX
    // this.scene.cameras.main.shake(250, 0.015);

    return { x: this.x, y: this.y, radius: radius };
  }

  destroy() {
    if (this.trailTimer) {
      this.trailTimer.destroy();
    }
    super.destroy();
  }
}
