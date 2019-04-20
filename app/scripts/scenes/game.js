import Logo from '@/objects/logo';
import UserSprite from '@/objects/UserSprite';
var ComfyJS = require('comfy.js');

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
    ComfyJS.onCommand = (user, command, message, flags) => {
      if (command == 'join') {
        this.addUserSprite(user, flags);
      }

      if (command == 'run') {
        this.setRunUserSprite(user, flags);
      }
    };

    ComfyJS.Init('talk2megooseman');

    this.userGroup = this.physics.add.group({
      bounceX: 1,
      bounceY: 0.5,
      collideWorldBounds: true,
    });

    // Add in dummy sprite
    this.addUserSprite();
  }

  addUserSprite(user, flags) {
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
  }
}
