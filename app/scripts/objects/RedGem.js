import Coin from '@/objects/Coin';

export default class RedGem extends Coin {
  /**
   *  A simple prefab (extended game object class), displaying a spinning
   *  Phaser 3 logo.
   *
   *  @extends Coin
   */
  constructor(scene) {
    super(scene, 'items', 'gems/red/frame0000.png');

    this.type = 'red_gem';
    this.amount = 500;
    this.setScale(3);
  }

  /**
   *  Increment the angle smoothly.
   */
  update() {
    this.play('gem_red_spin', true);
  }
}
