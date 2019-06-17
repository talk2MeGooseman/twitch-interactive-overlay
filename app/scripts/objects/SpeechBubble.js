/* eslint-disable no-unused-vars */
export default class SpeechBubble {

  /**
   *Creates an instance of SpeechBubble.
   * @param {Phaser.Scenes. ScenePlugin} scene
   * @param {number} x
   * @param {number} y
   * @param {number} width
   * @param {number} height
   * @param {string} quote
   * @memberof SpeechBubble
   */
  constructor(scene, x, y, width, height, quote, extra) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.bubbleWidth = width;
    this.bubbleHeight = height;
    this.bubblePadding = 10;

    this.bubble = this.buildBubble();

    this.buildContent(quote, extra).then((content) => {
      this.content = content;
    });

    this.positionContent();
  }

  /**
   * Create the text inside the bubble
   *
   * @param {string} quote
   * @param {object} extra
   * @returns {Phaser.GameObjects.Text}
   * @memberof SpeechBubble
   */
  async buildContent(quote, extra) {
    const text = quote.substring(0, 20);

    return this.scene.add.text(0, 0, text, {
      fontFamily: 'Arial',
      fontSize: 20,
      color: '#000000',
      align: 'center',
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
    const arrowHeight = this.bubbleHeight / 4;

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

    //  Calculate arrow coordinates
    const point1X = Math.floor(this.bubbleWidth / 7);
    const point1Y = this.bubbleHeight;
    const point2X = Math.floor((this.bubbleWidth / 7) * 2);
    const point2Y = this.bubbleHeight;
    const point3X = Math.floor(this.bubbleWidth / 7);
    const point3Y = Math.floor(this.bubbleHeight + arrowHeight);

    //  Bubble arrow shadow
    bubble.lineStyle(4, 0x222222, 0.5);
    bubble.lineBetween(point2X - 1, point2Y + 6, point3X + 2, point3Y);

    //  Bubble arrow fill
    bubble.fillTriangle(point1X, point1Y, point2X, point2Y, point3X, point3Y);
    bubble.lineStyle(2, 0x565656, 1);
    bubble.lineBetween(point2X, point2Y, point3X, point3Y);
    bubble.lineBetween(point1X, point1Y, point3X, point3Y);

    return bubble;
  }

  /**
   *
   *
   * @param {number} emoteId
   * @returns {Promise}
   * @memberof SpeechBubble
   */
  loadEmoteImage (emoteId) {
    return new Promise((resolve) => {
      this.scene.load.once('complete', () => {
        resolve(this.scene.add.image(400, 300, emoteId));
      });

      this.scene.load.image({
        key: emoteId,
        url: `https://static-cdn.jtvnw.net/emoticons/v1/${emoteId}/3.0`
      });
      this.scene.load.start();
    });
  }

  /**
   * Sets the x,y position
   *
   * @param {number} x
   * @param {number} y
   * @memberof SpeechBubble
   */
  setPosition(x, y) {
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
    this.content.setPosition(this.bubble.x + this.bubbleWidth / 2 - b.width / 2, this.bubble.y + this.bubbleHeight / 2 - b.height / 2);
  }

  destroy() {
    this.bubble.destroy();
    this.content.destroy();
  }
}
