/*
 * var MODE_REGULAR = 0;
 * var MODE_FULL = 1;
 */

var MODE_NAMES = ["Normal", "Full"];
var MAX_LEVEL = [2,2];
var VELOCITIES = [0.5,0.75,1,1.25,1.5]; 
var LEVELBOUND = [-1,125,9999999,9999999,9999999,9999999,9999999];

function getVelocity(mode, level){
  if (level < MAX_LEVEL[mode]) return VELOCITIES[level-1];
  return 0;
}
