import Fighter from './Fighter.js';
import { CONSTANTS, COLORS } from '../config.js';

export default class PlayerController extends Fighter {
  constructor(scene, x, y, characterData, weaponData) {
    super(scene, x, y, characterData, COLORS.PLAYER);

    // Make player character visually larger than default
    const PLAYER_SCALE = 0.2;
    if (this.sprite && this.sprite.setScale) {
      this.sprite.setScale(PLAYER_SCALE);
    }

    // Adjust physics body to match larger visual size
    if (this.body && this.body.setSize) {
      const baseBodyW = 200;
      const baseBodyH = 360;
      const baseOffsetX = -50;
      const baseOffsetY = -90;
      this.body.setSize(baseBodyW * PLAYER_SCALE, baseBodyH * PLAYER_SCALE);
      this.body.setOffset(baseOffsetX * PLAYER_SCALE, baseOffsetY * PLAYER_SCALE);
    }

    this.weaponData = weaponData;

    // Input setup
    this.cursors = scene.input.keyboard.createCursorKeys();
    this.keys = scene.input.keyboard.addKeys({
      dash: Phaser.Input.Keyboard.KeyCodes.SHIFT,
      lightAttack: Phaser.Input.Keyboard.KeyCodes.Z,
      heavyAttack: Phaser.Input.Keyboard.KeyCodes.X,
      rangedAttack: Phaser.Input.Keyboard.KeyCodes.C,
      block: Phaser.Input.Keyboard.KeyCodes.A,
      special: Phaser.Input.Keyboard.KeyCodes.S,
      ultimate: Phaser.Input.Keyboard.KeyCodes.D
    });

    // Dash
    this.dashCooldown = 0;
    this.dashDuration = 0;
    this.isDashing = false;

    // Weapon
    this.currentAmmo = weaponData.stats.ammo;
    this.weaponCooldown = 0;
    this.isReloading = false;
    this.reloadTimer = 0;
  }

  update(delta) {
    super.update(delta);

    this.handleInput(delta);
    this.updateDash(delta);
    this.updateWeapon(delta);
  }

  handleInput(delta) {
    if (this.isStunned) return;

    // Movement
    if (!this.isDashing && !this.isAttacking) {
      if (this.cursors.left.isDown) {
        this.move(-1);
      } else if (this.cursors.right.isDown) {
        this.move(1);
      } else {
        this.body.setVelocityX(0);
      }
    }

    // Jump
    if (Phaser.Input.Keyboard.JustDown(this.cursors.up)) {
      this.jump();
    }

    // Dash
    if (Phaser.Input.Keyboard.JustDown(this.keys.dash) && this.dashCooldown <= 0) {
      this.dash();
    }

    // Attacks
    if (Phaser.Input.Keyboard.JustDown(this.keys.lightAttack)) {
      this.performAttack('light');
    }

    if (Phaser.Input.Keyboard.JustDown(this.keys.heavyAttack)) {
      this.performAttack('heavy');
    }

    // Ranged attack
    if (Phaser.Input.Keyboard.JustDown(this.keys.rangedAttack)) {
      this.fireWeapon();
    }

    // Block
    if (this.keys.block.isDown) {
      this.block();
      // Visual feedback for blocking (use tint which works for images)
      if (this.sprite.setTint) {
        this.sprite.setTint(0x4444ff);
      } else if (this.sprite.setFillStyle) {
        this.sprite.setFillStyle(0x4444ff);
      }
    } else {
      this.unblock();
      // Reset color
      if (this.sprite.clearTint) {
        this.sprite.clearTint();
      } else if (this.sprite.setFillStyle) {
        this.sprite.setFillStyle(this.movement.facingRight ? 0x0088ff : 0x0088ff);
      }
    }

    // Special
    if (Phaser.Input.Keyboard.JustDown(this.keys.special)) {
      this.useSpecial();
    }

    // Ultimate
    if (Phaser.Input.Keyboard.JustDown(this.keys.ultimate)) {
      this.activateUltimate();
    }
  }

  dash() {
    const direction = this.movement.facingRight ? 1 : -1;
    this.body.setVelocityX(direction * CONSTANTS.DASH_SPEED);
    this.dashDuration = CONSTANTS.DASH_DURATION;
    this.dashCooldown = CONSTANTS.DASH_COOLDOWN;
    this.isDashing = true;

    // Dash trail effect
    this.scene.tweens.add({
      targets: this.sprite,
      alpha: 0.5,
      duration: CONSTANTS.DASH_DURATION,
      yoyo: true
    });
  }

  updateDash(delta) {
    if (this.dashDuration > 0) {
      this.dashDuration -= delta;
      if (this.dashDuration <= 0) {
        this.isDashing = false;
        this.body.setVelocityX(0);
      }
    }

    if (this.dashCooldown > 0) {
      this.dashCooldown -= delta;
    }
  }

  fireWeapon() {
    if (this.weaponCooldown > 0 || this.isReloading || this.currentAmmo <= 0) {
      if (this.currentAmmo <= 0 && !this.isReloading) {
        this.startReload();
      }
      return null;
    }

    this.currentAmmo--;
    this.weaponCooldown = this.weaponData.stats.fireRate;

    const direction = this.movement.facingRight ? 1 : -1;
    const projectile = {
      x: this.x + (30 * direction),
      y: this.y,
      velocityX: this.weaponData.stats.projectileSpeed * direction,
      velocityY: 0,
      damage: this.weaponData.stats.damage,
      owner: this,
      weaponData: this.weaponData
    };

    if (this.currentAmmo === 0) {
      this.startReload();
    }

    return projectile;
  }

  startReload() {
    this.isReloading = true;
    this.reloadTimer = this.weaponData.stats.reloadTime;
  }

  updateWeapon(delta) {
    if (this.weaponCooldown > 0) {
      this.weaponCooldown -= delta;
    }

    if (this.isReloading) {
      this.reloadTimer -= delta;
      if (this.reloadTimer <= 0) {
        this.currentAmmo = this.weaponData.stats.ammo;
        this.isReloading = false;
      }
    }
  }

  getAmmoPercent() {
    return this.currentAmmo / this.weaponData.stats.ammo;
  }
}
