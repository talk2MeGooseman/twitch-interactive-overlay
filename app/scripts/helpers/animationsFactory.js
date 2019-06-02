function createWalkingAnimation(scene) {
  var frameNames = scene.anims.generateFrameNames('characters', {
    start: 1,
    end: 8,
    zeroPad: 3,
    prefix: 'Peasant/walk/peasant_walk_',
    suffix: '.png',
  });

  scene.anims.create({ key: 'peasent_walk', frames: frameNames, frameRate: 5, repeat: -1 });
}

function createRunningAnimation(scene) {
  var frameNames = scene.anims.generateFrameNames('characters', {
    start: 1,
    end: 8,
    zeroPad: 3,
    prefix: 'Peasant/run/peasant_run_',
    suffix: '.png',
  });

  scene.anims.create({ key: 'peasent_run', frames: frameNames, frameRate: 10, repeat: -1 });
}

function createJumpAnimation(scene) {
  var frameNames = scene.anims.generateFrameNames('characters', {
    start: 1,
    end: 4,
    zeroPad: 3,
    prefix: 'Peasant/jump/peasant_jump_',
    suffix: '.png',
  });

  scene.anims.create({ key: 'peasent_jump', frames: frameNames, frameRate: 10, repeat: 0 });
}

function createDieAnimation(scene) {
  var frameNames = scene.anims.generateFrameNames('characters', {
    start: 1,
    end: 5,
    zeroPad: 3,
    prefix: 'Peasant/die/peasant_die_',
    suffix: '.png',
  });

  scene.anims.create({ key: 'peasent_die', frames: frameNames, frameRate: 10, repeat: 0 });
}

function createCoinAnimation(scene) {
  var frameNames = scene.anims.generateFrameNames('items', {
    start: 1,
    end: 8,
    zeroPad: 4,
    prefix: 'coin/',
    suffix: '.png',
  });

  scene.anims.create({ key: 'coin_spin', frames: frameNames, frameRate: 10, repeat: -1 });
}

function createBlueGemAnimation(scene) {
  var frameNames = scene.anims.generateFrameNames('items', {
    start: 0,
    end: 6,
    zeroPad: 4,
    prefix: 'gems/blue/frame',
    suffix: '.png',
  });

  scene.anims.create({ key: 'gem_blue_spin', frames: frameNames, frameRate: 10, repeat: -1 });
}

function createRedGemAnimation(scene) {
  var frameNames = scene.anims.generateFrameNames('items', {
    start: 0,
    end: 6,
    zeroPad: 4,
    prefix: 'gems/red/frame',
    suffix: '.png',
  });

  scene.anims.create({ key: 'gem_red_spin', frames: frameNames, frameRate: 10, repeat: -1 });
}

export default function animationsFactory(scene) {
  createWalkingAnimation(scene);
  createRunningAnimation(scene);
  createJumpAnimation(scene);
  createCoinAnimation(scene);
  createDieAnimation(scene);
  createBlueGemAnimation(scene);
  createRedGemAnimation(scene);
}
