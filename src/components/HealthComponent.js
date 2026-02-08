export default class HealthComponent {
  constructor(maxHealth) {
    this.max = maxHealth;
    this.current = maxHealth;
    this.isAlive = true;
    this.shield = 0;
  }

  takeDamage(amount) {
    // Apply shield first
    if (this.shield > 0) {
      const shieldDamage = Math.min(this.shield, amount);
      this.shield -= shieldDamage;
      amount -= shieldDamage;
    }
    
    this.current = Math.max(0, this.current - amount);
    if (this.current === 0) {
      this.isAlive = false;
    }
    return this.current;
  }

  heal(amount) {
    this.current = Math.min(this.max, this.current + amount);
    return this.current;
  }

  addShield(amount) {
    this.shield += amount;
  }

  getPercent() {
    return this.current / this.max;
  }

  reset() {
    this.current = this.max;
    this.isAlive = true;
    this.shield = 0;
  }
}
