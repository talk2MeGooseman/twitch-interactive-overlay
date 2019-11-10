import {
  findSpriteInGroup,
} from '@/helpers/phaserHelpers';
import UserSprite from '@/objects/UserSprite';

/**
   * Makes all uses sprites perform the wave
   *
   * @static
   * @param {Phaser.GameObjects.Group} group
   * @param {Phaser.Scene} scene
   * @memberof userSpriteHelpers
   */
export function triggerTheWave(group, scene) {
  group.getChildren().forEach(user => {
    let delay = user.x;
    let u = user;

    scene.time.delayedCall(delay, () => {
      u.jump();
    });
  });
}

/**
   * Have all sprites in the given group display and bubble message
   *
   * @static
   * @param {Phaser.GameObjects.Group} group
   * @param {String} message
   */
export function chatBubbleAllSprites(group, message) {
  group.getChildren().forEach(user => {
    user.displaySpeechBubble(message);
  });
}

/**
   * Creates and adds User Sprite if one doesn't already exist
   *
   * @param {Phaser.GameObjects.Group} group
   * @param {String} user
   * @param {Object} flags
   * @returns {UserSprite} sprite
   */
export function createOrFindUser(group, scene, user, flags) {
  let sprite = userExists(group, user);

  if (sprite) {
    return sprite;
  }

  const spriteConfig = {
    scene: scene,
    key: 'characters',
    frame: 'peasant/standing/peasant.png',
    user: user,
    flags: flags,
  };

  sprite = new UserSprite(spriteConfig);
  group.add(sprite);

  return sprite;
}

/**
   * Removes user for provided group
   *
   * @static
   * @param {Phaser.Physics.Arcade.Group} userGroup
   * @param {String} user
   * @memberof UserSprite
   */
export function userParted(userGroup, user) {
  const sprite = userExists(userGroup, user);
  if (sprite) {
    sprite.remove();
  }
}

/**
   * Check if user exists is group
   *
   * @param {Phaser.Physics.Arcade.Group} userGroup
   * @param {String} user
   * @returns {UserSprite}
   * @memberof UserSprite
   */
export function userExists(userGroup, user) {
  return findSpriteInGroup(userGroup, sprite => sprite.user.toLowerCase() === user.toLowerCase());
}
