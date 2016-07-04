
  var INIT_STATE = 0;
  var GAME_STATE = 1;
  var ENDINGGAME_STATE = 2;
  var ENDGAME_STATE = 3;
  
  function GameState(){
    var state = INIT_STATE;
    var history = [];

    //Privileged methods
    
    this.getState = function(){
      return state;
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
        if (s < LEVELBOUND[x]) return x;        
      }
      return -1;
    };
  }
  


