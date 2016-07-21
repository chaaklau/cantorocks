(function (window) {
  
  function MsgBox(){
    this.Container_constructor();
    
    this.x = 0;
    this.y = 240;
    this.width = 260;
    this.height = 240;
    this.title = "";
    this.message = "";  
  }

  var p = createjs.extend(MsgBox, createjs.Container);
  
//public methods

  p.init = function(title, message){
    
    this.title = title;
    this.message = message;
    
    box = new createjs.Shape();
    box.graphics.setStrokeStyle(4,"round")
        .beginStroke("#800000").beginFill('#CD853F')
        .drawRoundRectComplex (0, 0, this.width, this.height,10 , 10, 10, 10)
        .endFill();
    box.alpha = 1;

    this.title_label = new createjs.Text(this.title, "bold 20px Pixel", "#FFFFAA");
    this.title_label.maxWidth = 240;
    this.title_label.textAlign = "left";
    this.title_label.textBaseline = "top";
    this.title_label.x = 15;
    this.title_label.y = 15;
    
    this.message_label = new createjs.Text(this.message, "14px Pixel", "#FFFFFF");
    this.message_label.maxWidth = 240;
    this.message_label.textAlign = "left";
    this.message_label.textBaseline = "top";
    this.message_label.lineHeight = "20";
    this.message_label.x = 10;
    this.message_label.y = 60;    
  };

  p.show = function(){
    this.addChild(box);
    this.addChild(this.message_label);
    this.addChild(this.title_label);
  };

  p.hide = function(){
    this.removeAllChildren();    
  };
  
  window.MsgBox = createjs.promote(MsgBox, "Container");
}(window));
  
  


