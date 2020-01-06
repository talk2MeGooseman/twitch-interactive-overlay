import BaseSprite from '@/objects/BaseSprite';
import { playAudio } from '../helpers/audioFactory';

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
    playAudio(this.scene, 'collect_coin', { broadcaster: true });
    this.scene.coinsGroup.remove(this);
    this.destroy();
  }
}
