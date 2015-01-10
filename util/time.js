/* globals performance */

var NS_PER_US    = 1000
var US_PER_MS    = 1000
var MS_PER_SEC   = 1000
var SEC_PER_MIN  =   60
var MIN_PER_HOUR =   60
var HOUR_PER_DAY =   24
var DAY_PER_YEAR =  365

var US_PER_NS    = 1 / NS_PER_US
var MS_PER_US    = 1 / US_PER_MS

var time = module.exports = function(options){
  var val = 0

  var keys = Object.keys(options)
  for(var i=0; i < keys.length; i++){
    var key = keys[i]
    val += time[key](options[key])
  }

  return val
}

time.loadTime = Date.now()

time.timestamp = function(){
  // Offsets based on UTC timestamp for synchronization reasons.
  if(typeof performance === 'object' && typeof performance.now === 'function'){
    if(performance.timing && performance.timing.navigationStart) {
      time.loadTime = performance.timing.navigationStart
    } else {
      time.loadTime -= performance.now()
    }
    return function timestamp(){
      return time.loadTime + performance.now()
    }
  } else if(typeof process === 'object' && typeof process.hrtime === 'function'){
    var baseline = process.hrtime()
    return function timestamp(){
      var hrt = process.hrtime(baseline)
      return time.loadTime + time({ sec: hrt[0], ns: hrt[1] })
    }
  } else {
    return Date.now
  }
}()

time.ns = function(ns){
  return MS_PER_US * US_PER_NS * ns
}

time.µs = time.us = function(us){
  return MS_PER_US * us
}

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
