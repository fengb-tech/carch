var appRoot = require('app-root-path')

var time = require(appRoot + '/core/time')

var Minion = module.exports = function(options){
  this.init(options)
}

var proto = Minion.prototype

proto.init = function(options){
  options = options || {}
  this.energy = options.energy || 100
  this.satiety = options.satiety || 100
  this.lastTick = options.lastTick || Date.now()
}

proto.tickTo = function(targetTime){
  if(targetTime <= this.lastTick){
    return
  }

  var diff = targetTime - this.lastTick
  this.energy -= diff / time.hour(1) * 100
  this.satiety -= diff / time.min(15) * 100
  this.lastTick = targetTime
}
