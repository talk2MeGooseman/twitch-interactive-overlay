export const COMMANDS = [
  {
    command: 'run',
    method: 'startRunning',
    event: 'userChatAction',
  },
  {
    command: 'jump',
    method: 'jump',
    event: 'userChatAction',
  },
  {
    command: 'dbag',
    method: 'makeDbag',
    event: 'userChatAction',
  },
  {
    command: 'spin',
    method: 'spin',
    event: 'userChatAction',
  },
  {
    command: 'die',
    method: 'remove' ,
    event: 'userChatAction',
  },
  {
    command: 'mushroom',
    method: 'makeGiant',
    event: 'userChatAction',
  },
  {
    command: 'booli',
    method: 'tackle',
    event: 'userChatAction',
  },
  {
    command: 'coins',
    method: 'sayCoinsCount',
    event: 'userChatAction',
  },
  {
    command: 'wave',
    method: 'waveJump',
    event: 'userChatAction',
    applyAll: true,
  },
  {
    command: 'lurk',
    method: 'lurk',
    event: 'userChatAction',
  },
  {
    command: 'princess',
    method: 'changeCharacter',
    event: 'userChatAction',
    args: ['princess']
  },
  {
    command: 'wizard',
    method: 'changeCharacter',
    event: 'userChatAction',
    args: ['wizard_2']
  },
  {
    command: 'join',
    method: 'addUserSprite',
    event: 'sceneEvent',
  },
  {
    command: 'fireworks',
    method: 'triggerFireworks',
    event: 'sceneEvent',
  },
  {
    command: 'spiked_ball',
    method: 'addSpikedBall',
    event: 'sceneEvent',
  },
  {
    command: 'controls',
    method: 'displayControls',
    event: 'sceneEvent',
  },
  {
    command: 'subs',
    method: 'subCelebrate',
    event: 'sceneEvent',
    private: true,
  },
  {
    command: 'addcoins',
    method: 'simulateCheer',
    event: 'sceneEvent',
    private: true,
  },
  {
    command: 'clearCoins',
    method: 'clearBrowserStorage',
    event: 'sceneEvent',
    private: true,
  },
];

export default class ChatCommander {
  constructor(scene) {
    this.scene = scene;
  }

  handler(command, user, message, flags) {
    const foundCommand = COMMANDS.find((c) => ( c.command.toLowerCase() === command.toLowerCase() ));

    if (!foundCommand) return;
    if (!foundCommand.event) {
      throw new Error('Must provide event name');
    }

    if (foundCommand.private && !flags.broadcaster) {
      return;
    }

    this.scene.events.emit(foundCommand.event, {
      user,
      message,
      flags,
      method: foundCommand.method,
      args: foundCommand.args,
      applyAll: foundCommand.applyAll
    });
  }
}
