import Fighter from './Fighter.js';
import { COLORS } from '../config.js';

export default class AIController extends Fighter {
  constructor(scene, x, y, characterData, weaponData) {
    super(scene, x, y, characterData, COLORS.ENEMY);
    
    this.weaponData = weaponData;
    
    // AI properties
    this.target = null;
    this.actionTimer = 0;
    this.currentAction = 'idle';
    this.reactionTime = 200;
    this.reactionTimer = 0;
    
    // Difficulty settings
    this.aggressiveness = 0.6;
    this.blockProbability = 0.3;
    this.preferredRange = 150;
    
    // Weapon
    this.currentAmmo = weaponData.stats.ammo;
    this.weaponCooldown = 0;
    this.isReloading = false;
    this.reloadTimer = 0;
  }

  setTarget(target) {
    this.target = target;
  }

  update(delta) {
    super.update(delta);
    
    if (this.target) {
      this.think(delta);
    }
    
    this.updateWeapon(delta);
  }

  think(delta) {
    this.reactionTimer -= delta;
    if (this.reactionTimer > 0) return;
    
    this.actionTimer -= delta;
    if (this.actionTimer > 0) return;
    
    const distance = Phaser.Math.Distance.Between(
      this.x, this.y,
      this.target.x, this.target.y
    );
    
    const action = this.selectAction(distance);
    this.executeAction(action);
    
    this.reactionTimer = this.reactionTime;
  }

  selectAction(distance) {
    const priorities = [];
    
    // 1. Avoid danger
    if (this.target.isAttacking && distance < 100) {
      if (Math.random() < this.blockProbability) {
        priorities.push({ action: 'block', priority: 10 });
      } else {
        priorities.push({ action: 'dodge', priority: 9 });
      }
    }
    
    // 2. Ultimate if ready and close
    if (this.ultimate.isReady() && distance < 200) {
      priorities.push({ action: 'ultimate', priority: 8 });
    }
    
    // 3. Special if ready
    if (this.specialCooldown <= 0 && distance < 250) {
      priorities.push({ action: 'special', priority: 7 });
    }
    
    // 4. Range management
    if (distance > this.preferredRange + 50) {
      priorities.push({ action: 'moveToward', priority: 6 });
    } else if (distance < this.preferredRange - 50) {
      priorities.push({ action: 'moveAway', priority: 5 });
    }
    
    // 5. Weapon attack at medium range
    if (distance > 100 && distance < 400 && this.currentAmmo > 0) {
      priorities.push({ action: 'weaponAttack', priority: 5 });
    }
    
    // 6. Melee attacks when close
    if (distance < 100 && Math.random() < this.aggressiveness) {
      const attackType = Math.random() < 0.7 ? 'lightAttack' : 'heavyAttack';
      priorities.push({ action: attackType, priority: 4 });
    }
    
    // 7. Default
    priorities.push({ action: 'idle', priority: 1 });
    
    priorities.sort((a, b) => b.priority - a.priority);
    return priorities[0].action;
  }

  executeAction(action) {
    switch(action) {
      case 'lightAttack':
        this.performAttack('light');
        this.actionTimer = 500;
        break;
        
      case 'heavyAttack':
        this.performAttack('heavy');
        this.actionTimer = 800;
        break;
        
      case 'weaponAttack':
        this.fireWeapon();
        this.actionTimer = this.weaponData.stats.fireRate;
        break;
        
      case 'special':
        this.useSpecial();
        this.actionTimer = 1500;
        break;
        
      case 'ultimate':
        this.activateUltimate();
        this.actionTimer = 2000;
        break;
        
      case 'block':
        this.block();
        this.actionTimer = 500;
        this.sprite.setFillStyle(0xff4444);
        this.scene.time.delayedCall(500, () => {
          this.unblock();
          this.sprite.setFillStyle(0xff3366);
        });
        break;
        
      case 'dodge':
        const dodgeDir = this.x < this.target.x ? -1 : 1;
        this.body.setVelocityX(dodgeDir * 300);
        this.actionTimer = 300;
        break;
        
      case 'moveToward':
        const towardDir = this.target.x > this.x ? 1 : -1;
        this.move(towardDir);
        this.actionTimer = 200;
        break;
        
      case 'moveAway':
        const awayDir = this.target.x > this.x ? -1 : 1;
        this.move(awayDir);
        this.actionTimer = 200;
        break;
        
      default:
        this.body.setVelocityX(0);
        this.actionTimer = 100;
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
    
    const direction = this.target.x > this.x ? 1 : -1;
    this.movement.setFacing(direction === 1);
    
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
}
