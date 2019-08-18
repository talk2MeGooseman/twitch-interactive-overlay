const audioFiles = [
  {
    name: 'raid_alert',
    file: 'audio/alarm.wav',
    config: { volume: 0.05 },
  },
  {
    name: 'victory_short',
    file: 'short-tunes/BRPG_Victory_Stinger.wav',
    config: { volume: 0.1 },
  },
  {
    name: 'victory',
    file: 'short-tunes/BRPG_Victory_Stinger.wav',
    config: { volume: 0.1 },
    public: true,
  },
  {
    name: 'collect_coin',
    file: 'audio/collect-coin.wav',
    config: { volume: 0.05 },
  },
  {
    name: 'gameover',
    file: 'audio/game-over.wav',
    config: { volume: 0.05 },
    public: true,
  },
  {
    name: 'cheer',
    file: 'audio/cheer.wav',
    config: { volume: 0.15 },
  },
  {
    name: 'hello',
    file: 'audio/hello.wav',
    config: { volume: 0.15 },
    public: true,
  },
  {
    name: 'hosted',
    file: 'audio/hosted.wav',
    config: { volume: 0.15 },
  },
  {
    name: 'error',
    file: 'audio/error.wav',
    config: { volume: 0.15 },
    public: true,
  },
  {
    name: 'airhorn',
    file: 'audio/airhorn.mp3',
    config: { volume: 0.1 },
    public: true,
  },
  {
    name: 'quack',
    file: 'audio/quack.wav',
    config: { volume: 0.2 },
    public: true,
  },
  {
    name: 'explode',
    file: 'audio/explode.wav',
    config: { volume: 0.1 },
  },
  {
    name: 'boring',
    file: 'audio/boring.mp3',
    config: { volume: 0.15 },
    public: true,
  },
  {
    name: 'hmm',
    file: 'audio/hm.mp3',
    config: { volume: 0.1 },
    public: true,
  },
  {
    name: 'scream',
    file: 'audio/homer-scream.mp3',
    config: { volume: 0.1 },
    public: true,
  },
  {
    name: 'joke',
    file: 'audio/rimshot.mp3',
    config: { volume: 1.0 },
    public: true,
  },
];

/**
 * loops through audio files and loads them
 *
 * @export
 * @param {Phaser.Scene} scene
 */
export function loadAudio(scene) {
  audioFiles.map((audio) => scene.load.audio(audio.name, audio.file) );
}

/**
 * Add sounds to a given scene
 *
 * @export
 * @param {Phaser.Scene} scene
 */
export function addSoundToScene(scene) {
  audioFiles.map((audio) => scene.sound.add(audio.name, audio.config) );
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
  const audio = audioFiles.find((a) => {
    return a.name === command;
  });

  if (!audio) {
    return;
  }

  if (flags.broadcaster || audio.public) {
    scene.sound.play(command, audio.config);
  }
}
