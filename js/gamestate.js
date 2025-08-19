// Modern ES6+ compatible version with backward compatibility
const MODE_REGULAR = 0;
const MODE_FULL = 1;

const INIT_STATE = 0;
const GAME_STATE = 1;
const ENDINGGAME_STATE = 2;
const ENDGAME_STATE = 3;

class GameStateModern {
  constructor(mode) {
    this.mode = mode;
    this.state = INIT_STATE;
    this.pauseState = false;
    this.history = [];
    this.combo = 0;
    this.maxCombo = 0;
  }

  getState() {
    return this.state;
  }

  pause() {
    this.pauseState = true;
  }

  unpause() {
    this.pauseState = false;
  }

  isPaused() {
    return this.pauseState;
  }

  changeState(newState) {
    // Check validity: INIT_STATE(0) -> GAME_STATE(1) -> ENDINGGAME_STATE(2) -> ENDGAME_STATE(3)
    if (newState - this.state === 1) {
      this.state = newState;
    } else {
      throw new Error("Incorrect state transition");
    }
  }

  logAction(question, score) {
    this.history.push({ question, score });
    if (!score) {
      this.combo = 0;
    } else {
      this.combo++;
      if (this.maxCombo < this.combo) {
        this.maxCombo = this.combo;
      }
    }
  }

  getCombo() {
    return this.combo;
  }

  getComboString() {
    if (!this.combo) return "";
    return `${this.combo} Combo${this.combo > 1 ? "s" : ""}`;
  }

  getMaxCombo() {
    return this.maxCombo;
  }

  getMaxComboString() {
    if (!this.maxCombo) return "";
    return `Max: ${this.maxCombo}`;
  }

  getScore() {
    return this.history.reduce((sum, item) => sum + item.score, 0);
  }

  getLevel() {
    const score = this.getScore();
    for (let i = 0; i < LEVELBOUND.length; i++) {
      if (score < LEVELBOUND[i]) return i;
    }
    return -1;
  }

  getMode() {
    return this.mode;
  }

  getModeText() {
    return MODE_NAMES[this.mode];
  }

  isMax() {
    return this.getLevel() === MAX_LEVEL[this.mode];
  }

  isPractice() {
    return this.mode !== MODE_REGULAR && this.mode !== MODE_FULL;
  }
}

// Legacy constructor function for backward compatibility
function GameState(_mode) {
  const modernInstance = new GameStateModern(_mode);
  
  // Copy all methods to this for backward compatibility
  Object.getOwnPropertyNames(GameStateModern.prototype).forEach(name => {
    if (name !== 'constructor') {
      this[name] = modernInstance[name].bind(modernInstance);
    }
  });
  
  // Copy properties
  Object.defineProperty(this, 'mode', {
    get: () => modernInstance.mode,
    set: (value) => modernInstance.mode = value
  });
  
  Object.defineProperty(this, 'state', {
    get: () => modernInstance.state,
    set: (value) => modernInstance.state = value
  });
}
  


