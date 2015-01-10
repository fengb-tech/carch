var MS_PER_SEC   = 1000
var SEC_PER_MIN  =   60
var MIN_PER_HOUR =   60
var HOUR_PER_DAY =   24
var DAY_PER_YEAR =  365

var time = module.exports = function(options){
  var val = 0

  var keys = Object.keys(options)
  for(var i=0; i < keys.length; i++){
    var key = keys[i]
    val += time[key](options[key])
  }

  return val
}

time.now = Date.now

time.ms = function(ms){
  return ms
}

time.sec = function(sec){
  return MS_PER_SEC * sec
}

time.min = function(min){
  return MS_PER_SEC * SEC_PER_MIN * min
}

time.hour = function(hour){
  return MS_PER_SEC * SEC_PER_MIN * MIN_PER_HOUR * hour
}

time.day = function(day){
  return MS_PER_SEC * SEC_PER_MIN * MIN_PER_HOUR * HOUR_PER_DAY * day
}

time.year = function(year){
  return MS_PER_SEC * SEC_PER_MIN * MIN_PER_HOUR * HOUR_PER_DAY * DAY_PER_YEAR * year
}
