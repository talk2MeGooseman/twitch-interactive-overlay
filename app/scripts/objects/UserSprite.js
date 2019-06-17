import {
  isMoving,
  isSomethingOnTop,
  renderText,
  setSpriteAnimation,
} from '@/helpers/phaserHelpers';
import SpeechBubble from '@/objects/SpeechBubble';

const V_JUMP = -400;
const V_WALK = 100;
const V_RUN = 200;

const RUN_THRESHOLD = 150;
const WALK = 0;
const RUN = 1;
// const JUMP = 2;

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

    this.body.onCollide = true;
    this.body.maxVelocity.x = V_RUN;

    this.nameText;
    this.speechBubble;
    this.spinEnabled = false;
    this.isDead = false;

    this.setSize(100, 200, true);
    this.setOrigin(0.5);
    this.anims.play('peasent_walk');

    this._timers = [];

    this.initMovementTimer();
  }

  displayNameText() {
    if (this.nameText) {
      return;
    }

    this.nameText = renderText(this.scene, this.user);
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

    this.speechBubble = new SpeechBubble(this.scene, 0, 0, 125, 50, message, extra);

    this._timers.push(
      this.scene.time.delayedCall(duration, () => {
        this.speechBubble ? this.speechBubble.destroy() : null;
      })
    );
  }

  initMovementTimer() {
    const secDelay = Phaser.Math.Between(10000, 20000);

    this._timers.push(
      this.scene.time.addEvent({
        delay: secDelay,
        callback: this.randomMovement,
        callbackScope: this,
        loop: false,
      })
    );
  }

  randomMovement() {
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
    if (this.body.blocked.down) {
      this.body.setVelocityY(V_JUMP);
    }
  }

  sendFlyingOnCollide() {
    this.body.setVelocityY(V_JUMP * 2);
  }

  makeDbag() {
    this.isDbag = true;
    this.body.setImmovable(true);
    this.startRunning();
    this.body.setDragX(0);
    this.displaySpeechBubble('RAWRR!!!', null, 10000);

    this._timers.push(
      this.scene.time.delayedCall(10000, this.disableDbag, [], this)
    );
  }

  disableDbag() {
    this.isDbag = false;
    this.body.setDragX(100);
    this.body.setImmovable(false);
  }

  doTackle(spriteTarget) {
    this.body.setImmovable(true);
    this.body.maxVelocity.x = 10000000;

    this.scene.physics.moveToObject(this, spriteTarget, RUN_THRESHOLD, 1000);
    this.displaySpeechBubble('BOOLI!!!', null, 2000);
    this._timers.push(
      this.scene.time.delayedCall(1100, () => {
        this.body.setImmovable(false);
        this.body.maxVelocity.x = V_RUN;
      }, [], this)
    );
  }

  doSpin() {
    this.spinEnabled = true;
    this.displaySpeechBubble('WEEEE!!!', null, 5000);
    this._timers.push(
      this.scene.time.delayedCall(5000, () => (this.spinEnabled = false), [], this)
    );
  }

  makeGiant() {
    this.setScale(4);
    this._timers.push(
      this.scene.time.delayedCall(20000, () => (this.setScale(1)), [], this)
    );
  }

  update() {
    const xSpeed = Math.abs(this.body.velocity.x);
    const ySpeed = Math.abs(this.body.velocity.y);

    if (this.isDead) {
      this.body.setVelocity(0, 300);
      this.selectAnimation();
      return;
    }

    if (isSomethingOnTop(this)) {
      let x = V_WALK;
      if (this.flipX) {
        x *= -1;
      }
      this.body.setVelocity(x, V_JUMP);
    }

    if (this.spinEnabled) {
      const v = this.flipX ? -300 : 300;
      this.body.setAngularAcceleration(v);
    } else {
      this.body.setAngularAcceleration(0);
      this.setRotation(0);
    }

    this.selectAnimation(xSpeed, ySpeed);
    this.lookInWalkingDirection();

    this.moveText();
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

  selectAnimation(xSpeed, ySpeed) {
    let anim;
    if (this.isDead) {
      anim = 'peasent_die';
      setSpriteAnimation(this, anim);
      return;
    }

    if (ySpeed > 50 && !this.body.onFloor()) {
      anim = 'peasent_jump';
    }
    if (ySpeed < 50) {
      if (xSpeed > 0 && xSpeed < RUN_THRESHOLD) {
        anim = 'peasent_walk';
      } else if (xSpeed >= RUN_THRESHOLD) {
        anim = 'peasent_run';
      }
    }
    if (this.body.velocity.x === 0 && this.body.velocity.y === 0) {
      this.anims.stop();
      this.setFrame(this.stillFrame);
    }

    setSpriteAnimation(this, anim);
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
    this.isDead = true;

    this._timers.push(
      this.scene.time.delayedCall(10000, () => {
        this.scene.userGroup.remove(this);

        this._timers.map((t) => t.destroy());

        if (this.nameText) {
          this.scene.nameTextGroup.remove(this.nameText);
          this.nameText.destroy();
        }
        this.destroy();
      }, [], this)
    );
  }
}
