import {
  findSpriteInGroup,
} from '@/helpers/phaserHelpers';
import UserSprite from '@/objects/UserSprite';

export default class userSpriteHelpers {

  /**
   * Makes all uses sprites perform the wave
   *
   * @static
   * @param {Phaser.GameObjects.Group} group
   * @param {string} user
   * @memberof userSpriteHelpers
   */
  static triggerTheWave(group, scene) {
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
   * @param {string} user
   * @memberof userSpriteHelpers
   */
  static chatBubbleAllSprites(group, message) {
    group.getChildren().forEach(user => {
      user.displaySpeechBubble(message);
    });
  }

  /**
   * Creates and adds User Sprite if one doesn't already exist
   *
   * @param {Phaser.GameObjects.Group} group
   * @param {string} user
   * @param {*} flags
   * @returns {UserSprite} sprite
   * @memberof Game
   */
  static createOrFindUser(group, scene, user, flags) {
    let sprite = userSpriteHelpers.userExists(group, user);

    if (sprite) {
      return sprite;
    }

    const spriteConfig = {
      scene: scene,
      key: 'characters',
      frame: 'Peasant/standing/peasant.png',
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
   * @param {UserSprite} user
   * @memberof UserSprite
   */
  static userParted(userGroup, user) {
    const sprite = userSpriteHelpers.userExists(userGroup, user);
    if (sprite) {
      sprite.remove();
    }
  }

  /**
   * Removes user for provided group
   *
   * @static
   * @param {Phaser.Physics.Arcade.Group} userGroup
   * @param {UserSprite} user
   * @memberof UserSprite
   */
  static die(userGroup, user) {
    const sprite = userSpriteHelpers.userExists(userGroup, user);
    if (sprite) {
      sprite.remove();
    }
  }

  /**
   * Check if user exists is group
   *
   * @static
   * @param {Phaser.Physics.Arcade.Group} userGroup
   * @param {UserSprite} user
   * @returns {UserSprite}
   * @memberof UserSprite
   */
  static userExists(userGroup, user) {
    return findSpriteInGroup(userGroup, sprite => sprite.user.toLowerCase() === user.toLowerCase());
  }

  /**
   * Finds and triggers jump animation for sprite
   *
   * @static
   * @param {Phaser.Physics.Arcade.Group} userGroup
   * @param {UserSprite} user
   * @memberof UserSprite
   */
  static jumpUserSprite(userGroup, user) {
    const sprite = userSpriteHelpers.userExists(userGroup, user);
    if (sprite) {
      sprite.jump();
    }
  }

  /**
   * Make the provided sprite in the group run
   *
   * @static
   * @param {Phaser.GameObjects.Group} userGroup
   * @param {UserSprite} user
   * @memberof UserSprite
   */
  static runUserSprite(userGroup, user) {
    const sprite = userSpriteHelpers.userExists(userGroup, user);

    if (sprite) {
      sprite.startRunning();
    }
  }

  /**
   * Spin user sprite
   *
   * @static
   * @param {Phaser.GameObjects.Group} userGroup
   * @param {UserSprite} user
   * @memberof UserSprite
   */
  static spin(userGroup, user) {
    const sprite = userSpriteHelpers.userExists(userGroup, user);

    if (sprite) {
      sprite.doSpin();
    }
  }

  /**
   * Make the sprite giant
   *
   * @static
   * @param {Phaser.GameObjects.Group} userGroup
   * @param {UserSprite} user
   * @memberof UserSprite
   */
  static mushroom(userGroup, user) {
    const sprite = userSpriteHelpers.userExists(userGroup, user);

    if (sprite) {
      sprite.makeGiant();
    }
  }

  /**
   * Turn sprite in to a total dbag
   *
   * @static
   * @param {Phaser.GameObjects.Group} userGroup
   * @param {UserSprite} user
   * @memberof UserSprite
   */
  static dbagMode(userGroup, user) {
    const sprite = userSpriteHelpers.userExists(userGroup, user);

    if (sprite) {
      sprite.makeDbag();
    }
  }

  /**
   * Turn sprite in to a total dbag
   *
   * @static
   * @param {Phaser.GameObjects.Group} userGroup
   * @param {UserSprite} user
   * @memberof UserSprite
   */
  static tackle(userGroup, user, message) {
    const match = /@(\w+)/g.exec(message);
    if (!match) {
      return;
    }

    const sprite = userSpriteHelpers.userExists(userGroup, user);
    const spriteTarget = userSpriteHelpers.userExists(userGroup, match[1]);

    if (sprite && spriteTarget) {
      sprite.doTackle(spriteTarget);
    }
  }

}