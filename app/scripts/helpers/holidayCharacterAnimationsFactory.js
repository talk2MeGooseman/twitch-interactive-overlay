const characters = [
  {
    key: 'santa_die',
    start: 0,
    end: 14,
    prefix: 'santa/die/Dying_',
    repeat: 0,
  },
  {
    key: 'santa_jump',
    start: 0,
    end: 5,
    prefix: 'santa/jump/Jump Start_',
    repeat: 0,
  },
  {
    key: 'santa_run',
    start: 0,
    end: 14,
    prefix: 'santa/run/Running_',
    repeat: -1,
  },
  {
    key: 'santa_standing',
    start: 0,
    end: 11,
    prefix: 'santa/standing/Idle Blinking_',
    repeat: -1,
  },
  {
    key: 'santa_walk',
    start: 0,
    end: 17,
    prefix: 'santa/walk/Walking_',
    repeat: -1,
  },
  {
    key: 'snowman_die',
    start: 0,
    end: 14,
    prefix: 'snowman/die/Dying_',
    repeat: 0,
  },
  {
    key: 'snowman_jump',
    start: 0,
    end: 5,
    prefix: 'snowman/jump/Jump Start_',
    repeat: 0,
  },
  {
    key: 'snowman_run',
    start: 0,
    end: 11,
    prefix: 'snowman/run/Walking_',
    repeat: -1,
    rate: 10,
  },
  {
    key: 'snowman_standing',
    start: 0,
    end: 11,
    prefix: 'snowman/standing/Idle Blinking_',
    repeat: -1,
  },
  {
    key: 'snowman_walk',
    start: 0,
    end: 11,
    prefix: 'snowman/walk/Walking_',
    repeat: -1,
  },
];


function createAnimation(animation, scene) {
  var frameNames = scene.anims.generateFrameNames('holiday-characters', {
    start: animation.start,
    end: animation.end,
    zeroPad: 3,
    prefix: animation.prefix,
    suffix: '.png',
  });

  scene.anims.create({
    key: animation.key,
    frames: frameNames,
    frameRate: animation.rate || 5,
    repeat: animation.repeat,
  });
}

export function createHolidayAnimations(scene) {
  characters.forEach((animation) => {
    createAnimation(animation, scene);
  });
}
