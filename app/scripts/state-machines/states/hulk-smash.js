export const hulkSmashStates = {
  initial: 'jump',
  states: {
    jump: {
      on: {
        ACTION: 'land'
      }
    },
    land: {
      on: {
        ACTION: 'explosion'
      }
    },
    explosion: {
      on: {
        ACTION: 'done'
      }
    },
    done: {},
  }
};

