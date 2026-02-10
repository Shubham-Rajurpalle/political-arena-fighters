import PlayerController from '../entities/PlayerController.js';
import AIController from '../entities/AIController.js';
import Projectile from '../entities/Projectile.js';
import CombatSystem from '../systems/CombatSystem.js';
import HealthBar from '../ui/HealthBar.js';
import UltimateBar from '../ui/UltimateBar.js';
import ComboDisplay from '../ui/ComboDisplay.js';
import { CONSTANTS, COLORS } from '../config.js';

export default class BattleScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BattleScene' });
  }

  create() {
    const width = this.scale.width;
    const height = this.scale.height;

    // Background
    this.createBackground();

    // Create ground
    this.createGround();

    // Get selections
    const playerChar = this.registry.get('selectedCharacter');
    const playerWeapon = this.registry.get('selectedWeapon');
    const aiChar = this.registry.get('aiCharacter');
    const aiWeapon = this.registry.get('aiWeapon');

    // Create fighters
    this.player = new PlayerController(
      this,
      CONSTANTS.LEFT_BOUND + 100,
      CONSTANTS.GROUND_Y - 150,  // Moved higher to avoid dark area
      playerChar,
      playerWeapon
    );

    this.enemy = new AIController(
      this,
      CONSTANTS.RIGHT_BOUND - 100,
      CONSTANTS.GROUND_Y - 150,  // Moved higher to avoid dark area
      aiChar,
      aiWeapon
    );

    this.enemy.setTarget(this.player);

    // Physics collisions
    this.physics.add.collider(this.player, this.ground);
    this.physics.add.collider(this.enemy, this.ground);

    // Combat system
    this.combatSystem = new CombatSystem(this);

    // Projectiles
    this.projectiles = [];

    // UI
    this.createUI();

    // Battle timer
    this.battleTimer = CONSTANTS.BATTLE_TIME;
    this.timerText = this.add.text(width / 2, 20, this.formatTime(this.battleTimer), {
      fontSize: '32px',
      color: '#ffffff',
      fontFamily: 'Courier New',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5);

    // Round text
    this.roundText = this.add.text(width / 2, 60, 'ROUND 1', {
      fontSize: '24px',
      color: COLORS.PRIMARY,
      fontFamily: 'Courier New',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Pause
    this.isPaused = false;
    this.pauseKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

    // Start countdown
    this.startCountdown();
  }

  createBackground() {
    const width = this.scale.width;
    const height = this.scale.height;

    // Check if we have stage background image
    if (this.textures.exists('stage-parliament')) {
      const bg = this.add.image(width / 2, height / 2, 'stage-parliament');
      bg.setDisplaySize(width, height);
      bg.setAlpha(0.7);
    } else {
      // Fallback: Indian parliament/rally themed gradient
      const graphics = this.add.graphics();

      // Sky gradient
      graphics.fillGradientStyle(0x87CEEB, 0x87CEEB, 0xE6F3FF, 0xE6F3FF, 1, 1, 1, 1);
      graphics.fillRect(0, 0, width, CONSTANTS.GROUND_Y - 100);

      // Building silhouettes (parliament style)
      graphics.fillStyle(0x2a2a3e, 0.8);
      graphics.fillRect(0, CONSTANTS.GROUND_Y - 200, 200, 200);
      graphics.fillRect(width - 200, CONSTANTS.GROUND_Y - 200, 200, 200);

      // Central dome (parliament)
      graphics.fillStyle(0x3a3a4e, 0.9);
      graphics.fillCircle(width / 2, CONSTANTS.GROUND_Y - 150, 80);
      graphics.fillRect(width / 2 - 100, CONSTANTS.GROUND_Y - 150, 200, 150);

      // Indian flag colors as accents
      graphics.fillStyle(0xFF9933, 0.3);
      graphics.fillRect(0, CONSTANTS.GROUND_Y - 50, width, 20);
      graphics.fillStyle(0xFFFFFF, 0.3);
      graphics.fillRect(0, CONSTANTS.GROUND_Y - 30, width, 20);
      graphics.fillStyle(0x138808, 0.3);
      graphics.fillRect(0, CONSTANTS.GROUND_Y - 10, width, 20);
    }

    // Crowd silhouettes
    this.createCrowdEffect();

    // Arena floor - extend to fill bottom
    const floor = this.add.graphics();
    floor.fillStyle(0x1a1a2e, 1);
    floor.fillRect(0, CONSTANTS.GROUND_Y2 + 200, width, height - CONSTANTS.GROUND_Y);

    // Floor pattern (hexagon/stage pattern)
    floor.lineStyle(2, 0x4a4a6e, 0.5);
    for (let x = 0; x < width; x += 60) {
      for (let y = CONSTANTS.GROUND_Y; y < height; y += 52) {
        const offset = ((y - CONSTANTS.GROUND_Y) / 52) % 2 === 0 ? 0 : 30;
        this.drawHexagon(floor, x + offset, y, 30);
      }
    }

    // Stage spotlights
    this.createSpotlights();

    // Grid overlay
    const grid = this.add.graphics();
    grid.lineStyle(1, 0xFFFFFF, 0.05);
    for (let x = 0; x < width; x += 40) {
      grid.lineBetween(x, 0, x, height);
    }
    for (let y = 0; y < height; y += 40) {
      grid.lineBetween(0, y, width, y);
    }
  }

  drawHexagon(graphics, x, y, size) {
    const points = [];
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i;
      points.push(x + size * Math.cos(angle));
      points.push(y + size * Math.sin(angle));
    }
    graphics.strokePoints(points, true);
  }

  createCrowdEffect() {
    // Animated crowd in background
    const crowdLeft = this.add.graphics();
    const crowdRight = this.add.graphics();

    // Left crowd
    crowdLeft.fillStyle(0x000000, 0.3);
    for (let i = 0; i < 30; i++) {
      const x = 10 + Math.random() * 150;
      const y = CONSTANTS.GROUND_Y - 100 - Math.random() * 100;
      const size = 8 + Math.random() * 4;
      crowdLeft.fillCircle(x, y, size);
    }

    // Right crowd
    crowdRight.fillStyle(0x000000, 0.3);
    for (let i = 0; i < 30; i++) {
      const x = this.scale.width - 160 + Math.random() * 150;
      const y = CONSTANTS.GROUND_Y - 100 - Math.random() * 100;
      const size = 8 + Math.random() * 4;
      crowdRight.fillCircle(x, y, size);
    }

    // Animate crowd (subtle movement)
    this.tweens.add({
      targets: [crowdLeft, crowdRight],
      y: '+=5',
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  createSpotlights() {
    // Left spotlight
    const spotLeft = this.add.circle(200, CONSTANTS.GROUND_Y, 150, 0xFFFFFF, 0.1);
    this.tweens.add({
      targets: spotLeft,
      alpha: { from: 0.1, to: 0.2 },
      duration: 1500,
      yoyo: true,
      repeat: -1
    });

    // Right spotlight
    const spotRight = this.add.circle(1080, CONSTANTS.GROUND_Y, 150, 0xFFFFFF, 0.1);
    this.tweens.add({
      targets: spotRight,
      alpha: { from: 0.1, to: 0.2 },
      duration: 1500,
      yoyo: true,
      repeat: -1,
      delay: 750
    });
  }

  createGround() {
    this.ground = this.physics.add.staticGroup();
    const ground = this.ground.create(this.scale.width / 2, CONSTANTS.GROUND_Y + 40, null);
    ground.setSize(this.scale.width, 80);
    ground.setDisplaySize(this.scale.width, 80);
    ground.refreshBody();
    ground.setVisible(false);
  }

  createUI() {
    const width = this.scale.width;

    // Character portraits (top corners)
    this.createCharacterPortraits();

    // Health bars
    this.playerHealthBar = new HealthBar(this, 180, 20, 380, 40, this.player);
    this.enemyHealthBar = new HealthBar(this, width - 180, 20, 380, 40, this.enemy, true);

    // Ultimate bars
    this.playerUltimateBar = new UltimateBar(this, 180, 70, 380, 20, this.player);
    this.enemyUltimateBar = new UltimateBar(this, width - 180, 70, 380, 20, this.enemy, true);

    // Combo display
    this.comboDisplay = new ComboDisplay(this);

    // Ammo display with icons
    this.playerAmmoText = this.add.text(180, 100, '', {
      fontSize: '18px',
      color: '#ffffff',
      fontFamily: 'Impact, Arial',
      stroke: '#000000',
      strokeThickness: 3
    });

    this.enemyAmmoText = this.add.text(width - 180, 100, '', {
      fontSize: '18px',
      color: '#ffffff',
      fontFamily: 'Impact, Arial',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(1, 0);

    // Special cooldown indicators
    this.playerSpecialText = this.add.text(180, 125, '', {
      fontSize: '16px',
      color: '#00ff00',
      fontFamily: 'Impact, Arial',
      stroke: '#000000',
      strokeThickness: 2
    });

    this.enemySpecialText = this.add.text(width - 180, 125, '', {
      fontSize: '16px',
      color: '#00ff00',
      fontFamily: 'Impact, Arial',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(1, 0);

    // VS text in center (appears briefly)
    this.createVSDisplay();
  }

  createCharacterPortraits() {
    const size = 140;

    // Player portrait (left)
    const playerColor = parseInt(this.player.characterData.color.replace('#', '0x'));

    // Portrait frame
    const playerFrame = this.add.rectangle(85, 65, size + 10, size + 10, 0x000000, 0.8);
    playerFrame.setStrokeStyle(4, playerColor);

    // Check if we have actual image
    if (this.textures.exists(`${this.player.characterData.id}-portrait`)) {
      const portrait = this.add.image(85, 65, `${this.player.characterData.id}-portrait`);
      portrait.setDisplaySize(size, size);
    } else {
      // Fallback: colored circle with initial
      const playerPortrait = this.add.circle(85, 65, size / 2, playerColor);
      const initial = this.add.text(85, 65, this.player.characterData.name[0], {
        fontSize: '64px',
        color: '#ffffff',
        fontFamily: 'Impact',
        fontStyle: 'bold'
      }).setOrigin(0.5);
    }

    // Enemy portrait (right)
    const enemyColor = parseInt(this.enemy.characterData.color.replace('#', '0x'));

    const enemyFrame = this.add.rectangle(this.scale.width - 85, 65, size + 10, size + 10, 0x000000, 0.8);
    enemyFrame.setStrokeStyle(4, enemyColor);

    if (this.textures.exists(`${this.enemy.characterData.id}-portrait`)) {
      const portrait = this.add.image(this.scale.width - 85, 65, `${this.enemy.characterData.id}-portrait`);
      portrait.setDisplaySize(size, size);
      portrait.setFlipX(true); // Mirror for facing
    } else {
      // Fallback
      const enemyPortrait = this.add.circle(this.scale.width - 85, 65, size / 2, enemyColor);
      const initial = this.add.text(this.scale.width - 85, 65, this.enemy.characterData.name[0], {
        fontSize: '64px',
        color: '#ffffff',
        fontFamily: 'Impact',
        fontStyle: 'bold'
      }).setOrigin(0.5);
    }
  }

  createVSDisplay() {
    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;

    const vsContainer = this.add.container(centerX, centerY);

    // VS background
    const vsBg = this.add.rectangle(0, 0, 200, 100, 0x000000, 0.9);
    vsBg.setStrokeStyle(4, 0xFFD700);

    // VS text
    const vsText = this.add.text(0, 0, 'VS', {
      fontSize: '72px',
      color: '#FFD700',
      fontFamily: 'Impact',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 8
    }).setOrigin(0.5);

    vsContainer.add([vsBg, vsText]);
    vsContainer.setDepth(1000);

    // Animate VS
    this.tweens.add({
      targets: vsContainer,
      scale: { from: 0, to: 1.5 },
      alpha: { from: 0, to: 1 },
      duration: 500,
      ease: 'Back.easeOut'
    });

    // Fade out after 2 seconds
    this.time.delayedCall(2000, () => {
      this.tweens.add({
        targets: vsContainer,
        alpha: 0,
        scale: 0.5,
        duration: 500,
        onComplete: () => vsContainer.destroy()
      });
    });
  }

  startCountdown() {
    this.physics.pause();

    const countdownText = this.add.text(
      this.scale.width / 2,
      this.scale.height / 2,
      '3',
      {
        fontSize: '120px',
        color: COLORS.PRIMARY,
        fontFamily: 'Impact',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 8
      }
    ).setOrigin(0.5);

    let count = 3;
    const countdownTimer = this.time.addEvent({
      delay: 1000,
      callback: () => {
        count--;
        if (count > 0) {
          countdownText.setText(count.toString());
          this.tweens.add({
            targets: countdownText,
            scale: { from: 1.5, to: 1 },
            alpha: { from: 0, to: 1 },
            duration: 500
          });
        } else {
          countdownText.setText('FIGHT!');
          this.tweens.add({
            targets: countdownText,
            scale: { from: 1.5, to: 0 },
            alpha: 0,
            duration: 500,
            onComplete: () => {
              countdownText.destroy();
              this.physics.resume();
            }
          });
        }
      },
      repeat: 3
    });
  }

  update(time, delta) {
    if (this.isPaused) return;

    // Check pause
    if (Phaser.Input.Keyboard.JustDown(this.pauseKey)) {
      this.togglePause();
      return;
    }

    // Update fighters
    this.player.update(delta);
    this.enemy.update(delta);

    // Update projectiles
    this.updateProjectiles(delta);

    // Check combat
    this.combatSystem.checkCombat(this.player, this.enemy);

    // Check special abilities collision
    this.checkSpecialCollisions();

    // Update UI
    this.updateUI();

    // Update timer
    this.battleTimer -= delta / 1000;
    this.timerText.setText(this.formatTime(this.battleTimer));

    if (this.battleTimer <= 0) {
      this.endBattle('timeout');
    }

    // Check victory conditions
    if (!this.player.health.isAlive) {
      this.endBattle('enemy_wins');
    } else if (!this.enemy.health.isAlive) {
      this.endBattle('player_wins');
    }
  }

  updateProjectiles(delta) {
    // Check for new projectiles from player
    const playerProjectile = this.player.fireWeapon();
    if (playerProjectile) {
      playerProjectile.target = this.enemy;
      this.projectiles.push(new Projectile(this, playerProjectile));
    }

    // Check for new projectiles from enemy
    const enemyProjectile = this.enemy.fireWeapon();
    if (enemyProjectile) {
      enemyProjectile.target = this.player;
      this.projectiles.push(new Projectile(this, enemyProjectile));
    }

    // Update existing projectiles
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const projectile = this.projectiles[i];

      if (!projectile.active) {
        this.projectiles.splice(i, 1);
        continue;
      }

      projectile.update(delta);

      // Check collision with player
      if (projectile.owner !== this.player) {
        if (this.physics.overlap(projectile, this.player)) {
          projectile.onHit(this.player);
          this.projectiles.splice(i, 1);
        }
      }

      // Check collision with enemy
      if (projectile.owner !== this.enemy) {
        if (this.physics.overlap(projectile, this.enemy)) {
          projectile.onHit(this.enemy);
          this.projectiles.splice(i, 1);
        }
      }
    }
  }

  checkSpecialCollisions() {
    // This would check for area-of-effect specials
    // Currently handled in Fighter class
  }

  updateUI() {
    this.playerHealthBar.update();
    this.enemyHealthBar.update();
    this.playerUltimateBar.update();
    this.enemyUltimateBar.update();

    // Ammo
    const playerAmmo = this.player.currentAmmo;
    const playerMaxAmmo = this.player.weaponData.stats.ammo;
    this.playerAmmoText.setText(`AMMO: ${playerAmmo}/${playerMaxAmmo}`);

    if (this.player.isReloading) {
      this.playerAmmoText.setText('RELOADING...');
      this.playerAmmoText.setColor('#ff0000');
    } else {
      this.playerAmmoText.setColor('#ffffff');
    }

    const enemyAmmo = this.enemy.currentAmmo;
    const enemyMaxAmmo = this.enemy.weaponData.stats.ammo;
    this.enemyAmmoText.setText(`AMMO: ${enemyAmmo}/${enemyMaxAmmo}`);

    // Special cooldowns
    if (this.player.specialCooldown > 0) {
      this.playerSpecialText.setText(`SPECIAL: ${(this.player.specialCooldown / 1000).toFixed(1)}s`);
    } else {
      this.playerSpecialText.setText('SPECIAL: READY');
      this.playerSpecialText.setColor('#00ff00');
    }

    if (this.enemy.specialCooldown > 0) {
      this.enemySpecialText.setText(`SPECIAL: ${(this.enemy.specialCooldown / 1000).toFixed(1)}s`);
    } else {
      this.enemySpecialText.setText('SPECIAL: READY');
      this.enemySpecialText.setColor('#00ff00');
    }
  }

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  togglePause() {
    this.isPaused = !this.isPaused;

    if (this.isPaused) {
      this.physics.pause();

      const overlay = this.add.rectangle(
        this.scale.width / 2,
        this.scale.height / 2,
        this.scale.width,
        this.scale.height,
        0x000000,
        0.8
      );
      overlay.setDepth(1000);

      const pauseText = this.add.text(
        this.scale.width / 2,
        this.scale.height / 2,
        'PAUSED\n\nPress ESC to Resume\nPress M for Main Menu',
        {
          fontSize: '48px',
          color: '#ffffff',
          fontFamily: 'Courier New',
          fontStyle: 'bold',
          align: 'center'
        }
      ).setOrigin(0.5);
      pauseText.setDepth(1001);

      this.pauseOverlay = overlay;
      this.pauseText = pauseText;

      const menuKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);
      menuKey.once('down', () => {
        this.scene.start('MainMenuScene');
      });

    } else {
      this.physics.resume();
      if (this.pauseOverlay) this.pauseOverlay.destroy();
      if (this.pauseText) this.pauseText.destroy();
    }
  }

  endBattle(result) {
    this.physics.pause();

    this.time.delayedCall(1000, () => {
      this.scene.start('ResultScene', { result: result });
    });
  }
}
