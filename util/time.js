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
  for(var key in options){
    val += time[key](options[key])
  }
  return val
}

time.now = function(){
  // Offsets based on UTC timestamp for synchronization reasons.
  var baseTime
  if(typeof performance === 'object' && typeof performance.now === 'function'){
    var perf = performance
    baseTime = Date.now() - perf.now()

    return function now(){
      return baseTime + perf.now()
    }
  } else if(typeof process === 'object' && typeof process.hrtime === 'function'){
    var baseHrt = process.hrtime()
    baseTime = Date.now()

    return function now(){
      var hrt = process.hrtime(baseHrt)
      return baseTime + time({ sec: hrt[0], ns: hrt[1] })
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
