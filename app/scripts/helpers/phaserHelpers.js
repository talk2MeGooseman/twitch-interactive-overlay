/**
 * Returns boolean if sprite has velocity > 0
 *
 * @export
 * @param {*} sprite GameObject
 * @returns boolean
 */
export function isMoving(sprite) {
  return Math.abs(sprite.body.velocity.x) && Math.abs(sprite.body.velocity.y);
}

export function isSomethingOnTop(sprite) {
  return sprite.body.onFloor() && sprite.body.touching.up;
}

export function findSpriteInGroup(group, matchFunc) {
  return group.getChildren().find(matchFunc);
}
