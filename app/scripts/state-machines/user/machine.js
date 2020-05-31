import { Machine } from 'xstate';
import { smashStates } from '../states';

export const EVENTS = {
  HULK_SMASH: 'HULK_SMASH',
  DIE: 'DIE',
};

export const STATES = {
  DEATH: 'death',
};

// Stateless machine definition
export const userSpriteMachine = Machine({
  key: 'user_sprite',
  initial: 'idle',
  states: {
    idle: {
      on: {
        HULK_SMASH: 'hulk_smash',
        DIE: STATES.DEATH
      }
    },
    hulk_smash: {
      on: {
        DONE: 'idle'
      },
      ...smashStates
    },
    death: {}
  },
});

export function transitionEvent(currentState) {
  const nextState = currentState.transition('idle', 'HULK_SMASH');

  return [ nextState, nextState.value ];
}

export function getNextEvents(currentState) {
  return currentState.nextEvents;
}

