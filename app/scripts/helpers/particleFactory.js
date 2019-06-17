/**
 * Creates the explosion particle emitter
 *
 * @export
 * @param {Phaser.Scene} scene
 * @returns {Phaser.GameObjects.Particles.ParticleEmitter} emitter
 */
export function buildExplosion(scene) {
  var particles = scene.add.particles('explosion');

  //  Setting { min: x, max: y } will pick a random value between min and max
  //  Setting { start: x, end: y } will ease between start and end

  particles.createEmitter({
    frame: ['smoke-puff', 'cloud', 'smoke-puff'],
    angle: { min: 240, max: 300 },
    speed: { min: 200, max: 300 },
    quantity: 6,
    lifespan: 2000,
    alpha: { start: 1, end: 0 },
    scale: { start: 1.5, end: 0.5 },
    on: false,
  });

  particles.createEmitter({
    frame: 'red',
    angle: { min: 0, max: 360, steps: 32 },
    lifespan: 1000,
    speed: 400,
    quantity: 32,
    scale: { start: 0.3, end: 0 },
    on: false,
  });

  particles.createEmitter({
    frame: 'muzzleflash2',
    lifespan: 200,
    scale: { start: 2, end: 0 },
    rotate: { start: 0, end: 180 },
    on: false,
  });

  return particles;
  // particles.emitParticleAt(pointer.x, pointer.y);
}
