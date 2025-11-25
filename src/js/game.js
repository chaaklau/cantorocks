// Game Configuration and Constants
const GameConfig = {
  MODE_REGULAR: 0,
  MODE_FULL: 1,
  MODE_INITIAL: 2,
  MODE_FINAL: 3,
  MODE_TONE: 4,
  MODE_SUPERFAST: 5,
  
  MODE_NAMES: ["Normal", "Full", "Initials", "Finals", "Tones", "Normal2x"],
  MAX_LEVEL: [6, 6, 2, 2, 2, 6],
  VELOCITIES: [0.5, 0.75, 1, 1.25, 1.5],
  LEVELBOUND: [-1, 32, 64, 128, 256, 512, 9999999],
  
  STATE_INIT: 0,
  STATE_GAME: 1,
  STATE_ENDING: 2,
  STATE_END: 3,
  
  getVelocity(mode, level) {
    let multiplier = (mode == GameConfig.MODE_SUPERFAST? 2: 1);
    if (level < this.MAX_LEVEL[mode]) return this.VELOCITIES[level - 1] * multiplier;
    return 0;
  }
};

// Game State Manager
class GameState {
  constructor(mode) {
    this.mode = mode;
    this.state = GameConfig.STATE_INIT;
    this.paused = false;
    this.history = [];
    this.combo = 0;
    this.maxCombo = 0;
  }
  
  getState() { return this.state; }
  pause() { this.paused = true; }
  unpause() { this.paused = false; }
  isPaused() { return this.paused; }
  
  changeState(newState) {
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
  
  getCombo() { return this.combo; }
  
  getComboString() {
    if (!this.combo) return "";
    return `${this.combo} Combo${this.combo > 1 ? "s" : ""}`;
  }
  
  getMaxCombo() { return this.maxCombo; }
  
  getMaxComboString() {
    if (!this.maxCombo) return "";
    return `Max: ${this.maxCombo}`;
  }
  
  getScore() {
    return this.history.reduce((sum, entry) => sum + entry.score, 0);
  }
  
  getLevel() {
    const score = this.getScore();
    for (let i = 0; i < GameConfig.LEVELBOUND.length; i++) {
      if (score < GameConfig.LEVELBOUND[i]) return i;
    }
    return -1;
  }
  
  getMode() { return this.mode; }
  
  getModeText() {
    return GameConfig.MODE_NAMES[this.mode];
  }
  
  isMax() {
    return this.getLevel() === GameConfig.MAX_LEVEL[this.mode];
  }
  
  isPractice() {
    return this.mode !== GameConfig.MODE_REGULAR && this.mode !== GameConfig.MODE_FULL && this.mode !== GameConfig.MODE_SUPERFAST;
  }
}

// Question Handler
class Question {
  constructor(mode, bankIndex) {
    const item = BANK[bankIndex];
    this.text = item.text;
    this.english = item.english;
    this.sound = item.sound;
    this.id = this.sound.substring(0, this.sound.length - 4);
    
    // Set answer based on mode
    switch (mode) {
      case GameConfig.MODE_REGULAR: this.lshk = item.lshk; break;
      case GameConfig.MODE_FULL: this.lshk = item.full; break;
      case GameConfig.MODE_INITIAL: this.lshk = item.initial; break;
      case GameConfig.MODE_FINAL: this.lshk = item.rhyme; break;
      case GameConfig.MODE_TONE: this.lshk = item.tone; break;
      case GameConfig.MODE_SUPERFAST: this.lshk = item.lshk; break;
    }
  }
  
  check(mode, attempt) {
    const cleanAnswer = this.lshk.replace(/ /g, "").toLowerCase();
    const cleanAttempt = attempt.replace(/ /g, "").toLowerCase();
    
    if (mode === GameConfig.MODE_INITIAL || mode === GameConfig.MODE_FINAL) {
      return this.lshk.toLowerCase() === attempt;
    }
    return cleanAnswer === cleanAttempt;
  }
}

// Rock Entity (using CreateJS pattern)
function Rock() {
  this.Container_constructor();
  
  this.active = false;
  this.launched = false;
  this.stuck = false;
  this.question = null;
  this.x = Math.random() * (540 - 101);
  this.y = -80;
}

const p = createjs.extend(Rock, createjs.Container);

p.init = function(rockShape, question) {
  this.question = question;
  
  this.rock = new createjs.Bitmap(rockShape);
  this.rock.x = 0;
  this.rock.y = 0;
  
  this.label = new createjs.Text(question.text, "18px Garamond", "#FFFFFF");
  this.label.maxWidth = 90;
  this.label.textAlign = "center";
  this.label.textBaseline = "middle";
  this.label.x = this.rock.getBounds().width / 2;
  this.label.y = this.rock.getBounds().height / 2;
  
  this.addChild(this.rock);
  this.addChild(this.label);
  
  // Set bounds manually based on rock bitmap
  this.setBounds(0, 0, this.rock.getBounds().width, this.rock.getBounds().height);
  
  const self = this;
  this.on("click", function() {
    createjs.Sound.play(self.question.id, createjs.Sound.INTERRUPT_ANY);
  });
  
  this.launched = true;
  this.active = true;
};

p.check = function(mode, answer) {
  return this.question.check(mode, answer);
};

p.tick = function(event, game) {
  const velocity = GameConfig.getVelocity(game.getMode(), game.getLevel()) / 
                   Math.pow(this.question.text.length, 0.6);
  this.y += velocity;
};

p.freeze = function(rockShape) {
  this.active = false;
  this.stuck = true;
  
  this.removeChild(this.rock);
  this.rock = new createjs.Bitmap(rockShape);
  this.rock.x = 0;
  this.rock.y = 0;
  this.addChild(this.rock);
  
  this.removeChild(this.label);
  this.label.color = "#EEEEEE";
  this.label.font = "16px Times";
  this.label.y -= 10;
  this.label.text = this.question.text + "\n" + this.question.lshk;
  this.label.maxWidth = 90;
  this.addChild(this.label);
};

window.Rock = createjs.promote(Rock, "Container");

// Message Box (using CreateJS pattern)
function MsgBox() {
  this.Container_constructor();
  this.x = 0;
  this.y = 240;
  this.width = 260;
  this.height = 240;
  this.title = "";
  this.message = "";
}

const p2 = createjs.extend(MsgBox, createjs.Container);

p2.init = function(title, message) {
  this.title = title;
  this.message = message || "";
  
  const box = new createjs.Shape();
  box.graphics.setStrokeStyle(4, "round")
    .beginStroke("#800000")
    .beginFill('#CD853F')
    .drawRoundRectComplex(0, 0, this.width, this.height, 10, 10, 10, 10)
    .endFill();
  box.alpha = 1;
  this.box = box;
  
  this.titleLabel = new createjs.Text(this.title, "bold 20px Pixel", "#FFFFAA");
  this.titleLabel.maxWidth = 240;
  this.titleLabel.textAlign = "left";
  this.titleLabel.textBaseline = "top";
  this.titleLabel.x = 15;
  this.titleLabel.y = 15;
  
  this.messageLabel = new createjs.Text(this.message, "14px Pixel", "#FFFFFF");
  this.messageLabel.maxWidth = 240;
  this.messageLabel.textAlign = "left";
  this.messageLabel.textBaseline = "top";
  this.messageLabel.lineHeight = 20;
  this.messageLabel.x = 10;
  this.messageLabel.y = 60;
};

p2.show = function() {
  this.addChild(this.box);
  this.addChild(this.messageLabel);
  this.addChild(this.titleLabel);
};

p2.hide = function() {
  this.removeAllChildren();
};

window.MsgBox = createjs.promote(MsgBox, "Container");
