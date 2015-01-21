var events = require('events')

var classFactory = require('carch/util/class-factory')
var time = require('carch/util/time')

module.exports = classFactory('Minion', function(proto){
  this.inherits(events.EventEmitter)

  proto.init = function(options){
    options = options || {}
    this.energy = options.energy || 100
    this.satiety = options.satiety || 100
    this.lastTick = options.lastTick || time.now()
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
})
