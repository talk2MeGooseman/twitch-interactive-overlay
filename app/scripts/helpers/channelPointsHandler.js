const CHANNEL_REWARDS = [
  {
    id: '2897ba61-3d4f-4076-a6e5-ecb8f4b0f19d', // This id will need to change for your own channel
    name: 'Text to Speech',
    method: 'textToSpeech',
    event: 'sceneEvent',
  }
];

/**
 * Redeem function will trigger an event cooresponding to the reward_id
 * given.
 *
 * @export
 * @param {Phaser.Scene} scene
 * @param {String} user
 * @param {String} reward_id
 * @param {String} message
 * @returns
 */
export function redeem(scene, user, reward_id, message) {
  const foundCommand = CHANNEL_REWARDS.find(
    c => c.id === reward_id
  );

  if (!foundCommand) return;

  scene.events.emit(foundCommand.event, {
    user,
    message,
    method: foundCommand.method,
    args: foundCommand.args,
    applyAll: foundCommand.applyAll,
  });
}
