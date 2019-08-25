export default class RedGem extends Phaser.GameObjects.Sprite {
  /**
   *  A simple prefab (extended game object class), displaying a spinning
   *  Phaser 3 logo.
   *
   *  @extends Phaser.GameObjects.Sprite
   */
  constructor(scene) {
    const x = Phaser.Math.Between(0, 3000);
    super(scene, x, 0, 'items', 'gems/red/frame0000.png');

    this.type = 'red_gem';
    this.amount = 500;

    scene.physics.world.enable(this);
    scene.add.existing(this);

    this.body.setCollideWorldBounds(true);

    this.setOrigin(0.5);
    this.setScale(3);
  }

  /**
   *  Increment the angle smoothly.
   */
  update() {
    this.play('gem_red_spin', true);
  }

  grabbed() {
    this.scene.sound.play('collect_coin');
    this.scene.coinsGroup.remove(this);
    this.destroy();
  }
}
