import HealthComponent from '../components/HealthComponent.js';
import MovementComponent from '../components/MovementComponent.js';
import HitboxComponent from '../components/HitboxComponent.js';
import UltimateComponent from '../components/UltimateComponent.js';
import { CONSTANTS, COLORS } from '../config.js';

export default class Fighter extends Phaser.GameObjects.Container {
  constructor(scene, x, y, characterData, color) {
    super(scene, x, y);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Character data
    this.characterData = characterData;

    // Components
    this.health = new HealthComponent(characterData.stats.health);
    this.movement = new MovementComponent(characterData.stats.speed);
    this.hitbox = new HitboxComponent(scene, this);
    this.ultimate = new UltimateComponent(characterData.ultimate);

    // Create character visual (cartoon avatar style)
    this.createCharacterAvatar(color);

    // Name tag with character color
    const nameColor = characterData.color || '#ffffff';
    this.nameText = scene.add.text(0, -80, characterData.name, {
      fontSize: '14px',
      color: nameColor,
      fontFamily: 'Impact, Arial Black',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5);
    this.add(this.nameText);

    // Title tag
    this.titleText = scene.add.text(0, -95, characterData.title || '', {
      fontSize: '10px',
      color: '#aaaaaa',
      fontFamily: 'Arial',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5);
    this.add(this.titleText);

    // Physics
    this.body.setSize(200, 360);
    this.body.setOffset(-50, -90);
    this.body.setCollideWorldBounds(true);
    this.body.setMaxVelocity(600, 1000);

    // State
    this.currentState = 'idle';
    this.isAttacking = false;
    this.isBlocking = false;
    this.isStunned = false;
    this.stunTimer = 0;
    this.comboCount = 0;
    this.comboTimer = 0;

    // Special cooldown
    this.specialCooldown = 0;

    // Buffs
    this.buffMultipliers = {
      attack: 1.0,
      speed: 1.0,
      defense: 1.0
    };

    // Visual effects
    this.auraEffect = null;
  }

  createCharacterAvatar(baseColor) {
    // Try to load character portrait image
    const portraitKey = `${this.characterData.id}-portrait`;

    if (this.scene.textures.exists(portraitKey)) {
      // Use character portrait image
      this.sprite = this.scene.add.image(0, 0, portraitKey);
      this.sprite.setDisplaySize(150, 200);
      this.add(this.sprite);
    } else {
      // Fallback: Body (torso)
      this.body_sprite = this.scene.add.ellipse(0, 10, 50, 70, baseColor);
      this.add(this.body_sprite);

      // Head
      this.head = this.scene.add.circle(0, -35, 25, baseColor);
      this.add(this.head);

      // Face details
      const faceColor = parseInt(this.characterData.color.replace('#', '0x'));

      // Eyes
      this.leftEye = this.scene.add.circle(-8, -38, 4, 0xffffff);
      this.add(this.leftEye);
      this.leftPupil = this.scene.add.circle(-8, -38, 2, 0x000000);
      this.add(this.leftPupil);

      this.rightEye = this.scene.add.circle(8, -38, 4, 0xffffff);
      this.add(this.rightEye);
      this.rightPupil = this.scene.add.circle(8, -38, 2, 0x000000);
      this.add(this.rightPupil);

      // Character-specific features
      if (this.characterData.id === 'modi') {
        // Glasses
        this.glasses = this.scene.add.rectangle(0, -38, 24, 8, 0x333333, 0);
        this.glasses.setStrokeStyle(2, 0x333333);
        this.add(this.glasses);

        // Beard outline
        this.beard = this.scene.add.arc(0, -20, 20, 180, 0, false, 0xffffff);
        this.beard.setStrokeStyle(2, 0xcccccc);
        this.add(this.beard);
      } else if (this.characterData.id === 'rahul') {
        // Younger look - smile
        this.smile = this.scene.add.arc(0, -28, 8, 0, 180, false, 0x000000, 0);
        this.smile.setStrokeStyle(2, 0x000000);
        this.add(this.smile);
      }

      // Legs
      this.leftLeg = this.scene.add.rectangle(-12, 50, 15, 35, baseColor);
      this.add(this.leftLeg);
      this.rightLeg = this.scene.add.rectangle(12, 50, 15, 35, baseColor);
      this.add(this.rightLeg);

      // Arms
      this.leftArm = this.scene.add.rectangle(-25, 15, 12, 40, baseColor);
      this.leftArm.rotation = 0.3;
      this.add(this.leftArm);
      this.rightArm = this.scene.add.rectangle(25, 15, 12, 40, baseColor);
      this.rightArm.rotation = -0.3;
      this.add(this.rightArm);

      // Outline glow
      this.glowRing = this.scene.add.circle(0, 0, 50, faceColor, 0.2);
      this.addAt(this.glowRing, 0);

      // Idle animation pulse
      this.scene.tweens.add({
        targets: this.glowRing,
        scale: { from: 1, to: 1.15 },
        alpha: { from: 0.2, to: 0.4 },
        duration: 1500,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });

      // Store main sprite reference
      this.sprite = this.body_sprite;
    }
  }

  update(delta) {
    // Update components
    this.hitbox.update(delta);
    this.ultimate.update(delta);

    // Update grounded status
    this.movement.setGrounded(this.body.touching.down);

    // Update stun
    if (this.isStunned) {
      this.stunTimer -= delta;
      if (this.stunTimer <= 0) {
        this.isStunned = false;
        this.sprite.setAlpha(1);
      }
    }

    // Update combo timer
    if (this.comboTimer > 0) {
      this.comboTimer -= delta;
      if (this.comboTimer <= 0) {
        this.comboCount = 0;
      }
    }

    // Update special cooldown
    if (this.specialCooldown > 0) {
      this.specialCooldown -= delta;
    }

    // Update facing direction
    if (this.body.velocity.x < -10) {
      this.movement.setFacing(false);
      this.setScale(-1, 1);
    } else if (this.body.velocity.x > 10) {
      this.movement.setFacing(true);
      this.setScale(1, 1);
    }
  }

  move(direction) {
    if (this.isStunned || this.isAttacking) return;

    const speed = this.movement.getSpeed() * this.buffMultipliers.speed;
    this.body.setVelocityX(direction * speed);
  }

  jump() {
    if (this.isStunned) return;

    if (this.movement.canJump()) {
      const force = this.movement.jumpsRemaining === 2 ?
        CONSTANTS.JUMP_FORCE : CONSTANTS.DOUBLE_JUMP_FORCE;
      this.body.setVelocityY(force);
      this.movement.useJump();
    }
  }

  takeDamage(amount, knockback = null) {
    if (!this.health.isAlive) return 0;

    // Apply defense multiplier
    amount *= this.buffMultipliers.defense;

    const newHealth = this.health.takeDamage(amount);

    // Ultimate meter gain from taking damage
    this.ultimate.gainMeter(amount * 0.8);

    // Knockback
    if (knockback && !this.isBlocking) {
      this.body.setVelocity(knockback.x, knockback.y);
    }

    // Flash effect disabled - keep sprite at full opacity
    // Removed opacity decrease tween for cleaner visuals

    // Reset combo
    this.comboCount = 0;
    this.comboTimer = 0;

    return newHealth;
  }

  performAttack(type) {
    if (this.isAttacking || this.isStunned) return;

    this.isAttacking = true;
    this.currentState = type + 'Attack';
    this.body.setVelocityX(0);

    const attackData = {
      light: {
        damage: CONSTANTS.LIGHT_DAMAGE * this.buffMultipliers.attack,
        knockback: {
          x: CONSTANTS.LIGHT_KNOCKBACK_X,
          y: CONSTANTS.LIGHT_KNOCKBACK_Y
        },
        width: 60,
        height: 80,
        offsetX: 40,
        duration: CONSTANTS.LIGHT_ACTIVE
      },
      heavy: {
        damage: CONSTANTS.HEAVY_DAMAGE * this.buffMultipliers.attack,
        knockback: {
          x: CONSTANTS.HEAVY_KNOCKBACK_X,
          y: CONSTANTS.HEAVY_KNOCKBACK_Y
        },
        width: 80,
        height: 100,
        offsetX: 50,
        duration: CONSTANTS.HEAVY_ACTIVE
      }
    };

    const data = attackData[type];
    const direction = this.movement.facingRight ? 1 : -1;

    // Create hitbox
    this.hitbox.createAttackHitbox(
      data.offsetX * direction,
      0,
      data.width,
      data.height,
      data.damage,
      { x: data.knockback.x * direction, y: data.knockback.y },
      data.duration
    );

    // Attack animation disabled - removed zoom effect
    this.isAttacking = false;
    this.currentState = 'idle';
  }

  block() {
    if (!this.isStunned && !this.isAttacking) {
      this.isBlocking = true;
      this.body.setVelocityX(0);
    }
  }

  unblock() {
    this.isBlocking = false;
  }

  stun(duration) {
    this.isStunned = true;
    this.stunTimer = duration;
    this.body.setVelocity(0, 0);

    // Visual feedback disabled - keep sprite at full opacity
    // Removed alpha flashing to maintain visibility
  }

  registerComboHit() {
    this.comboCount++;
    this.comboTimer = CONSTANTS.COMBO_TIMEOUT;
    this.ultimate.gainMeter(1);

    return this.comboCount;
  }

  activateUltimate() {
    if (!this.ultimate.isReady()) return false;

    this.ultimate.activate();

    // Apply buffs based on ultimate type
    if (this.characterData.ultimate.type === 'buff') {
      this.buffMultipliers.attack = this.characterData.ultimate.attackBoost || 1;
      this.buffMultipliers.speed = this.characterData.ultimate.speedBoost || 1;
      this.buffMultipliers.defense = this.characterData.ultimate.defenseBoost || 1;

      // Heal on ultimate activation
      if (this.characterData.ultimate.healAmount) {
        this.health.heal(this.characterData.ultimate.healAmount);
      }

      // Visual effect removed - no zoom/fade aura
      // Buffs still active

      // Remove buffs after duration
      this.scene.time.delayedCall(this.characterData.ultimate.duration, () => {
        this.buffMultipliers.attack = 1;
        this.buffMultipliers.speed = 1;
        this.buffMultipliers.defense = 1;
      });
    } else if (this.characterData.ultimate.type === 'projectile_rain') {
      // Heal on projectile rain ultimate
      if (this.characterData.ultimate.healAmount) {
        this.health.heal(this.characterData.ultimate.healAmount);
      }
    }

    return true;
  }

  useSpecial() {
    if (this.specialCooldown > 0 || this.isStunned) return false;

    this.specialCooldown = this.characterData.specialMove.cooldown;

    const special = this.characterData.specialMove;

    if (special.type === 'radial') {
      // Speech Shockwave
      this.createShockwave(special.radius, special.damage);
    } else if (special.type === 'multi_hit') {
      // Debate Flurry
      this.executeMultiHit(special);
    } else if (special.type === 'ground_pound') {
      // Ground Slam
      this.executeGroundPound(special);
    }

    return true;
  }

  createShockwave(radius, damage) {
    // Visual effect
    const ring = this.scene.add.circle(this.x, this.y, 10, COLORS.PRIMARY, 0);
    ring.setStrokeStyle(4, COLORS.PRIMARY, 1);

    this.scene.tweens.add({
      targets: ring,
      radius: radius,
      alpha: 0,
      duration: 500,
      ease: 'Cubic.easeOut',
      onComplete: () => ring.destroy()
    });

    // Screen shake disabled for better UX
    // this.scene.cameras.main.shake(300, 0.015);

    return { radius, damage };
  }

  executeMultiHit(special) {
    let hitCount = 0;
    const direction = this.movement.facingRight ? 1 : -1;

    const interval = 100;

    for (let i = 0; i < special.hits; i++) {
      this.scene.time.delayedCall(i * interval, () => {
        this.hitbox.createAttackHitbox(
          40 * direction,
          0,
          60,
          80,
          special.damage,
          { x: 30 * direction, y: -10 },
          80
        );

        // Quick jab animation removed - no zoom
      });
    }
  }

  executeGroundPound(special) {
    // Jump if grounded
    if (this.movement.isGrounded) {
      this.body.setVelocityY(-200);
    }

    // Wait for landing
    const checkLanding = this.scene.time.addEvent({
      delay: 50,
      callback: () => {
        if (this.movement.isGrounded) {
          checkLanding.destroy();

          // Impact - camera shake disabled for better UX
          // this.scene.cameras.main.shake(500, 0.02);

          // Visual
          this.createShockwave(special.radius, special.damage);
        }
      },
      loop: true
    });
  }

  destroy() {
    if (this.hitbox) this.hitbox.destroy();
    super.destroy();
  }
}
