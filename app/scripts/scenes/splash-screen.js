import animationsFactory from '@/helpers/animationsFactory';

export default class SplashScreen extends Phaser.Scene {
  /**
   *  Takes care of loading the main game assets, including textures, tile
   *  maps, sound effects and other binary files, while displaying a busy
   *  splash screen.
   *
   *  @extends Phaser.Scene
   */
  constructor() {
    super({
      key: 'SplashScreen',

      //  Splash screen and progress bar textures.
      pack: {
        files: [{
          key: 'splash-screen',
          type: 'image'
        }, {
          key: 'progress-bar',
          type: 'image'
        }]
      }
    });

  }

  /**
   *  Show the splash screen and prepare to load game assets.
   *
   *  @protected
   */
  preload() {
    //  Display cover and progress bar textures.
    this.showCover();
    this.showProgressBar();

    //  HINT: Declare all game assets to be loaded here.
    this.load.image('logo');
    this.load.multiatlas('characters', 'characters.json');
    this.load.multiatlas('items', 'items.json');

    this.load.audio('raid_alert', 'alarm.wav');
    this.load.audio('victory_short', 'short-tunes/BRPG_Victory_Stinger.wav');
    this.load.audio('victory', 'short-tunes/BRPG_Victory_Music_Loop.wav');
    this.load.audio('collect_coin', 'collect-coin.wav');
    this.load.audio('game_over', 'game-over.wav');
    this.load.audio('cheer', 'cheer.wav');
    this.load.audio('hello', 'hello.wav');
    this.load.audio('hosted', 'hosted.wav');
    this.load.audio('error', 'error.wav');
  }

  /**
   *  Set up animations, plugins etc. that depend on the game assets we just
   *  loaded.
   *
   *  @protected
   */
  create() {
    animationsFactory(this);
    //  We have nothing left to do here. Start the next scene.
    this.scene.start('Game');
  }

  //  ------------------------------------------------------------------------

  /**
   *  Show the splash screen cover.
   *
   *  @private
   */
  showCover() {
    this.add.image(0, 0, 'splash-screen').setOrigin(0);
  }

  /**
   *  Show the progress bar and set up its animation effect.
   *
   *  @private
   */
  showProgressBar() {
    //  Get the progress bar filler texture dimensions.
    const {width: w, height: h} = this.textures.get('progress-bar').get();

    //  Place the filler over the progress bar of the splash screen.
    const img = this.add.sprite(82, 282, 'progress-bar').setOrigin(0);

    //  Crop the filler along its width, proportional to the amount of files
    //  loaded.
    this.load.on('progress', v => img.setCrop(0, 0, Math.ceil(v * w), h));
  }
}
