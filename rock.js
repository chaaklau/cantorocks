(function (window) {
  
  var velocity = 0;
  
  function Rock(){
    this.Container_constructor();
  
    this.active = false;
    this.launched = false;
    this.question = null;
    this.x = Math.random() * (540 - 80);
    this.y = -100;  
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

    this.label = new createjs.Text(q.text, "20px Helvetica", "#FFFFCC");
    this.label.maxWidth = 80;
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
  }

  String.prototype.replaceAll = function(search, replacement) {
      var target = this;
      return target.replace(new RegExp(search, 'g'), replacement);
  };

  p.check = function(answer){
    return answer.toLowerCase().replaceAll(" ","") == this.question.lshk.toLowerCase().replaceAll(" ","");
  }
  
  p.tick = function(event){
    velocity = Math.log(Math.pow(score+10,1.5)) - 4;
    //debugField.text = velocity.toString();
    this.y += velocity; 
  }
  p.freeze = function(rock_shape){
    
    this.active = false;
    this.removeChild(this.rock);
    this.rock = new createjs.Bitmap(rock_shape);
    this.rock.x = 0;
    this.rock.y = 0;    
    this.addChild(this.rock);
    this.removeChild(this.label);
    this.label.color = "#DDDDDD";
    this.label.text = this.question.lshk;
    this.addChild(this.label);    
  }
  
  window.Rock = createjs.promote(Rock, "Container");
}(window));
  
  


