export default class Coin extends Phaser.GameObjects.Sprite {
  /**
   *  A simple prefab (extended game object class), displaying a spinning
   *  Phaser 3 logo.
   *
   *  @extends Phaser.GameObjects.Sprite
   */
  constructor(scene) {
    const x = Phaser.Math.Between(0, 3000);
    super(scene, x, 0, 'items', 'coin/0001.png');

    this.type = 'coin';
    scene.physics.world.enable(this);
    scene.add.existing(this);
    
    this.body.setCollideWorldBounds(true);

    this.setOrigin(0.5);
  }

  /**
   *  Increment the angle smoothly.
   */
  update() {
    this.play('coin_spin', true);
  }

  grabbed() {
    this.scene.collectCoinAudio.play();
    this.scene.coinsGroup.remove(this);
    this.destroy();
  }
}
