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

    // Add in dummy sprite
    this.addUserSprite();
    this.setupAudio();
  }

  setupAudio() {
    this.raidAlert = this.sound.add('raid_alert');
    this.victoryShort = this.sound.add('victory_short');
  }

  initComfy() {
    ComfyJS.Init('talk2megooseman', OAUTH_TOKEN);

    ComfyJS.onCommand = (user, command, message, flags) => {
      if (command == 'join') {
        this.addUserSprite(user, flags);
      } else if (command == 'run') {
        this.setRunUserSprite(user, flags);
      } else if (command == 'jump') {
        this.jumpUserSprite(user, flags);
      } else if (command === 'alert' && flags.broadcaster) {
        this.raidAlert.play();
      } else if (command === 'hype' && flags.broadcaster) {
        this.victoryShort.play();
      }
    };

    ComfyJS.onJoin = (user, self) => {
      this.addUserSprite(user);
    };

    ComfyJS.onChat = (user, message, flags, self, extra) => (this.addUserSprite(user, flags));

    ComfyJS.onCheer = (message, bits, extra) => (this.addCoins(bits));


    ComfyJS.onHosted = ( user, viewers, autohost ) => {
    };

    ComfyJS.onRaid = ( user, viewers ) => {
      this.raidAlert.play();
    };

    ComfyJS.onPart = ( user ) => {
    };

    ComfyJS.onSub = ( user, message, subTierInfo, extra ) => (this.victoryShort.play());
    ComfyJS.onResub = ( user, message, streamMonths, cumulativeMonths, subTierInfo, extra ) => (this.victoryShort.play());
    ComfyJS.onSubGift = ( gifterUser, streakMonths, recipientUser, senderCount, subTierInfo, extra ) => (this.victoryShort.play());
    ComfyJS.onSubMysteryGift = ( gifterUser, numbOfSubs, senderCount, subTierInfo, extra ) => (this.victoryShort.play());
    ComfyJS.onGiftSubContinue = ( user, sender, extra ) => (this.victoryShort.play());
  }

  addCoins(amount) {
    for(var i = 0; i < amount; i++) {
      const coin = new Coin(this);
      this.coinsGroup.add(coin);
    }

    this.physics.add.collider(this.coinsGroup, this.userGroup);
  }

  addUserSprite(user, flags) {
    if (this.userExists(user)) {
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
    // Update Physics collider with new sprites
    this.physics.add.collider(this.userGroup);
    newUser.walk();
  }

  userExists(user) {
    return this.userGroup.getChildren().find(sprite => (sprite.user === user));
  }

  jumpUserSprite(user) {
    this.userGroup.getChildren().forEach(sprite => {
      if (sprite.user === user) {
        sprite.jump();
      }
    });
  }

  setRunUserSprite(user) {
    this.userGroup.getChildren().forEach(sprite => {
      if (sprite.user === user) {
        sprite.startRunning();
      }
    });
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
      user.update();
    });


    this.coinsGroup.getChildren().forEach(coin => {
      coin.update();
    });
  }
}
