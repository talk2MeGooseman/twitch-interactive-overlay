/* eslint-disable quotes */
/* eslint-disable no-unused-vars */
import UserSprite from '@/objects/UserSprite';
import ComfyJS from 'comfy.js';
import userSpriteHelpers from '@/helpers/userSpriteHelpers';
import bitCreatorFactory from '@/helpers/bitsCreatorFactory';
import { buildExplosion } from '@/helpers/particleFactory';

// giftsub VIA robertables - lurking_kat
// Resub - DannyKampsGamez

export default class Game extends Phaser.Scene {
  /**
   *  A sample Game scene, displaying the Phaser logo.
   *
   *  @extends Phaser.Scene
   */
  constructor() {
    super({ key: 'Game' });

    this.bitTotal = 0;
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
      dragX: 100,
      collideWorldBounds: true,
    });

    this.coinsGroup = this.physics.add.group({
      bounceX: 1,
      bounceY: 0.5,
      dragX: 100,
      collideWorldBounds: true,
    });

    this.nameTextGroup = this.physics.add.group({
      allowGravity: false,
      collideWorldBounds: true,
    });

    // Update Physics collider with new sprites
    this.physics.add.collider(this.userGroup);
    this.physics.add.collider(this.coinsGroup);
    this.physics.add.collider(this.nameTextGroup);

    // Check if user touches coin
    this.physics.add.overlap(this.coinsGroup, this.userGroup, this.collectCoin);
    // Handle physics collisions
    this.physics.world.on('collide', (sprite1, sprite2) =>
      this.onCollision(sprite1, sprite2)
    );

    this.explosion = buildExplosion(this);

    this.setupAudio();
  }

  setupAudio() {
    this.raidAlert = this.sound.add('raid_alert', { volume: 0.05 });
    this.subAudio = this.sound.add('victory_short', { volume: 0.1 });
    this.collectCoinAudio = this.sound.add('collect_coin', { volume: 0.05 });
    this.gameOverAudio = this.sound.add('game_over', { volume: 0.05 });
    this.cheerAudio = this.sound.add('cheer', { volume: 0.15 });
    this.helloAudio = this.sound.add('hello', { volume: 0.15 });
    this.hostedAudio = this.sound.add('hosted', { volume: 0.15 });
    this.errorAudio = this.sound.add('error', { volume: 0.15 });
    this.victoryAudio = this.sound.add('victory', { volume: 0.1 });
    this.airhornAudio = this.sound.add('airhorn', { volume: 0.1 });
    this.quackAudio = this.sound.add('quack', { volume: 0.2 });
  }

  initComfy() {
    ComfyJS.Init('talk2megooseman');

    ComfyJS.onCommand = (user, command, message, flags) => {
      if (command == 'join') {
        this.addUserSprite(user, flags);
      } else if (command === 'run') {
        userSpriteHelpers.runUserSprite(this.userGroup, user, message, flags);
      } else if (command === 'jump') {
        userSpriteHelpers.jumpUserSprite(this.userGroup, user);
      } else if (command === 'dbag') {
        userSpriteHelpers.dbagMode(this.userGroup, user);
      } else if (command === 'booli') {
        userSpriteHelpers.tackle(this.userGroup, user, message);
      } else if (command === 'spin') {
        userSpriteHelpers.spin(this.userGroup, user);
      } else if (command === 'die') {
        userSpriteHelpers.die(this.userGroup, user);
      } else if (command === 'mushroom') {
        userSpriteHelpers.mushroom(this.userGroup, user);
      } else if (command === 'wave') {
        userSpriteHelpers.triggerTheWave(this.userGroup, this);
      } else if (command === 'fireworks') {
        this.triggerFireworks();
      } else if (command === 'gameover') {
        this.gameOverAudio.play();
      } else if (command === 'hello') {
        this.helloAudio.play();
      } else if (command === 'error') {
        this.errorAudio.play();
      } else if (command === 'victory') {
        this.victoryAudio.play();
      } else if (command === 'airhorn') {
        this.airhornAudio.play();
      } else if (command === 'quack') {
        this.quackAudio.play();
      } else if (command === 'alert' && flags.broadcaster) {
        this.raidAlert.play();
      } else if (command === 'subs' && flags.broadcaster) {
        this.subCelebrate();
      } else if (command === 'cheer' && flags.broadcaster) {
        this.cheerAudio.play();
      } else if (command === 'hosted' && flags.broadcaster) {
        this.hostedAudio.play();
      } else if (command === 'coins' && flags.broadcaster) {
        this.bitTotal += message;
      }
    };

    ComfyJS.onJoin = (user, self) => this.addUserSprite(user);

    ComfyJS.onPart = user => userSpriteHelpers.userParted(this.userGroup, user);

    ComfyJS.onChat = (user, message, flags, self, extra) => {
      const sprite = this.addUserSprite(user, flags);
      if (sprite) {
        sprite.displayNameText();
        sprite.displaySpeechBubble(message, extra);

        if (/^(hi|hey|hello|howdy)$/i.exec(message)) {
          this.helloAudio.play();
        }
      }
    };

    ComfyJS.onCheer = (message, bits, extra) => {
      this.cheerAudio.play();
      this.bitTotal += bits;
    };

    ComfyJS.onHosted = () => this.hostedAudio.play();
    ComfyJS.onRaid = () => this.raidAlert.play();
    ComfyJS.onSub = () => this.subCelebrate();
    ComfyJS.onResub = () => this.subCelebrate();
    ComfyJS.onSubGift = () => this.subCelebrate();
    ComfyJS.onSubMysteryGift = () => this.victoryShort.play();
    ComfyJS.onGiftSubContinue = (user, sender, extra) =>
      this.victoryShort.play();
  }

  triggerFireworks() {
    const total = Phaser.Math.Between(3, 5);

    for (let index = 0; index < total; index++) {
      const x = Phaser.Math.Between(0, this.game.config.width);
      const y = Phaser.Math.Between(0, this.game.config.height/2);
      this.time.delayedCall(index * 200, () => {
        this.explosion.emitParticleAt(x, y);
      });
    }
  }

  addUserSprite(user, flags) {
    const sprite = userSpriteHelpers.createOrFindUser(
      this.userGroup,
      this,
      user,
      flags
    );
    sprite.walk();
    return sprite;
  }

  subCelebrate() {
    this.subAudio.play();
    this.celebrate = true;
    userSpriteHelpers.chatBubbleAllSprites(this.userGroup, 'Pog');
    this.time.delayedCall(10000, () => {
      this.celebrate = false;
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
    bitCreatorFactory(this);
    // Call update on all sprites in our group
    this.userGroup.getChildren().forEach(user => {
      if (this.celebrate) {
        const jump = Phaser.Math.Between(0, 1);
        if (jump) {
          user.jump();
        }
      }
      user.update();
    });

    this.coinsGroup.getChildren().forEach(coin => {
      coin.update();
    });
  }

  collectCoin(coinSprite, userSprite) {
    coinSprite.grabbed();
  }

  onTextOverlap(s1, s2) {}

  /**
   *
   *
   * @param {Phaser.GameObjects.Sprite} sprite1
   * @param {Phaser.GameObjects.Sprite} sprite2
   * @memberof Game
   */
  onCollision(sprite1, sprite2) {
    if (sprite1.type === 'user' && sprite2.type === 'user') {
      if (sprite1.body.immovable) {
        sprite2.sendFlyingOnCollide();
      } else if (sprite2.body.immovable) {
        sprite1.sendFlyingOnCollide();
      }
    }
  }
}
