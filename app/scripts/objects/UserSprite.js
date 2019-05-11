const V_JUMP = -400;
const V_WALK = 100;
const V_RUN = 200;

const RUN_THRESHOLD = 150;
const WALK = 0;
const RUN = 1;
const JUMP = 2;

import { isMoving, isSomethingOnTop, findSpriteInGroup } from '@/helpers/phaserHelpers';

export default class UserSprite extends Phaser.GameObjects.Sprite {
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
   * Removes user for provided group
   *
   * @static
   * @param {Phaser.Physics.Arcade.Group} userGroup
   * @param {UserSprite} user
   * @memberof UserSprite
   */
  static userParted(userGroup, user) {
    const sprite = findSpriteInGroup(userGroup, (sprite) => (sprite.user === user));
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
   * @returns UserSprite
   * @memberof UserSprite
   */
  static userExists(userGroup, user) {
    return findSpriteInGroup(userGroup, (sprite) => (sprite.user === user));
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
    const sprite = findSpriteInGroup(userGroup, (sprite) => (sprite.user === user));
    if (sprite) {
      sprite.jump();
    }
  }

  /**
   *  A simple prefab (extended game object class), displaying a spinning
   *  Phaser 3 logo.
   *
   *  @extends Phaser.GameObjects.Sprite
   */
  constructor(config) {
    const x = Phaser.Math.Between(0, 3000);
    super(config.scene, x, 0, config.key, config.frame);

    config.scene.physics.world.enable(this);
    config.scene.add.existing(this);

    this.type = 'user';
    this.user = config.user;
    this.flags = config.flags;
    this.stillFrame = config.frame;

    this.setSize(100, 200, true);
    this.setOrigin(0.5);
    this.anims.play('peasent_walk');

    this.initMovementTimer();
  }

  initMovementTimer() {
    const secDelay = Phaser.Math.Between(10000, 20000);

    this.timedEvent = this.scene.time.addEvent({
      delay: secDelay,
      callback: this.randomMovement,
      callbackScope: this,
      loop: false,
    });
  }

  randomMovement() {
    this.timedEvent.destroy();

    if (!isMoving(this)) {
      const action = Phaser.Math.Between(0, 2);

      if (action === WALK) {
        this.walk();
      } else if (action === RUN) {
        this.startRunning();
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
  }

  jump() {
    this.body.setVelocityY(V_JUMP);
  }

  update() {
    let anim;
    this.body.setDragX(10);

    const xSpeed = Math.abs(this.body.velocity.x);
    const ySpeed = Math.abs(this.body.velocity.y);

    if (isSomethingOnTop(this)) {
      let x = V_WALK;
      if (this.flipX) {
        x *= -1;
      }
      this.body.setVelocity(x, V_JUMP);
    }

    this.selectAnimation(ySpeed, anim, xSpeed);
    this.lookInWalkingDirection();
  }

  selectAnimation(ySpeed, anim, xSpeed) {
    if (ySpeed > 50 && !this.body.onFloor())
    {
      anim = 'peasent_jump';
    }
    if (ySpeed < 50)
    {
      if (xSpeed > 0 && xSpeed < RUN_THRESHOLD)
      {
        anim = 'peasent_walk';
      }
      else if (xSpeed >= RUN_THRESHOLD)
      {
        anim = 'peasent_run';
      }
    }
    if (this.body.velocity.x === 0 && this.body.velocity.y === 0)
    {
      this.anims.stop();
      this.setFrame(this.stillFrame);
    }

    this.setSpriteAnimation(anim);
  }

  moveToClosestSprite() {
    const closestObject = this.scene.physics.closest(this);
    if (closestObject.gameObject.type === 'coin') {
      this.scene.physics.moveToObject(this, closestObject, RUN_THRESHOLD);
    }
  }

  setSpriteAnimation(anim) {
    if (this.anims.currentAnim.key !== anim) {
      this.anims.play(anim);
    }
  }

  lookInWalkingDirection() {
    // Dont flip sprite if standing still
    if (this.body.velocity.x === 0) {
      return;
    }

    let flip = this.body.velocity.x < 0;
    this.setFlipX(flip);
  }

  remove() {
    this.scene.coinsGroup.remove(this);
    this.timedEvent.destroy();
    this.destroy();
  }
}
