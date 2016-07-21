/*
 * var MODE_REGULAR = 0;
 * var MODE_FULL = 1;
 * var MODE_INITIAL = 2;
 * var MODE_FINAL = 3;
 * var MODE_TONE = 4;
 * 
 */
var MODE_NAMES = ["Normal", "Full", "Initials", "Finals", "Tones"];
var MAX_LEVEL = [6,6,2,2,2];
var VELOCITIES = [0.5,0.75,1,1.25,1.5]; 
var LEVELBOUND = [-1,32,64,128,256,512,9999999];

function getVelocity(mode, level){
  if (level < MAX_LEVEL[mode]) return VELOCITIES[level-1];
  return 0;
}
