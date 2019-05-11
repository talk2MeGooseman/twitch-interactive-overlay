import UserSprite from '@/objects/UserSprite';
import ComfyJS from 'comfy.js';
import Coin from '@/objects/Coin';
import { OAUTH_TOKEN } from '@/secrets';

export default class Game extends Phaser.Scene {
  /**
   *  A sample Game scene, displaying the Phaser logo.
   *
   *  @extends Phaser.Scene
   */
  constructor() {
    super({ key: 'Game' });
  }

  /**
   *  Called when a scene is initialized. Method responsible for setting up
   *  the game objects of the scene.
   *
   *  @protected
   *  @param {object} data Initialization parameters.
   */
  create(/* data */) {
    this.initComfy();

    this.userGroup = this.physics.add.group({
      bounceX: 1,
      bounceY: 0.5,
      collideWorldBounds: true,
    });

    this.coinsGroup = this.physics.add.group({
      bounceX: 1,
      bounceY: 0.5,
      collideWorldBounds: true,
    });

    // Update Physics collider with new sprites
    this.physics.add.collider(this.userGroup);
    this.physics.add.collider(this.coinsGroup);

    // Check if user touches coin
    this.physics.add.overlap(this.coinsGroup, this.userGroup, this.collectCoin);
    // Add in dummy sprite
    this.setupAudio();
  }

  setupAudio() {
    this.raidAlert = this.sound.add('raid_alert', { volume: 0.05 });
    this.victoryShort = this.sound.add('victory_short', { volume: 0.10 });
    this.collectCoinAudio = this.sound.add('collect_coin', { volume: 0.05 });
  }

  initComfy() {
    ComfyJS.Init('talk2megooseman');

    ComfyJS.onCommand = (user, command, message, flags) => {
      if (command == 'join') {
        this.addUserSprite(user, flags);
      } else if (command == 'run') {
        this.setRunUserSprite(user, flags);
      } else if (command == 'jump') {
        UserSprite.jumpUserSprite(this.userGroup, user);
      } else if (command === 'alert' && flags.broadcaster) {
        this.raidAlert.play();
      } else if (command === 'hype' && flags.broadcaster) {
        this.victoryShort.play();
      }
    };

    ComfyJS.onJoin = (user, self) => this.addUserSprite(user);

    ComfyJS.onPart = user => UserSprite.userParted(this.userGroup, user);

    ComfyJS.onChat = (user, message, flags, self, extra) =>
      this.addUserSprite(user, flags);

    ComfyJS.onCheer = (message, bits, extra) => this.addCoins(bits);

    ComfyJS.onHosted = (user, viewers, autohost) => {};

    ComfyJS.onRaid = (user, viewers) => {
      this.raidAlert.play();
    };

    ComfyJS.onSub = (user, message, subTierInfo, extra) => this.victoryShort.play();

    ComfyJS.onResub = (
      user,
      message,
      streamMonths,
      cumulativeMonths,
      subTierInfo,
      extra
    ) => this.victoryShort.play();

    ComfyJS.onSubGift = (
      gifterUser,
      streakMonths,
      recipientUser,
      senderCount,
      subTierInfo,
      extra
    ) => this.victoryShort.play();

    ComfyJS.onSubMysteryGift = (
      gifterUser,
      numbOfSubs,
      senderCount,
      subTierInfo,
      extra
    ) => this.victoryShort.play();

    ComfyJS.onGiftSubContinue = (user, sender, extra) =>
      this.victoryShort.play();
  }

  addCoins(amount) {
    for (var i = 0; i < amount; i++) {
      const coin = new Coin(this);
      this.coinsGroup.add(coin);
    }
  }

  addUserSprite(user, flags) {
    if (UserSprite.userExists(this.userGroup, user)) {
      return;
    }

    const spriteConfig = {
      scene: this,
      key: 'characters',
      frame: 'Peasant/standing/peasant.png',
      user: user,
      flags: flags,
    };

    let newUser = new UserSprite(spriteConfig);

    this.userGroup.add(newUser);
    newUser.walk();
  }

  setRunUserSprite(user) {
    const sprite = UserSprite.userExists(this.userGroup, user);
    if(sprite) {
      sprite.startRunning();
    }
  }

  /**
   *  Called when a scene is updated. Updates to game logic, physics and game
   *  objects are handled here.
   *
   *  @protected
   *  @param {number} t Current internal clock time.
   *  @param {number} dt Time elapsed since last update.
   */
  update(/* t, dt */) {
    // Call update on all sprites in our group
    this.userGroup.getChildren().forEach(user => {
      // this.physics.moveToObject()
      user.update();
    });

    this.coinsGroup.getChildren().forEach(coin => {
      coin.update();
    });
  }

  collectCoin(coinSprite, userSprite) {
    coinSprite.grabbed();
  }

  userCollision(s1, s2) {
    debugger;
  }
}
