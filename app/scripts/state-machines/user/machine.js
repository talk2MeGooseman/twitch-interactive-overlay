import { Machine, interpret } from 'xstate';
import { HulkSmashState } from '../states';

// Stateless machine definition
// machine.transition(...) is a pure function used by the interpreter.
const userSpriteMachine = Machine({
  key: 'user_sprite',
  initial: 'idle',
  states: {
    idle: {
      on: {
        HULK_SMASH: 'hulk_smash'
      }
    },
    hulk_smash: {
      on: {
        DONE: 'idle'
      },
      ...HulkSmashState
    }
  },
});

export function initUserMachineService() {
  const machine = interpret(userSpriteMachine);

  // eslint-disable-next-line no-console
  machine.onTransition(state => console.log(state.value))
    .start();

  return machine;
}

