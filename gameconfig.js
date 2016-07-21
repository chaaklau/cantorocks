/*
 * var MODE_REGULAR = 0;
 * var MODE_FULL = 1;
 * var MODE_INITIAL = 2;
 * var MODE_MEDIAL = 3;
 * var MODE_FINAL = 4;
 * var MODE_TONE = 5;
 * 
 */
var MODE_NAMES = ["Normal", "Full", "Initials", "Medials", "Finals", "Tones"];
var MAX_LEVEL = [6,6,2,2,2,2];
var VELOCITIES = [1,1.5,2,2.5,3]; 
var LEVELBOUND = [-1,32,64,128,256,512,9999999];

function getVelocity(mode, level){
  if (level < MAX_LEVEL[mode]) return VELOCITIES[level-1];
  return 0;
}
