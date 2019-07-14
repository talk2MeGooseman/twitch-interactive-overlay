const COMMANDS = [
  {
    command: 'run',
    method: 'startRunning'
  },
  {
    command: 'jump',
    method: 'jump',
  },
  {
    command: 'dbag',
    method: 'makeDbag',
  },
  {
    command: 'spin',
    method: 'doSpin'
  },
  {
    command: 'die',
    method: 'remove' ,
  },
  {
    command: 'mushroom',
    method: 'makeGiant',
  },
  {
    command: 'princess',
    method: 'changeCharacter',
    args: ['princess']
  },
  { command: 'booli'},
  { command: 'join'},
  { command: 'fireworks'},
  { command: 'wave'},
  {
    command: 'wizard',
    method: 'changeCharacter',
    args: ['wizard_2']
  },
  { command: 'subs'},
  { command: 'coins'},
];

export default class ChatCommander {
  constructor(scene) {
    this.scene = scene;
  }

  handler(command, user, message, flags) {
    const foundCommand = COMMANDS.find((c) => ( c.command === command ));

    if (!foundCommand) return;

    this.scene.events.emit('command', {
      user,
      message,
      flags,
      method: foundCommand.method,
      args: foundCommand.args
    });
  }
}
