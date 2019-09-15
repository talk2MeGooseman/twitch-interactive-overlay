/* eslint-disable quotes */
/* eslint-disable no-unused-vars */
import UserSprite from '@/objects/UserSprite';
import ComfyJS from 'comfy.js';
import userSpriteHelpers from '@/helpers/userSpriteHelpers';
import bitCreatorFactory from '@/helpers/bitsCreatorFactory';
import { buildExplosion } from '@/helpers/particleFactory';
import TextBox from '@/objects/TextBox';
import ChatCommander, { COMMANDS } from '@/objects/ChatCommander';
import {
  addSoundToScene,
  playAudio,
  AUDIO_COMMANDS,
} from '../helpers/audioFactory';
import { getUrlParam } from '@/helpers/phaserHelpers';
import SpikedBall from '@/objects/SpikedBall';
import { clear } from '@/helpers/PersistedStorage';
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
    this.chatCommander = new ChatCommander(this);
    this.events.on('sceneEvent', this.onEvent, this);
  }

  setupAudio() {
    addSoundToScene(this);
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
    const channel = getUrlParam('channel') || 'talk2megooseman';
    ComfyJS.Init(channel, null, [channel]);

    ComfyJS.onCommand = (user, command, message, flags) => {
      this.chatCommander.handler(command, user, message, flags);
      playAudio(this, command, flags);
    };

    ComfyJS.onJoin = (user, self) => {
      if (this.userGroup.getChildren().length >= 40) {
        return;
      }

      this.addUserSprite(user);
    };

    ComfyJS.onPart = user => userSpriteHelpers.userParted(this.userGroup, user);

    ComfyJS.onChat = (user, message, flags, self, extra) => {
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
      this.sound.play('cheer');
      this.bitTotal += bits;
    };

    ComfyJS.onHosted = () => this.sound.play('hosted');
    ComfyJS.onRaid = () => this.sound.play('raid_alert');
    ComfyJS.onSub = () => this.subCelebrate();
    ComfyJS.onResub = () => this.subCelebrate();
    ComfyJS.onSubGift = () => this.subCelebrate();
    ComfyJS.onSubMysteryGift = () => this.sound.play('victory_short');
    ComfyJS.onGiftSubContinue = (user, sender, extra) =>
      this.sound.play('victory_short');
  }

  // TODO Move to helper file

  simulateCheer(user, message) {
    this.bitTotal += message;
  }

  triggerFireworks() {
    const total = Phaser.Math.Between(3, 5);

    for (let index = 0; index < total; index++) {
      const x = Phaser.Math.Between(0, this.game.config.width);
      const y = Phaser.Math.Between(0, this.game.config.height / 2);
      this.time.delayedCall(index * 500, () => {
        this.explosion.emitParticleAt(x, y);
        this.sound.play('explode');
      });
    }
  }

  addUserSprite(user, message, flags) {
    const sprite = userSpriteHelpers.createOrFindUser(
      this.userGroup,
      this,
      user,
      flags
    );
    sprite.walk();
    return sprite;
  }

  addSpikedBall() {
    new SpikedBall(this);
  }

  subCelebrate() {
    this.sound.play('victory_short');
    this.celebrate = true;
    userSpriteHelpers.chatBubbleAllSprites(this.userGroup, 'Pog');
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
    let commands = ['~~ CONTROLS ~~'];

    let clonedCommands = Array.from(COMMANDS);
    clonedCommands.sort(this.sort);

    clonedCommands.forEach(c => {
      if (c.private) return;
      commands.push('!' + c.command);
    });
    const box = new TextBox(
      this,
      10,
      10,
      300,
      commands.length * 35,
      commands.join('\n')
    );

    this.time.addEvent({
      delay: 20 * 1000,
      callback: () => box.destroy(),
      loop: false,
    });
  }

  displayAudioCommands() {
    let commands = ['~~ AUDIO ~~'];

    let clonedCommands = Array.from(AUDIO_COMMANDS);
    clonedCommands.sort(this.sort);

    clonedCommands.forEach(c => {
      if (c.private) return;
      commands.push('!' + c.command);
    });
    const box = new TextBox(
      this,
      10,
      10,
      300,
      commands.length * 35,
      commands.join('\n')
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

  sort(a, b) {
    var nameA = a.command.toUpperCase(); // ignore upper and lowercase
    var nameB = b.command.toUpperCase(); // ignore upper and lowercase
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  }
}
