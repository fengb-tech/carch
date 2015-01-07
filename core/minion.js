var Minion = module.exports = function(options){
  this.init(options)
}

var proto = Minion.prototype

proto.init = function(options){
  options = options || {}
  this.energy = options.energy || 100
  this.lastTick = options.lastTick || +new Date()
}

proto.tick = function(time){
  this.energy = 0
  this.lastTick = time
}
