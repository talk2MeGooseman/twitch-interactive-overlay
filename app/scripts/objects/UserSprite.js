import * as phaserHelpers from '../helpers/phaserHelpers';
import BaseSprite from '@/objects/BaseSprite';
import SpeechBubble from '@/objects/SpeechBubble';
import {
  PEASANT,
  KNIGHT,
  SKELETON,
} from '@/constants/characters';
import { getUserIntItem, setUserItem } from '@/helpers/PersistedStorage';

const V_JUMP = -400;
const V_WALK = 100;
const V_RUN = 200;

const RUN_THRESHOLD = 150;
const WALK = 0;
// const RUN = 1;
// const JUMP = 2;

export default class UserSprite extends BaseSprite {
  /**
      Potential cool physics body methods

      blocked :ArcadeBodyCollision
      Whether this Body is colliding with a tile or the world boundary.

      collideWorldBounds :boolean
      Whether this Body interacts with the world boundary.

      embedded :boolean
      Whether this Body is overlapped with another and both are not moving.

      immovable :boolean
      Whether this Body can be moved by collisions with another Body.

      touching :ArcadeBodyCollision
      Whether this Body is colliding with another and in which direction.

      destroy()
      Disables this Body and marks it for deletion by the simulation.

      onFloor()
      Whether this Body is touching a tile or the world boundary while moving down.

      stop()
      Sets acceleration, velocity, and speed to zero.
   */

  /**
   * Makes all uses sprites perform the wave
   *
   * @static
   * @param {Phaser.GameObjects.Group} group
   * @param {Phaser.Scene} scene
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
   * @param {String} message
   */
  static chatBubbleAllSprites(group, message) {
    group.getChildren().forEach(user => {
      user.displaySpeechBubble(message);
    });
  }

  /**
   * Removes user for provided group
   *
   * @static
   * @param {Phaser.Physics.Arcade.Group} userGroup
   * @param {String} user
   * @memberof UserSprite
   */
  static userParted(userGroup, user) {
    const sprite = UserSprite.userExists(userGroup, user);
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
  static userExists(userGroup, user) {
    return phaserHelpers.findSpriteInGroup(userGroup, sprite => sprite.user.toLowerCase() === user.toLowerCase());
  }

  /**
   * Creates and adds User Sprite if one doesn't already exist
   *
   * @param {Phaser.GameObjects.Group} group
   * @param {String} user
   * @param {Object} flags
   * @returns {UserSprite} sprite
   */
  static createOrFindUser(group, scene, user, flags) {
    let sprite = UserSprite.userExists(group, user);

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
   *  A simple prefab (extended game object class), displaying a spinning
   *  Phaser 3 logo.
   *
   *  @extends Phaser.GameObjects.Sprite
   */
  constructor(config) {
    super(config);

    this.type = 'user';
    // Default character type
    this.changeCharacter(PEASANT);

    this.user = config.user;
    this.flags = config.flags;

    if (this.flags && this.flags.subscriber) {
      this.changeCharacter(KNIGHT);
    }

    this.stillFrame = config.frame;
    this.body.onCollide = true;
    this.body.maxVelocity.x = V_RUN;

    this.nameText;
    this.speechBubble;
    this.spinEnabled = false;
    this.isDead = false;
    this.running = false;
    /** If the sprite is not touching the ground then it should be a skeleton */
    this.knitCodeMonkeyState = false;

    this.setOrigin(0.5);

    this.anims.play(`${this.character}_walk`);

    config.scene.events.on('userChatAction', this.handleChatEvent, this);

    this.initMovementTimer();
  }

  handleChatEvent({ user, message, flags, method, args, applyAll = false }) {
    if (user.toLowerCase() === this.user.toLowerCase()) {
      this.setFlags(flags);
    } else if (!applyAll) {
      return;
    }

    if (this.isDead) {
      return;
    }

    const func = this[method];
    if (func) {
      if (args) {
        func.call(this, args);
      } else {
        func.call(this, message, flags);
      }
    }
  }

  update() {
    // Attempt to adjust hitbox of sprite
    const frame = this.anims.currentAnim.getFrameAt(0).frame;
    this.body.setSize(frame.width, frame.height);

    if (this.isDead) {
      this.body.setVelocity(0, 300);
      this.selectAnimation();
      return;
    }

    if (this.knitCodeMonkeyState && this.onGround) {
      this.knitCodeMonkeyState = false;
      this.changeCharacter(this.ogCharacter);
    }

    if (phaserHelpers.isSomethingOnTop(this)) {
      let x = V_WALK;
      if (this.flipX) {
        x *= -1;
      }
      this.body.setVelocity(x, V_JUMP * this.gravityModifier);
    }

    if (this.spinEnabled) {
      const v = this.flipX ? -600 : 600;
      this.body.setAngularVelocity(v);
    } else {
      this.body.setAngularVelocity(0);
      this.setRotation(0);
    }

    if (this.running) {
      let x = V_RUN;
      if (this.flipX) {
        x *= -1;
      }

      this.body.setVelocityX(x);
    }

    this.selectAnimation();
    this.lookInWalkingDirection();

    this.moveText();
  }

  waveJump() {
    this.createDelayedCall(this.x, () => {
      this.jump();
    });
  }

  setFlags(flags) {
    this.flags = flags;
    if (flags.subscriber && this.character === PEASANT) {
      this.changeCharacter(KNIGHT);
    }
  }

  changeCharacter(character) {
    this.character = character;
  }

  displayNameText() {
    if (this.nameText) {
      return;
    }

    this.nameText = phaserHelpers.renderText(this.scene, this.user);
    this.nameText.setOrigin(0.5, 1);
    this.scene.nameTextGroup.add(this.nameText);
  }

  /**
   *
   *
   * @param {string} message
   * @param {object} extra
   * @param {number} [duration=10000]
   * @memberof UserSprite
   */
  displaySpeechBubble(message, extra, duration = 10000) {
    if (this.speechBubble) {
      this.speechBubble.destroy();
    }

    this.speechBubble = new SpeechBubble(
      this.scene,
      0,
      0,
      125,
      50,
      message,
      extra
    );

    this.createDelayedCall(duration, () => {
      this.speechBubble ? this.speechBubble.destroy() : null;
    });
  }

  initMovementTimer() {
    const secDelay = Phaser.Math.Between(10000, 20000);

    this.createDelayedCall(secDelay, () => {
      this.randomMovement();
    });
  }

  randomMovement() {
    if (!phaserHelpers.isMoving(this)) {
      const action = Phaser.Math.Between(0, 1);

      if (action === WALK) {
        this.walk();
      } else {
        this.jump();
      }
    }

    this.initMovementTimer();
  }

  walk() {
    const velocity = Phaser.Math.Between(0, 1) ? V_WALK : V_WALK * -1;
    this.body.setVelocityX(velocity);
  }

  startRunning() {
    let v = V_RUN;
    if (this.flipX) {
      v *= -1;
    }

    this.body.setVelocityX(v);
    this.running = true;
    this.createDelayedCall(2000, () => {
      this.running = false;
    });
  }

  jump() {
    if (this.onGround) {
      this.body.setVelocityY(V_JUMP * this.gravityModifier);
    }
  }

  sendFlyingOnCollide({ skeleton }) {
    this.body.setVelocityY(V_JUMP * 2 * this.gravityModifier);

    if (skeleton && !this.knitCodeMonkeyState) {
      this.knitCodeMonkeyState = true;
      this.ogCharacter = this.character;
      this.changeCharacter(SKELETON);
    }
  }

  makeDbag() {
    this.isDbag = true;
    this.body.setImmovable(true);
    this.startRunning();
    this.body.setDragX(0);
    this.displaySpeechBubble('RAWRR!!!', null, 10000);

    this.createDelayedCall(10000, () => this.disableDbag());
  }

  disableDbag() {
    this.isDbag = false;
    this.body.setDragX(100);
    this.body.setImmovable(false);
  }

  /**
   * Tackles an @mentioned user
   *
   * @param {string} message Must be string with @mention
   * @returns
   * @memberof UserSprite
   */
  tackle(message) {
    const match = /@(\w+)/g.exec(message);
    if (!match) {
      return;
    }

    const spriteTarget = UserSprite.userExists(this.scene.userGroup, match[1]);

    if (!spriteTarget) {
      return;
    }

    this.body.setImmovable(true);
    this.body.maxVelocity.x = 10000000;

    this.scene.physics.moveToObject(this, spriteTarget, RUN_THRESHOLD, 1000);
    this.displaySpeechBubble('BOOLI!!!', null, 2000);

    this.createDelayedCall(1100, () => {
      this.body.setImmovable(false);
      this.body.maxVelocity.x = V_RUN;
    });
  }

  spin() {
    this.spinEnabled = true;
    this.displaySpeechBubble('WEEEE!!!', null, 5000);

    this.createDelayedCall(
      5000,
      () => (this.spinEnabled = false),
    );
  }

  makeGiant() {
    this.setScale(4);
    // Attempting to adjust hitbox of sprite
    const frame = this.anims.currentAnim.getFrameAt(0).frame;
    this.body.setSize(frame.width, frame.height);
    this.createDelayedCall(20000, () => this.setScale(1));
  }

  moveText() {
    const yPosition = this.y - this.height * 0.5;

    if (this.nameText) {
      this.nameText.setPosition(this.x, yPosition);
    }

    if (this.speechBubble) {
      this.speechBubble.setPosition(this.x, this.y - this.height);
    }
  }

  selectAnimation() {
    const xSpeed = Math.abs(this.body.velocity.x);
    const ySpeed = Math.abs(this.body.velocity.y);

    let anim;
    if (this.isDead) {
      anim = `${this.character}_die`;
      phaserHelpers.setSpriteAnimation(this, anim);
      return;
    }

    if (xSpeed > 0 && xSpeed < RUN_THRESHOLD) {
      anim = `${this.character}_walk`;
    } else if (xSpeed >= RUN_THRESHOLD) {
      anim = `${this.character}_run`;
    }

    if (!this.body.onFloor() && ySpeed > 50) {
      anim = `${this.character}_jump`;
    }

    if (!anim && this.body.onFloor()) {
      anim = `${this.character}_standing`;
    }

    phaserHelpers.setSpriteAnimation(this, anim);
  }

  lookInWalkingDirection() {
    // Dont flip sprite if standing still
    if (this.body.velocity.x === 0) {
      return;
    }

    let flip = this.body.velocity.x < 0;
    this.setFlipX(flip);
  }

  sayCoinsCount() {
    const coins = getUserIntItem(this, 'coins') || 0;
    this.displaySpeechBubble(`I have ${coins} coins :)`, null, 10000);
  }

  coinCollected(amount) {
    let coins = getUserIntItem(this, 'coins') || 0;
    coins += amount;
    setUserItem(this, 'coins', coins);
  }

  lurk() {
    this.displaySpeechBubble('lurk sha sha');
    this.removeNameTag();
  }

  remove() {
    this.isDead = true;

    this.createDelayedCall(
      10000,
      () => {
        this.scene.userGroup.remove(this);

        this.scene.events.removeListener(
          'userChatAction',
          this.handleChatEvent,
          this
        );

        this.destroyTimers();
        this.removeNameTag();
        this.destroy();
      }
    );
  }

  /**
   * Remove the name tag above the sprites head
   *
   * @memberof UserSprite
   */
  removeNameTag() {
    if (this.nameText) {
      this.scene.nameTextGroup.remove(this.nameText);
      this.nameText.destroy();
    }
  }
}
