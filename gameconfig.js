var MAX_LEVEL = 5;
var VELOCITIES = [1,1.5,3,6,10]; 
//var LEVELBOUND = [0,32,64,128,256,512];
var LEVELBOUND = [0,10,64,128,256,512];

function getVelocity(level){
  if (level < MAX_LEVEL) return VELOCITIES[level-1];
  return 0;
}
