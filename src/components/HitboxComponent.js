export default class HitboxComponent {
  constructor(scene, owner) {
    this.scene = scene;
    this.owner = owner;
    this.attackHitboxes = [];
    
    // Hurtbox (vulnerable zone)
    this.hurtbox = scene.add.rectangle(0, 0, 50, 100, 0xff0000, 0);
    owner.add(this.hurtbox);
  }

  createAttackHitbox(offsetX, offsetY, width, height, damage, knockback, duration) {
    const hitbox = {
      rect: this.scene.add.rectangle(offsetX, offsetY, width, height, 0x00ff00, 0),
      damage: damage,
      knockback: knockback,
      active: true,
      duration: duration,
      hitTargets: new Set(),
      timer: 0
    };
    
    this.owner.add(hitbox.rect);
    this.attackHitboxes.push(hitbox);
    
    return hitbox;
  }

  checkCollision(otherHitbox) {
    const results = [];
    
    for (let attackBox of this.attackHitboxes) {
      if (!attackBox.active) continue;
      
      const myBounds = this.getWorldBounds(attackBox.rect);
      const theirBounds = this.getWorldBounds(otherHitbox.hurtbox);
      
      if (Phaser.Geom.Intersects.RectangleToRectangle(myBounds, theirBounds)) {
        if (!attackBox.hitTargets.has(otherHitbox.owner)) {
          attackBox.hitTargets.add(otherHitbox.owner);
          results.push({
            damage: attackBox.damage,
            knockback: attackBox.knockback
          });
        }
      }
    }
    
    return results;
  }

  getWorldBounds(rect) {
    const worldTransform = this.owner.getWorldTransformMatrix();
    const worldPos = worldTransform.transformPoint(rect.x, rect.y);
    
    return new Phaser.Geom.Rectangle(
      worldPos.x - rect.width / 2,
      worldPos.y - rect.height / 2,
      rect.width,
      rect.height
    );
  }

  update(delta) {
    for (let i = this.attackHitboxes.length - 1; i >= 0; i--) {
      const hitbox = this.attackHitboxes[i];
      hitbox.timer += delta;
      
      if (hitbox.timer >= hitbox.duration) {
        hitbox.rect.destroy();
        this.attackHitboxes.splice(i, 1);
      }
    }
  }

  destroy() {
    this.attackHitboxes.forEach(hb => hb.rect.destroy());
    if (this.hurtbox) this.hurtbox.destroy();
  }
}
