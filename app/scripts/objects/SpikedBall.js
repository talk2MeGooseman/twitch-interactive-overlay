export default class SpikedBall extends Phaser.GameObjects.Sprite {
  /**
   *  A simple prefab (extended game object class), displaying a spinning
   *  Phaser 3 logo.
   *
   *  @extends Phaser.GameObjects.Sprite
   */
  constructor(scene) {
    const x = Phaser.Math.Between(0, 3000);
    super(scene, x, 0, 'spiked_ball');

    this.type = 'ball';

    scene.physics.world.enable(this);
    scene.add.existing(this);

    this.body.setCollideWorldBounds(true);

    this.setOrigin(0.5);
    // this.setScale(3);

    this.scene.ballGroup.add(this);

    this.scene.time.addEvent({
      delay: 60 * 1000,
      callback: this.remove,
      callbackScope: this,
      loop: false,
    });
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
