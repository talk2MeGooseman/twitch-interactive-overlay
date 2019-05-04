const V_JUMP = -400;
const RUN_THRESHOLD = 150;

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
    const x = Phaser.Math.Between(0, 3000)
    super(config.scene, x, 0, config.key, config.frame);

    config.scene.physics.world.enable(this);
    config.scene.add.existing(this);

    this.user = config.user;
    this.flags = config.flags;
    this.stillFrame = config.frame;

    this.setSize(100, 200, true);
    this.setOrigin(0.5);
    this.anims.play('peasent_walk');
  }

  walk() {
    this.body.setVelocityX(100);
  }

  startRunning() {
    let v = 200;
    if(this.flipX) {
      v *= -1;
    }
    this.body.setVelocityX(v);
  }

  jump() {
    this.body.setVelocityY(V_JUMP);
  }

  /**
   *  Update sprite actions
   */
  update() {
    let anim;
    this.body.setDragX(10);
    const xSpeed = Math.abs(this.body.velocity.x);
    const ySpeed = Math.abs(this.body.velocity.y);

    if (ySpeed > 50 && !this.body.blocked.down) {
      anim = 'peasent_jump';
    }

    if (ySpeed < 50) {
      if (xSpeed > 0 && xSpeed < RUN_THRESHOLD) {
        anim = 'peasent_walk';
      } else if (xSpeed >= RUN_THRESHOLD) {
        anim  = 'peasent_run';
      }
    }

    if (this.body.velocity.x === 0 && this.body.velocity.y === 0) {
      this.anims.stop();
      this.setFrame(this.stillFrame);
    }

    this.setSpriteAnimation(anim);
    this.lookInWalkingDirection();
  }

  setSpriteAnimation(anim) {
    if (
      this.anims.currentAnim.key !== anim
    ) {
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
}
