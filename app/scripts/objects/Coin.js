import BaseSprite from '@/objects/BaseSprite';

export default class Coin extends BaseSprite {
  /**
   *
   *  @extends Phaser.GameObjects.Sprite
   */
  constructor(scene, key = 'items', frame = 'coin/0001.png') {
    super({ scene, key, frame });

    this.type = 'bit';
    this.amount = 1;
    this.setOrigin(0.5);
  }

  /**
   *  Increment the angle smoothly.
   */
  update() {
    this.play('coin_spin', true);
  }

  grabbed() {
    this.scene.sound.play('collect_coin');
    this.scene.coinsGroup.remove(this);
    this.destroy();
  }
}
