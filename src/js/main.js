// CantoRocks - Main Game Controller
// Handles initialization, game loop, and user input

// Asset loading
let manifest, rockimages, preload, preload2, preload3;

// Game entities
let rockBelt = [];
let currRock = null;
let game = null;

// Canvas and stage
let canvas, stage;

// UI state
let pendingStart = false;
let screenMode = 0;
let showingMsg = null;

// Panels and containers
let gamePanel, qPanel, backdrop;

// Text fields
let messageField, scoreField, levelField;
let qEnglishField, qTextField, typingField, debugField;
let comboField, maxComboField, modeField;
let instructionTitle, instructionField;
let modeDesc = [];

// Animation
let freezeCounter = 0;
const MAX_FREEZE = 10;

// Initialize on page load
window.addEventListener('load', () => {
  document.getElementById("dummytextbox").focus();
  document.onkeydown = handleKeyDown;
  document.onkeyup = handleKeyUp;
  init();
});

function initHomeScreen() {
  instructionTitle = new createjs.Text("CantoRocks", "bold 34px Pixel", "#FFFFCC");
  instructionTitle.textAlign = "left";
  instructionTitle.textBaseline = "top";
  instructionTitle.x = 30;
  instructionTitle.y = 10;
  
  instructionField = new createjs.Text("", "18px Pixel", "#FFFFFF");
  instructionField.textAlign = "left";
  instructionField.textBaseline = "top";
  instructionField.lineWidth = 700;
  instructionField.x = 30;
  instructionField.y = 60;
  instructionField.text = "The monster is dropping rocks to the city!!!\n\nType words that you hear as fast as you can to destroy the falling rocks! You can click on the rock to listen to it again.";
  
  messageField = new createjs.Text("Loading", "bold 24px Pixel", "#FFCCFF");
  messageField.maxWidth = 600;
  messageField.textAlign = "right";
  messageField.textBaseline = "bottom";
  messageField.x = canvas.width - 10;
  messageField.y = canvas.height - 10;
  
  debugField = new createjs.Text("", "bold 20px Arial", "#FF0000");
  debugField.maxWidth = 240;
  debugField.textAlign = "left";
  debugField.textBaseline = "middle";
  debugField.x = 10;
  debugField.y = 100;
}

function loadHomeScreen() {
  pendingStart = false;
  stage.removeAllChildren();
  stage.addChild(messageField);
  stage.addChild(instructionTitle);
  stage.addChild(instructionField);
  stage.update();
}

function init() {
  if (!createjs.Sound.initializeDefaultPlugins()) {
    document.getElementById("error").style.display = "block";
    document.getElementById("content").style.display = "none";
    return;
  }
  
  canvas = document.getElementById("gameCanvas");
  stage = new createjs.Stage(canvas);
  stage.width = canvas.width;
  stage.height = canvas.height;
  
  createjs.Ticker.setFPS(60);
  
  initHomeScreen();
  loadHomeScreen();
  
  // Begin loading content
  const assetsPath = "sounds/";
  manifest = [
    {id: "break", src: "correct.ogg"},
    {id: "death", src: "dead.ogg"},
    {id: "hit", src: "wrong.ogg"},
    {id: "levelup", src: "levelup.ogg"}
  ];

  const assetsPath2 = "images/";
  rockimages = [
    {id: "rock1", src: "brownrock.png"},
    {id: "rock2", src: "greyrock.png"},
    {id: "lpbg", src: "leftpanel.png"},
    {id: "sun", src: "sun.png"},
    {id: "bg0", src: "bg0.png"},
    {id: "bg0_full", src: "bg0_full.png"},
    {id: "bg0_practice", src: "bg0_practice.png"},
    {id: "bg1", src: "bg1.png"},
    {id: "bg12", src: "bg12.png"},
    {id: "bg14", src: "bg14.png"},
    {id: "bg16", src: "bg16.png"},
    {id: "bg18", src: "bg18.png"},
    {id: "bg20", src: "bg20.png"},
    {id: "bg24", src: "bg24.png"},
    {id: "bg4", src: "bg4.png"},
    {id: "bg6", src: "bg6.png"},
    {id: "bg9", src: "bg9.png"},
    {id: "plane", src: "plane.png"},
    {id: "junk", src: "junk.png"},
    {id: "cloud", src: "cloud.png"},
    {id: "duck", src: "duck.png"},
    {id: "dragon", src: "dragon.png"},
    {id: "fireworks", src: "fireworks.png"},
    {id: "mode0", src: "mode0.png"},
    {id: "mode1", src: "mode1.png"},
    {id: "mode2", src: "mode2.png"},
    {id: "mode3", src: "mode3.png"},
    {id: "mode4", src: "mode4.png"},
    {id: "mode5", src: "mode0x.png"}
  ];

  preload = new createjs.LoadQueue(true, assetsPath);
  preload.installPlugin(createjs.Sound);
  preload.loadManifest(manifest);
  
  preload2 = new createjs.LoadQueue(true, assetsPath2);
  preload2.loadManifest(rockimages);
  
  preload3 = new createjs.LoadQueue(true, "");
  preload3.installPlugin(createjs.Sound);
  preload3.loadManifest(words);
  
  // Wait for all assets to load
  Promise.all([
    new Promise(resolve => preload.addEventListener("complete", resolve)),
    new Promise(resolve => preload2.addEventListener("complete", resolve)),
    new Promise(resolve => preload3.addEventListener("complete", resolve))
  ]).then(doneLoading);
  
  // Set up backdrop
  backdrop = new createjs.Container();
  backdrop.x = 0;
  backdrop.y = 0;
  backdrop.width = canvas.width;
  backdrop.height = canvas.height;
}

function doneLoading() {
  messageField.text = "Use <- or -> to select MODE. Press Enter to continue...";
  
  for (let i = 0; i < GameConfig.MODE_NAMES.length; i++) {
    modeDesc[i] = new createjs.Bitmap(preload2.getResult("mode" + i));
    modeDesc[i].x = 150;
    modeDesc[i].y = 220;
    modeDesc[i].name = "mode" + i;
  }
  updateScreenModeDesc();
  stage.update();
  watchRestart();
}

function watchRestart() {
  pendingStart = true;
}

function restart() {
  createjs.Sound.play("begin");
  stage.removeAllChildren();

  // Game Logic
  game = new GameState(screenMode);
  rockBelt = [];

  // Delete all moveable items from backdrop
  backdrop.removeAllChildren();
  backdrop.moveables = [];
  
  let bg;
  switch (game.getMode()) {
    case GameConfig.MODE_FULL:
      bg = new createjs.Shape(new createjs.Graphics().beginBitmapFill(preload2.getResult("bg0_full")).drawRect(0, 0, 540, 480));
      break;
    case GameConfig.MODE_REGULAR:
    case GameConfig.MODE_SUPERFAST:
      bg = new createjs.Shape(new createjs.Graphics().beginBitmapFill(preload2.getResult("bg0")).drawRect(0, 0, 540, 480));
      break;
    default:
      bg = new createjs.Shape(new createjs.Graphics().beginBitmapFill(preload2.getResult("bg0_practice")).drawRect(0, 0, 540, 480));
      break;
  }
  
  bg.name = "bg";
  bg.x = 260;
  backdrop.addChild(bg);
  stage.addChild(backdrop);
  
  gamePanel = new createjs.Container();
  gamePanel.x = 260;
  gamePanel.y = 0;
  gamePanel.width = canvas.width - 260;
  gamePanel.height = canvas.height;
  stage.addChild(gamePanel);

  modeField = new createjs.Text("", "bold 18px Pixel", "#CCFFFF");
  modeField.textAlign = "left";
  modeField.x = 20;
  modeField.y = 20;
  modeField.maxWidth = 150;
  modeField.text = game.getModeText();

  levelField = new createjs.Text("-----", "bold 18px Pixel", "#FFFFCC");
  levelField.textAlign = "right";
  levelField.x = 240;
  levelField.y = 20;
  levelField.maxWidth = 70;
  
  scoreField = new createjs.Text("0", "bold 40px Pixel", "#FFFFFF");
  scoreField.textAlign = "right";
  scoreField.x = 220;
  scoreField.y = 100;
  scoreField.maxWidth = 240;

  comboField = new createjs.Text("", "20px Pixel", "#802222");
  comboField.textAlign = "center";
  comboField.textBaseline = "top";
  comboField.x = 130;
  comboField.y = 170;
  comboField.maxWidth = 240;
  
  maxComboField = new createjs.Text("", "15px Pixel", "#804444");
  maxComboField.textAlign = "center";
  maxComboField.textBaseline = "top";
  maxComboField.x = 130;
  maxComboField.y = 200;
  maxComboField.maxWidth = 240;

  qTextField = new createjs.Text("", "bold 40px Pixel", "#483C32");
  qTextField.maxWidth = 240;
  qTextField.textAlign = "center";
  qTextField.textBaseline = "middle";
  qTextField.x = 100;
  qTextField.y = 160;

  qEnglishField = new createjs.Text("", "bold 15px Pixel", "#832A0D");
  qEnglishField.maxWidth = 190;
  qEnglishField.textAlign = "center";
  qEnglishField.textBaseline = "middle";
  qEnglishField.x = 100;
  qEnglishField.y = 200;

  qPanel = new createjs.Container();
  qPanel.x = 30;
  qPanel.y = 150;
  qPanel.width = 200;
  qPanel.height = 250;
  
  qPanel.addChild(qEnglishField);
  qPanel.addChild(qTextField);
  
  const g = new createjs.Graphics();
  g.setStrokeStyle(3);
  g.beginStroke("#000000");
  g.beginFill("white");
  g.drawRoundRect(40, 380, 180, 30, 8);
  const typingBox = new createjs.Shape(g);

  typingField = new createjs.Text("", "bold 16px Courier", "#222222");
  typingField.maxWidth = 160;
  typingField.textAlign = "left";
  typingField.textBaseline = "middle";
  typingField.x = 50;
  typingField.y = 394;

  const lp = new createjs.Shape(new createjs.Graphics().beginBitmapFill(preload2.getResult("lpbg")).drawRect(0, 0, 260, 480));
  lp.name = "leftpanelbg";

  stage.addChild(lp);
  stage.addChild(qPanel);
  stage.addChild(typingBox);
  stage.addChild(typingField);
  stage.addChild(scoreField);
  stage.addChild(comboField);
  stage.addChild(maxComboField);
  stage.addChild(levelField);
  stage.addChild(modeField);
  stage.addChild(debugField);
  stage.update();

  // Start game timer
  if (!createjs.Ticker.hasEventListener("tick")) {
    createjs.Ticker.addEventListener("tick", tick);
  }
}

function tick(event) {
  for (let x in backdrop.moveables) {
    backdrop.moveables[x].tick();
  }
  
  if (game.isPaused()) return;
  
  switch (game.getState()) {
    case GameConfig.STATE_INIT:
      game.changeState(GameConfig.STATE_GAME);
    case GameConfig.STATE_GAME:
      handleGameTick();
      stage.update(event);
      break;
      
    case GameConfig.STATE_ENDING:
      handleGameEnding();
      stage.update(event);
      break;
      
    case GameConfig.STATE_END:
      stage.update(event);
      break;
  }
}

function handleGameTick() {
  // Generate new rock if no active rock
  if (!currRock) {
    typingField.text = "";
    currRock = new Rock();
    currRock.init(preload2.getResult("rock1"), new Question(game.getMode(), Math.floor(Math.random() * BANK.length)));
    rockBelt.push(currRock);
    gamePanel.addChild(currRock);
    qEnglishField.text = currRock.question.english;
    qTextField.text = currRock.question.text;
    createjs.Sound.play(currRock.question.id, createjs.Sound.INTERRUPT_ANY);
  }

  // Scenario 1: bottom reached
  if (currRock) {
    const bounds = currRock.getBounds();
    if (bounds && currRock.y + bounds.height > canvas.height) {
      freezeCurrRock();
    }
  }

  // Scenario 2: check if it has reached other rocks
  if (currRock && rockBelt.length > 1) {
    for (let spaceRock in rockBelt) {
      const r = rockBelt[spaceRock];
      if (!r.launched || r == currRock) continue;
      
      const x_dif = Math.abs(currRock.x - r.x);
      const y_dif = Math.abs(currRock.y - r.y);
      
      if (Math.sqrt((x_dif * 84 / 101) * (x_dif * 84 / 101) + y_dif * y_dif) < 84) {
        if (currRock.y < 0) {
          game.changeState(GameConfig.STATE_ENDING);
          freezeCurrRock();
          break;
        }
        freezeCurrRock();
        break;
      }
    }
  }

  // Scenario 0: Rock recently removed
  if (currRock && freezeCounter == 0 && !currRock.active && !currRock.stuck) {
    const beforeLevel = game.getLevel();
    const beforeScoreAdj = Math.floor(game.getScore() * 0.05);
    const question = currRock.question;
    const textLength = question ? question.text.length : 0;
    
    game.logAction(question, textLength);
    gamePanel.removeChild(currRock);
    createjs.Sound.play("break", createjs.Sound.INTERRUPT_ANY);
    currRock = null;
    
    scoreField.text = game.getScore().toString();
    comboField.text = game.getComboString();
    maxComboField.text = game.getMaxComboString();
    levelField.text = (game.isPractice() ? "----" : "Lv:" + game.getLevel().toString());
    
    if (beforeLevel < game.getLevel()) {
      handleLevelUp();
    }
    
    const afterScoreAdj = Math.floor(game.getScore() * 0.05);
    if (beforeScoreAdj < afterScoreAdj && !game.isPractice()) {
      addBackgroundItem(afterScoreAdj);
    }
  }
  
  // Scenario 0': rock disappearing
  if (currRock && freezeCounter > 0) {
    currRock.alpha = freezeCounter / MAX_FREEZE;
    freezeCounter--;
  }

  if (currRock && currRock.active) {
    currRock.tick(event, game);
  }
}

function handleLevelUp() {
  createjs.Sound.play("levelup", createjs.Sound.INTERRUPT_ANY);
  
  for (let rock in rockBelt) {
    gamePanel.removeChild(rockBelt[rock]);
  }
  rockBelt = [];

  if (game.isMax()) {
    game.changeState(GameConfig.STATE_ENDING);
    return;
  }
  
  showingMsg = new MsgBox();
  showingMsg.init("Level up!!!", "Congratulations!\n\nYou've reached\nLevel " + game.getLevel() + "!\n\nPress Enter \nto Continue");
  showingMsg.show();
  stage.addChild(showingMsg);
  game.pause();
}

function addBackgroundItem(scoreAdj) {
  let bg_item = new createjs.Bitmap(preload2.getResult("bg" + scoreAdj));
  bg_item.x = 260;
  backdrop.addChild(bg_item);
  
  switch (scoreAdj) {
    case 22:
      bg_item = new createjs.Bitmap(preload2.getResult("duck"));
      bg_item.x = 700;
      bg_item.y = 400;
      bg_item.name = "duck";
      bg_item.regX = bg_item.getBounds().width / 2;
      bg_item.regY = bg_item.getBounds().height / 2;
      bg_item.rotation = 0;
      bg_item.rotDirection = 1;
      backdrop.addChild(bg_item);
      bg_item.tick = function() {
        if (Math.abs(this.rotation) > 10) {
          this.rotDirection *= -1;
        }
        this.rotation += 0.1 * this.rotDirection;
      };
      backdrop.moveables.push(bg_item);
      break;
      
    case 25:
      bg_item = new createjs.Bitmap(preload2.getResult("dragon"));
      bg_item.x = 260;
      bg_item.y = 40;
      bg_item.name = "dragon";
      bg_item.regX = bg_item.getBounds().width / 2;
      bg_item.regY = bg_item.getBounds().height / 2;
      bg_item.moveDirection = 1;
      bg_item.moveCount = 0;
      backdrop.addChild(bg_item);
      bg_item.tick = function() {
        this.moveCount += this.moveDirection;
        if (Math.abs(++this.moveCount) > 50) {
          this.moveDirection *= -1;
        }
        this.x = (this.x + 0.15) % 1000;
        this.y = this.y + this.moveDirection * 0.5;
      };
      backdrop.moveables.push(bg_item);
      break;
      
    case 15:
      bg_item = new createjs.Bitmap(preload2.getResult("plane"));
      bg_item.x = 260;
      bg_item.y = 90;
      bg_item.name = "plane";
      bg_item.regX = bg_item.getBounds().width / 2;
      bg_item.regY = bg_item.getBounds().height / 2;
      bg_item.rotation = 0;
      bg_item.moveDirection = 1;
      bg_item.moveCount = 0;
      backdrop.addChild(bg_item);
      bg_item.tick = function() {
        this.moveCount += this.moveDirection;
        if (Math.abs(++this.moveCount) > 20) {
          this.moveDirection *= -1;
        }
        this.x = (this.x + 0.5) % 1000;
        this.y = this.y + this.moveDirection * 0.3;
      };
      backdrop.moveables.push(bg_item);
      break;
      
    case 17:
      bg_item = new createjs.Bitmap(preload2.getResult("junk"));
      bg_item.x = 260;
      bg_item.y = 400;
      bg_item.name = "junk";
      bg_item.regX = bg_item.getBounds().width / 2;
      bg_item.regY = bg_item.getBounds().height / 2;
      bg_item.scaleX = 1.5;
      bg_item.scaleY = 1.5;
      bg_item.rotation = 0;
      bg_item.rotDirection = 1;
      backdrop.addChild(bg_item);
      bg_item.tick = function() {
        if (Math.abs(this.rotation) > 3) {
          this.rotDirection *= -1;
        }
        this.rotation += 0.1 * this.rotDirection;
        this.x = (this.x - 100 + 0.1) % 800 + 100;
      };
      backdrop.moveables.push(bg_item);
      break;
      
    case 3:
      bg_item = new createjs.Bitmap(preload2.getResult("sun"));
      bg_item.x = 730;
      bg_item.y = 50;
      bg_item.name = "sun";
      bg_item.scaleX = 1.5;
      bg_item.scaleY = 1.5;
      bg_item.regX = bg_item.getBounds().width / 2;
      bg_item.regY = bg_item.getBounds().height / 2;
      backdrop.addChild(bg_item);
      bg_item.tick = function() {
        this.rotation += 0.5;
      };
      backdrop.moveables.push(bg_item);
      break;
      
    case 2:
      const bg_item1 = new createjs.Bitmap(preload2.getResult("cloud"));
      bg_item1.x = 300;
      bg_item1.y = 100;
      bg_item1.name = "cloud1";
      backdrop.addChild(bg_item1);
      bg_item1.tick = function() {
        this.x = (this.x - 100 + 0.1) % 700 + 100;
      };
      
      const bg_item2 = new createjs.Bitmap(preload2.getResult("cloud"));
      bg_item2.x = 600;
      bg_item2.y = 200;
      bg_item2.name = "cloud2";
      backdrop.addChild(bg_item2);
      bg_item2.tick = function() {
        this.x = (this.x - 100 + 0.2) % 650 + 100;
      };
      
      backdrop.moveables.push(bg_item1);
      backdrop.moveables.push(bg_item2);
      break;
  }
}

function handleGameEnding() {
  game.changeState(GameConfig.STATE_END);

  if (!game.isMax()) {
    createjs.Sound.play("dead", createjs.Sound.INTERRUPT_ANY);
    showingMsg = new MsgBox();
    
    if (game.isPractice()) {
      showingMsg.init("Try Again!", "You should work\non your" + game.getModeText() + "!\n\nPress Enter\nto Return");
    } else {
      showingMsg.init("Game Over", "The rocks\nhave destroyed\nthe City!!!\n\nClick on the rocks!\n\nPress Enter to \nswitch on the \nTime Machine");
      levelField.text = "輸咗";
    }
    showingMsg.show();
    stage.addChild(showingMsg);
  } else {
    createjs.Sound.play("levelup", createjs.Sound.INTERRUPT_ANY);
    showingMsg = new MsgBox();
    
    if (game.isPractice()) {
      showingMsg.init("Congratulations", "You've finished\n" + game.getModeText() + "!\n\nPress Enter\nto Return");
    } else {
      showingMsg.init("Congratuations", "You've defeated\nthe rocks!!!\nEnjoy the city view.\n\nPress Enter\nto Return");
      levelField.text = "爆機";
    }
    showingMsg.show();
    stage.addChild(showingMsg);
  }
}

function handleKeyDown(e) {
  if (!e) {
    e = window.event;
  }

  const x = e.keyCode;
  
  if (!e.altKey && !e.metaKey) {
    if (!pendingStart && !showingMsg) {
      switch (x) {
        case 61:
        case 187:
          showingMsg = new MsgBox();
          showingMsg.init("GAME PAUSED");
          showingMsg.show();
          stage.addChild(showingMsg);
          game.pause();
          stage.update();
          break;
      }
    }

    if (pendingStart || showingMsg) {
      switch (x) {
        case 13:
          if (showingMsg != null) {
            showingMsg.hide();
            stage.removeChild(showingMsg);
            showingMsg = null;
            game.unpause();
            stage.update();
            
            if (game.getState() == GameConfig.STATE_END) {
              loadHomeScreen();
              doneLoading();
            }
          } else {
            if (pendingStart) {
              restart();
              pendingStart = false;
            }
          }
          break;
          
        case 37:
          screenMode = (screenMode + GameConfig.MODE_NAMES.length - 1) % GameConfig.MODE_NAMES.length;
          updateScreenModeDesc();
          break;
          
        case 39:
          screenMode = (screenMode + 1) % GameConfig.MODE_NAMES.length;
          updateScreenModeDesc();
          break;
      }
      return false;
    }
  }
  
  if (game && game.getState() == GameConfig.STATE_GAME) {
    switch (x) {
      case 8:
        typingField.text = typingField.text.substr(0, typingField.text.length - 1);
        return false;
        
      case 13:
        typingField.text = "";
        return false;
    }
    
    if (!e.altKey && !e.metaKey) {
      if (x == 32 || x >= 65 && x <= 90 || x >= 48 && x <= 54) {
        typingField.text = typingField.text + String.fromCharCode(x).toLowerCase();
        
        if (currRock) {
          if (currRock.check(game.getMode(), typingField.text)) {
            const index = rockBelt.indexOf(currRock);
            rockBelt.splice(index, 1);
            currRock.active = false;
            freezeCounter = MAX_FREEZE;
          }
        }
        return false;
      }
    }
  }
}

function freezeCurrRock() {
  currRock.freeze(preload2.getResult("rock2"));
  createjs.Sound.play("hit", createjs.Sound.INTERRUPT_ANY);
  game.logAction(currRock.question, 0);
  comboField.text = game.getComboString();
  maxComboField.text = game.getMaxComboString();
  currRock = null;
}

function handleKeyUp(e) {
  if (!e) {
    e = window.event;
  }
  return false;
}

function updateScreenModeDesc() {
  for (let i = 0; i < 5; i++) {
    stage.removeChild(modeDesc[i]);
  }
  stage.addChild(modeDesc[screenMode]);
  stage.update();
}
