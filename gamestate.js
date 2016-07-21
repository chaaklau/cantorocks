var MODE_REGULAR = 0;
var MODE_FULL = 1;
var MODE_INITIAL = 2;
var MODE_FINAL = 3;
var MODE_TONE = 4;

var INIT_STATE = 0;
var GAME_STATE = 1;
var ENDINGGAME_STATE = 2;
var ENDGAME_STATE = 3;
  
  function GameState(_mode){
    var mode = _mode;
    var state = INIT_STATE;
    var pause_state = false;
    var history = [];
    var combo = 0;
    var maxCombo = 0;

    //Privileged methods
    
    this.getState = function(){
      return state;
    };
    
    this.pause = function(){
      pause_state = true;
    };
    
    this.unpause = function(){
      pause_state = false;
    };
    
    this.isPaused = function(){
      return pause_state;
    };
    
    this.changeState = function(newState){
    //check_validity
    //INIT_STATE(0) -> GAME_STATE(1) ->  ENDINGGAME_STATE(2) -> ENDGAME_STATE(3)
    
      if (newState - state == 1) {
        state = newState;
      } else {
        throw "Incorrect state transition"; 
      }
    };
	  
  	this.logAction = function(question, score){
  	  history.push({"question":question, "score":score});
  	  if (!score) {
  	    combo = 0;
  	  } else {
  	    combo++;
  	    if (maxCombo < combo) {
  	      maxCombo = combo;
  	    }
  	  }
  	};

    this.getCombo = function(){
      return combo;
    };
    
    this.getComboString = function() {
      if (!combo) return "";
      return combo.toString() + " Combo" + (combo>1?"s":"");
    };
    this.getMaxCombo = function(){
      return maxCombo;
    };
    this.getMaxComboString = function() {
      if (!maxCombo) return "";
      return "Max: " + maxCombo.toString();
    };	

    this.getScore = function(){
  	  var sum = 0;
  	  for (x in history) {
  	    sum += history[x].score;
  	  }
  	  return sum;
    };
    
    this.getLevel = function(){
      var s = this.getScore();
      for (x in LEVELBOUND){
        if (s < LEVELBOUND[x]) return x*1;        
      }
      return -1;
    };
    
    this.getMode = function(){
      return mode;
    };

    this.getModeText = function(){
      return MODE_NAMES[mode];
    };

    this.isMax = function(){
      return this.getLevel() == MAX_LEVEL[mode];
    };
    
    this.isPractice = function(){
      return mode != MODE_REGULAR && mode != MODE_FULL;
    };
  }
  


