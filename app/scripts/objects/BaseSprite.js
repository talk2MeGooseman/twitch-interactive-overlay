export default class BaseSprite extends Phaser.GameObjects.Sprite {
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
   *Creates an instance of BaseSprite.
   * @param {Object} { scene, key, frame }
   * @memberof BaseSprite
   */
  constructor({ scene, key, frame }) {
    const totalHeight = scene.game.config.height;
    const totalWidth = scene.game.config.width;

    const x = Phaser.Math.Between(0, totalWidth);
    const spawnPositionY = scene.physics.world.gravity.y < 0
      ? totalHeight
      : 0;

    super(scene, x, spawnPositionY, key, frame);

    scene.physics.world.enable(this);
    scene.add.existing(this);

    this._timers = [];
  }

  createDelayedCall(duration, callback) {
    this._timers.push(this.scene.time.delayedCall(duration, callback, [], this));
  }

  /**
   * Returns true if gravity is reversed
   *
   * @returns {Boolean}
   */
  get isGravityReversed() {
    return this.scene.physics.world.gravity.y < 0;
  }

  get gravityModifier() {
    return this.isGravityReversed ? -1 : 1;
  }

  get onGround() {
    return this.isGravityReversed
      ? this.body.blocked.up
      : this.body.blocked.down;
  }

  destroyTimers() {
    this._timers.map(t => t.destroy());
  }
}
