var classFactory = require('carch/util/class-factory')
var time = require('carch/util/time')

var DRAIN_100 = {
  food:   time.min(15),
  energy: time.hour(1),
}

var RESOURCES = Object.keys(DRAIN_100)

module.exports = classFactory('MinionResources', function(proto){
  proto.init = function(options){
    options = options || {}
    this.lastTick = options.lastTick || time.now()

    for(var i = 0; i < RESOURCES.length; i++){
      var resource = RESOURCES[i]
      this[resource] = 100
    }
  }

  proto.tickTo = function(targetTime){
    if(targetTime <= this.lastTick){
      return
    }

    var diff = targetTime - this.lastTick
    for(var i = 0; i < RESOURCES.length; i++){
      var resource = RESOURCES[i]
      var drain = diff / DRAIN_100[resource] * 100
      this[resource] -= drain
    }
    this.lastTick = targetTime
  }
})
