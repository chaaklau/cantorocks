var VELOCITIES = [1,1.5,2,4,7,20,20]; 
//var LEVELBOUND = [0,32,64,128,256,512,768,9999999];
var LEVELBOUND = [0,0,0,0,1,2,9999999];

function getVelocity(level){
  try {
    return VELOCITIES[level-1];
  } 
  catch (e) {
    return VELOCITIES[VELOCITIES.length-1];
  }
  return false;
}
