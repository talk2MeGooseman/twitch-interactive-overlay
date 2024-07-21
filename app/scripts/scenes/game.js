/* eslint-disable no-unused-vars */
import ComfyJS from 'comfy.js';
import UserSprite from '../objects/UserSprite';
import bitCreatorFactory from '../helpers/bitsCreatorFactory';
import { buildExplosion } from '../helpers/particleFactory';
import TextBox from '../objects/TextBox';
import * as chatCommandHandler from '../helpers/chatCommandHandler';
import * as channelPointsHandler from '../helpers/channelPointsHandler';
import * as audioFactory from '../helpers/audioFactory';
import * as phaserHelpers from '../helpers/phaserHelpers';
import SpikedBall from '../objects/SpikedBall';
import { clear } from '../helpers/PersistedStorage';
import Phaser from 'phaser';
import { debug } from '../config';

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

    this.ballGroup = this.physics.add.group({
      bounceX: 1,
      bounceY: 0.5,
      velocityX: 50,
      collideWorldBounds: true,
    });
    this.ballGroup.runChildUpdate = true;

    this.nameTextGroup = this.physics.add.group({
      allowGravity: false,
      collideWorldBounds: true,
    });

    // Update Physics collider with new sprites
    this.physics.add.collider(this.userGroup);
    this.physics.add.collider(this.coinsGroup);
    this.physics.add.collider(this.nameTextGroup);
    this.physics.add.collider(this.ballGroup);
    this.physics.add.collider(this.ballGroup, this.userGroup);

    // Check if user touches coin
    this.physics.add.overlap(this.coinsGroup, this.userGroup, this.collectCoin);
    // Handle physics collisions
    this.physics.world.on('collide', (sprite1, sprite2) =>
      this.onCollision(sprite1, sprite2)
    );

    this.explosion = buildExplosion(this);

    this.setupAudio();
    this.events.on('sceneEvent', this.onEvent, this);
  }

  setupAudio() {
    audioFactory.addSoundToScene(this);
  }

  onEvent({ user, message, flags, method, args }) {
    const func = this[method];
    if (func) {
      if (args) {
        func.call(this, args);
      } else {
        func.call(this, user, message, flags);
      }
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
  update(t, dt) {
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

    this.ballGroup.preUpdate(t, dt);
  }

  initComfy() {
    const channel = phaserHelpers.getUrlParam('channel') || 'talk2megooseman';
    ComfyJS.Init(channel, null, [channel]);

    ComfyJS.onJoin = (user, self) => {
      if (this.userGroup.getChildren().length >= 40) {
        return;
      }

      this.addUserSprite(user);
    };

    ComfyJS.onPart = user => UserSprite.userParted(this.userGroup, user);

    ComfyJS.onCommand = (user, command, message, flags, extra) => {
      chatCommandHandler.trigger(this, command, user, message, flags, extra);

      audioFactory.playAudio(this, command, flags, extra);

      // Support multiple commands
      const chainedCommands = phaserHelpers.extractCommands(message);
      chainedCommands.forEach(extraCommand => {
        chatCommandHandler.trigger(this, extraCommand, user, message, flags, extra);
        audioFactory.playAudio(this, extraCommand, flags, extra);
      });
    };

    ComfyJS.onChat = (user, message, flags, self, extra) => {
      if (extra.customRewardId) {
        this.sound.play('airhorn');
        channelPointsHandler.redeem(this, user, extra.customRewardId, message);
      }

      if(message === 'talk2mHo talk2mNk') {
        this.sound.play('honk');
      }

      const sprite = this.addUserSprite(user, message, flags);
      if (sprite) {
        sprite.displayNameText();
        sprite.displaySpeechBubble(message, extra);

        if (/^(hi|hey|hello|howdy)$/i.exec(message)) {
          this.sound.play('hello');
        }
      }
    };

    ComfyJS.onCheer = (message, bits, extra) => {
      audioFactory.playAudio(this, 'cheer', { broadcaster: true });
      this.bitTotal += bits;
    };

    ComfyJS.onHosted = () => audioFactory.playAudio(this, 'hosted', { broadcaster: true });
    ComfyJS.onRaid = (user, viewers) => this.raidAlert(user, viewers);
    ComfyJS.onSub = () => this.subCelebrate();
    ComfyJS.onResub = () => this.subCelebrate();
    ComfyJS.onSubGift = () => this.subCelebrate();
    ComfyJS.onSubMysteryGift = () => audioFactory.playAudio(this, 'victory_short', { broadcaster: true });
    ComfyJS.onGiftSubContinue = (user, sender, extra) =>
      audioFactory.playAudio(this, 'victory_short', { broadcaster: true });
  }

  raidAlert(user = 'The Goose', viewers = '50') {
    audioFactory.playAudio(this, 'raid_alert', { broadcaster: true });
    this.time.delayedCall(2500, () => {
      phaserHelpers.triggerTextToSpeech(
        `raid alert, i repeat raid alert, ${user} is attacking with ${viewers} twitchers`
      );
    });
  }

  voiceShoutOut(user, message) {
    phaserHelpers.triggerTextToSpeech(
      `Shout Out to ${message}. They're totally awesome sauce, you should check out their stream.`
    );
  }

  simulateCheer(user, message) {
    this.bitTotal += message;
  }

  textToSpeech(user, message) {
    phaserHelpers.triggerTextToSpeech(message);
  }

  triggerFireworks() {
    const total = Phaser.Math.Between(3, 5);

    for (let index = 0; index < total; index++) {
      const x = Phaser.Math.Between(0, this.game.config.width);
      const y = Phaser.Math.Between(0, this.game.config.height / 2);
      this.time.delayedCall(index * 500, () => {
        this.explosion.emitParticleAt(x, y);
        audioFactory.playAudio(this, 'explode', { broadcaster: true });
      });
    }
  }

  reverseGravity() {
    this.physics.world.gravity.y = -400;
    audioFactory.playAudio(this, 'scream', { broadcaster: true });
    this.time.delayedCall(60 * 1000, () => {
      this.physics.world.gravity.y = 400;
    });
  }

  addUserSprite(user, message, flags) {
    const sprite = UserSprite.createOrFindUser(this.userGroup, this, user, flags);
    sprite.walk();
    return sprite;
  }

  addSpikedBall() {
    new SpikedBall(this);
  }

  subCelebrate() {
    audioFactory.playAudio(this, 'victory_short', { broadcaster: true });
    this.celebrate = true;
    UserSprite.chatBubbleAllSprites(this.userGroup, 'Pog');
    this.time.delayedCall(10000, () => {
      this.triggerFireworks();
      this.celebrate = false;
    });
  }

  collectCoin(coinSprite, userSprite) {
    userSprite.coinCollected(coinSprite.amount);
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
        sprite2.sendFlyingOnCollide({});
      } else if (sprite2.body.immovable) {
        sprite1.sendFlyingOnCollide({});
      }
    } else if (sprite1.type === 'ball' && sprite2.type === 'user') {
      sprite2.sendFlyingOnCollide({ skeleton: true });
    }
  }

  displayControls() {
    this.displayTextbox('~~ CONTROLS ~~', chatCommandHandler.COMMANDS);
  }

  displayAudioCommands() {
    this.displayTextbox('~~ AUDIO ~~', audioFactory.AUDIO_COMMANDS);
  }

  displayTextbox(title, commands) {
    let displayCollection = [title];

    let clonedCommands = Array.from(commands);
    clonedCommands.sort(phaserHelpers.sortAlphabetically);

    clonedCommands.forEach(c => {
      if (c.private) return;
      displayCollection.push('!' + c.command);
    });

    const box = new TextBox(
      this,
      10,
      10,
      300,
      displayCollection.length * 35,
      displayCollection.join('\n')
    );

    this.time.addEvent({
      delay: 20 * 1000,
      callback: () => box.destroy(),
      loop: false,
    });
  }

  clearBrowserStorage() {
    clear();
  }
}
