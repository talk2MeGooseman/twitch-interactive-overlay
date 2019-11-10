import Coin from '@/objects/Coin';

export default class BlueGem extends Coin {
  /**
   *
   *  @extends Coin
   */
  constructor(scene) {
    super(scene, 'items', 'gems/blue/frame0000.png');

    this.type = 'blue_gem';
    this.amount = 100;
    this.setScale(2);
  }

  /**
   *  Increment the angle smoothly.
   */
  update() {
    this.play('gem_blue_spin', true);
  }
}
