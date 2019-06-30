import Coin from '@/objects/Coin';
import BlueGem from '@/objects/BlueGem';
import RedGem from '@/objects/RedGem';

export default function bitCreatorFactory(scene) {
  let sprite;
  const trigger = Phaser.Math.Between(1, 10);

  if (trigger === 5 && scene.bitTotal >=500) {
    scene.bitTotal -= 500;
    sprite = new RedGem(scene);

  } else if (trigger === 5 && scene.bitTotal >= 100) {
    scene.bitTotal -= 100;
    sprite = new BlueGem(scene);

  } else if (scene.bitTotal > 0 ) {
    scene.bitTotal--;
    sprite = new Coin(scene);

  } else {
    return;
  }

  scene.coinsGroup.add(sprite);
}
