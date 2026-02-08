export default class MovementComponent {
  constructor(speed) {
    this.baseSpeed = speed * 30;
    this.currentSpeed = this.baseSpeed;
    this.speedModifier = 1.0;
    this.isGrounded = false;
    this.facingRight = true;
    this.jumpsRemaining = 2;
  }

  getSpeed() {
    return this.currentSpeed * this.speedModifier;
  }

  applySpeedBoost(multiplier) {
    this.speedModifier = multiplier;
  }

  resetSpeedBoost() {
    this.speedModifier = 1.0;
  }

  setGrounded(grounded) {
    this.isGrounded = grounded;
    if (grounded) {
      this.jumpsRemaining = 2;
    }
  }

  canJump() {
    return this.jumpsRemaining > 0;
  }

  useJump() {
    if (this.jumpsRemaining > 0) {
      this.jumpsRemaining--;
      return true;
    }
    return false;
  }

  setFacing(right) {
    this.facingRight = right;
  }
}
