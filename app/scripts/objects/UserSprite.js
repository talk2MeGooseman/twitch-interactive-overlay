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
    super(config.scene, 0, 0, config.key, config.frame);

    config.scene.physics.world.enable(this);
    config.scene.add.existing(this);

    const x = config.scene.cameras.main.width / 2;
    const y = config.scene.cameras.main.height / 2;

    this.user = config.user;
    this.flags = config.flags;

    this.setSize(100, 200, true);
    this.setScale(0.5);
    this.setPosition(x, y);
    this.setOrigin(0.5);
  }

  walk() {
    this.body.setVelocityX(100);
  }

  startRunning() {
    this.body.setVelocityX(200);
  }

  /**
   *  Update sprite actions
   */
  update() {
    const currentSpeed = Math.abs(this.body.velocity.x);

    if ( currentSpeed > 0 && currentSpeed < 200) {
      this.anims.play('peasent_walk', true);
    } else if(currentSpeed >= 200) {
      this.anims.play('peasent_run', true);
    }

    this.lookInWalkingDirection();
  }

  lookInWalkingDirection() {
    let flip = this.body.velocity.x < 0;
    this.setFlipX(flip);
  }
}
