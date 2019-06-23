/* eslint-disable no-unused-vars */
export default class SpeechBubble {

  /**
   *Creates an instance of SpeechBubble.
   * @param {Phaser.Scenes. ScenePlugin} scene
   * @param {number} x
   * @param {number} y
   * @param {number} width
   * @param {number} height
   * @param {string} text
   * @memberof SpeechBubble
   */
  constructor(scene, x, y, width, height, text) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.bubbleWidth = width;
    this.bubbleHeight = height;
    this.bubblePadding = 10;

    this.bubble = this.buildBubble();

    this.buildContent(text);
    this.setPosition();
  }

  /**
   * Create the text inside the bubble
   *
   * @param {string} text
   * @param {object} extra
   * @returns {Phaser.GameObjects.Text}
   * @memberof SpeechBubble
   */
  async buildContent(text) {
    this.content = this.scene.add.text(0, 0, text, {
      fontFamily: 'Arial',
      fontSize: 30,
      color: '#000000',
      align: 'left',
      wordWrap: { width: this.bubbleWidth - this.bubblePadding * 2 },
    });
  }

  /**
   *Creates the speech bubble graphic
   *
   * @returns {Phaser.GameObjects.Graphics}
   * @memberof SpeechBubble
   */
  buildBubble() {
    const bubble = this.scene.add.graphics({ x: this.x, y: this.y });

    //  Bubble shadow
    bubble.fillStyle(0x222222, 0.5);
    bubble.fillRoundedRect(6, 6, this.bubbleWidth, this.bubbleHeight, 16);

    //  Bubble color
    bubble.fillStyle(0xffffff, 1);

    //  Bubble outline line style
    bubble.lineStyle(4, 0x565656, 1);

    //  Bubble shape and outline
    bubble.strokeRoundedRect(0, 0, this.bubbleWidth, this.bubbleHeight, 16);
    bubble.fillRoundedRect(0, 0, this.bubbleWidth, this.bubbleHeight, 16);

    return bubble;
  }

  /**
   * Sets the x,y position
   *
   * @param {number} x
   * @param {number} y
   * @memberof SpeechBubble
   */
  setPosition(x = this.x, y = this.y) {
    this.bubble.setPosition(x, y);
    this.positionContent();
  }

  /**
   *Positions text content relative to bubble
   *
   * @memberof SpeechBubble
   */
  positionContent() {
    if (!this.content) {
      return;
    }

    const b = this.content.getBounds();
    this.content.setPosition(this.bubble.x + this.bubblePadding, this.bubble.y + this.bubblePadding);
  }

  destroy() {
    this.bubble.destroy();
    this.content.destroy();
  }
}
