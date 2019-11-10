import BaseSprite from '@/objects/BaseSprite';
export default class SpikedBall extends BaseSprite {
  /**
   *
   *  @extends BaseSprite
   */
  constructor(scene) {
    super({ scene, key: 'spiked_ball' });

    this.type = 'ball';
    this.body.setCollideWorldBounds(true);
    this.setOrigin(0.5);
    // this.setScale(3);

    this.scene.ballGroup.add(this);

    this.createDelayedCall(
      60 * 1000,
      () => (this.remove()),
    );
  }

  /**
   *  Increment the angle smoothly.
   */
  update() {
    this.body.setImmovable(true);
    let rotation = 0.05;

    if (this.body.velocity.x < 0) {
      rotation *= -1;
      this.body.velocity.x = -150;
    } else {
      this.body.velocity.x = 150;
    }
    this.rotation += rotation;
  }

  remove() {
    this.scene.ballGroup.remove(this);
    this.destroy();
  }
}
