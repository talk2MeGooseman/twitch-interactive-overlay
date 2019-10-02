export const AUDIO_COMMANDS = [
  {
    command: 'raid_alert',
    file: 'audio/alarm.wav',
    config: { volume: 0.05 },
    private: true,
  },
  {
    command: 'victory_short',
    file: 'short-tunes/BRPG_Victory_Stinger.wav',
    config: { volume: 0.1 },
    private: true,
  },
  {
    command: 'collect_coin',
    file: 'audio/collect-coin.wav',
    config: { volume: 0.05 },
    private: true,
  },
  {
    command: 'cheer',
    file: 'audio/cheer.wav',
    config: { volume: 0.15 },
    private: true,
  },
  {
    command: 'victory',
    file: 'short-tunes/BRPG_Victory_Stinger.wav',
    config: { volume: 0.1 },
  },
  {
    command: 'gameover',
    file: 'audio/game-over.wav',
    config: { volume: 0.05 },
  },
  {
    command: 'hello',
    file: 'audio/hello.wav',
    config: { volume: 0.15 },
  },
  {
    command: 'hosted',
    file: 'audio/hosted.wav',
    config: { volume: 0.15 },
  },
  {
    command: 'error',
    file: 'audio/error.wav',
    config: { volume: 0.15 },
  },
  {
    command: 'airhorn',
    file: 'audio/airhorn.mp3',
    config: { volume: 0.1 },
  },
  {
    command: 'quack',
    file: 'audio/quack.wav',
    config: { volume: 0.2 },
  },
  {
    command: 'explode',
    file: 'audio/explode.wav',
    config: { volume: 0.1 },
  },
  {
    command: 'boring',
    file: 'audio/boring.mp3',
    config: { volume: 0.15 },
  },
  {
    command: 'hmm',
    file: 'audio/hm.mp3',
    config: { volume: 0.1 },
  },
  {
    command: 'scream',
    file: 'audio/homer-scream.mp3',
    config: { volume: 0.1 },
  },
  {
    command: 'joke',
    file: 'audio/rimshot.mp3',
    config: { volume: 1.0 },
  },
  {
    command: 'humpday',
    file: 'audio/humpday.mp3',
    config: { volume: 1.0 },
  },
  {
    command: 'sadtrombone',
    file: 'audio/sadtrombone.mp3',
    config: { volume: 1.0 },
  },
  {
    command: 'slack',
    file: 'audio/slack-ping.mp3',
    config: { volume: 1.0 },
  },
  {
    command: 'sandiego',
    file: 'audio/sandiego.mp3',
    config: { volume: 0.75 },
  }
];

/**
 * loops through audio files and loads them
 *
 * @export
 * @param {Phaser.Scene} scene
 */
export function loadAudio(scene) {
  AUDIO_COMMANDS.map((audio) => scene.load.audio(audio.command, audio.file) );
}

/**
 * Add sounds to a given scene
 *
 * @export
 * @param {Phaser.Scene} scene
 */
export function addSoundToScene(scene) {
  AUDIO_COMMANDS.map((audio) => scene.sound.add(audio.command, audio.config) );
}

/**
 * Plays audio for a given command, checks flags to see
 * if user has access to audio playback
 *
 * @export
 * @param {Phaser.Scene} scene
 * @param {string} command
 * @param {Object} flags
 * @returns
 */
export function playAudio(scene, command, flags) {
  const audio = AUDIO_COMMANDS.find((a) => {
    return a.command === command;
  });

  if (!audio) {
    return;
  }

  if (flags.broadcaster || !audio.private) {
    scene.sound.play(command, audio.config);
  }
}
