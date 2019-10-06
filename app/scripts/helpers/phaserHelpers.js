/**
 * Fetches the request parameter from the URL
 *
 * @export
 * @param {string} param
 * @returns {string}
 */
export function getUrlParam(param) {
  let search = window.location.search;
  const params = new URLSearchParams(search);
  return params.get(param);
}

/**
 * Sort helper: Alphabetize a collection
 *
 * @export
 * @param {string} a
 * @param {string} b
 * @returns {number}
 */
export function sortAlphabetically(a, b) {
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

export function extractCommands(text) {
  const commands = text.match(/!(\w+)/g);
  if (!commands) {
    return [];
  }

  return commands.map(command => command.slice(1));
}

export function triggerTextToSpeech(message) {
  const SPEECH_URL = "https://api.streamelements.com/kappa/v2/speech?voice=Brian&text=" + encodeURIComponent(message);
  const track = new Audio(SPEECH_URL);
  track.play();
}

/**
 * Returns boolean if sprite has velocity > 0
 *
 * @export
 * @param {Phaser.GameObjects.Sprite} sprite
 * @returns boolean
 */
export function isMoving(sprite) {
  return Math.abs(sprite.body.velocity.x) && Math.abs(sprite.body.velocity.y);
}

/**
 * Check if a sprite has another sprite on top
 *
 * @export
 * @param {Phaser.GameObjects.Sprite} sprite
 * @returns
 */
export function isSomethingOnTop(sprite) {
  return sprite.body.onFloor() && sprite.body.touching.up;
}

/**
 * Find sprite in provided group
 *
 * @export
 * @param {Phaser.GameObjects.Group} group
 * @param {function} matchFunc
 * @returns
 */
export function findSpriteInGroup(group, matchFunc) {
  return group.getChildren().find(matchFunc);
}

/**
 *
 *
 * @export
 * @param {Phaser.Scene} scene
 * @param {string} text
 * @param {*} [position={ x: 0, y: 0 }]
 * @param {*} [origin={ x: 0.5, y: 0.5 }]
 * @returns
 * @returns {Phaser.GameObjects.Text} Text Object
 */
export function renderText(
  scene,
  text,
  position = { x: 0, y: 0 },
  origin = { x: 0.5, y: 0.5 }
) {
  const textObject = scene.add.text(position.x, position.y, text, {
    fontFamily: 'Arial',
    fontSize: 32,
    color: '#ffff00',
  });
  textObject.setOrigin(origin.x, origin.y);
  return textObject;
}

/**
 * Set the animation a sprite should use if
 * it isnt already playing
 *
 * @export
 * @param {Phaser.GameObjects.Sprite} sprite
 * @param {string} anim
 */
export function setSpriteAnimation(sprite, anim) {
  if (anim && (sprite.anims.currentAnim.key !== anim)) {
    sprite.anims.play(anim);
  }
}
