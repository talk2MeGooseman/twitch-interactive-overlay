import { Machine } from 'xstate';
import { smashStates } from '../states';

export const MACHINE_EVENTS = {
  HULK_SMASH: 'HULK_SMASH',
  DIE: 'DIE',
  JUMP: 'JUMP',
  ON_GROUND: 'ON_GROUND',
};

export const MACHINE_STATES = {
  DEATH: 'death',
  JUMPING: 'jumping'
};

// Stateless machine definition
export const userSpriteMachine = Machine({
  id: 'user_sprite',
  initial: 'idle',
  states: {
    idle: {
      on: {
        HULK_SMASH: 'hulk_smash',
        DIE: MACHINE_STATES.DEATH,
        JUMP: MACHINE_STATES.JUMPING,
      }
    },
    hulk_smash: {
      on: {
        DONE: 'idle'
      },
      ...smashStates
    },
    jumping: {
      on: {
        ON_GROUND: 'idle',
      }
    },
    death: {
      type: 'final'
    }
  },
});

export function transitionEvent(currentState) {
  const nextState = currentState.transition('idle', 'HULK_SMASH');

  return [ nextState, nextState.value ];
}

export function getNextEvents(currentState) {
  return currentState.nextEvents;
}

