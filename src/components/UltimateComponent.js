export default class UltimateComponent {
  constructor(ultimateData) {
    this.data = ultimateData;
    this.currentMeter = 0;
    this.maxMeter = 100;
    this.isActive = false;
    this.activeTimer = 0;
  }

  isReady() {
    return this.currentMeter >= this.maxMeter && !this.isActive;
  }

  gainMeter(amount) {
    this.currentMeter = Math.min(this.maxMeter, this.currentMeter + amount);
  }

  activate() {
    if (!this.isReady()) return false;
    
    this.currentMeter = 0;
    this.isActive = true;
    this.activeTimer = this.data.duration || 0;
    
    return true;
  }

  update(delta) {
    // Passive meter gain
    if (!this.isReady() && !this.isActive) {
      this.gainMeter(0.5 * delta / 1000);
    }
    
    // Update active timer
    if (this.isActive && this.activeTimer > 0) {
      this.activeTimer -= delta;
      if (this.activeTimer <= 0) {
        this.isActive = false;
      }
    }
  }

  getPercent() {
    return this.currentMeter / this.maxMeter;
  }

  reset() {
    this.currentMeter = 0;
    this.isActive = false;
    this.activeTimer = 0;
  }
}
