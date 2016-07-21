(function (window) {
  
  function Rock(){
    this.Container_constructor();
  
    this.active = false;
    this.launched = false;
    this.stuck = false;
    this.question = null;
    this.x = Math.random() * (540 - 101);
    this.y = -80;  
  }

  var p = createjs.extend(Rock, createjs.Container);
  
  p.active;
  p.launched;
  p.question;
  p.x;
  p.y;  

//public methods

  p.init = function(rock_shape, q){
    this.question = q;

    this.rock = new createjs.Bitmap(rock_shape);
    this.rock.x = 0;
    this.rock.y = 0;

    this.label = new createjs.Text(q.text, "20px Arial", "#FFFFFF");
    this.label.maxWidth = 90;
    this.label.textAlign = "center";
    this.label.textBaseline = "middle";
    this.label.x = this.rock.getBounds().width / 2;
    this.label.y = this.rock.getBounds().height /2;
  
    this.addChild(this.rock);
    this.addChild(this.label);
    
    this.on("click", function() {
        var inst = createjs.Sound.play(this.question.id, createjs.Sound.INTERRUPT_ANY);
    });
    
    this.launched = true;
    this.active = true;
  };

  p.check = function(mode, answer){
    return this.question.check(mode, answer);
  };
  
  p.tick = function(event, game){
    var velocity = getVelocity(game.getMode(), game.getLevel()) / Math.pow(this.question.text.length, 0.5);
    this.y += velocity; 
  };
  
  p.freeze = function(rock_shape){
    
    this.active = false;
    this.stuck = true;
    this.removeChild(this.rock);
    this.rock = new createjs.Bitmap(rock_shape);
    this.rock.x = 0;
    this.rock.y = 0;    
    this.addChild(this.rock);
    this.removeChild(this.label);
    this.label.color = "#DDDDDD";
    this.label.text = this.question.lshk;
    this.label.maxWidth = 80;
    this.addChild(this.label);    
  };
  
  window.Rock = createjs.promote(Rock, "Container");
}(window));