export default class Logo extends Phaser.GameObjects.Sprite {
  /**
   *  A simple prefab (extended game object class), displaying a spinning
   *  Phaser 3 logo.
   *
   *  @extends Phaser.GameObjects.Sprite
   */
  constructor(config) {
    super(config.scene, config.x || 0, config.y || 0, config.key);

    config.scene.physics.world.enable(this);
    config.scene.add.existing(this);
    
    this.body.setCollideWorldBounds(true);
    this.setScale(0.5);

    const x = config.scene.cameras.main.width / 2;
    const y = config.scene.cameras.main.height / 2;

    this.setPosition(x, y);
    this.setOrigin(0.5);
  }

  /**
   *  Increment the angle smoothly.
   */
  update() {
    // this.angle += 0.1;
  }
}
