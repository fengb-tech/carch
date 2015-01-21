var events = require('events')

var classFactory = require('carch/util/class-factory')

module.exports = classFactory('ResourceStation', function(proto){
  this.inherits(events.EventEmitter)

  proto.init = function(options){
    this.hideout = options.hideout
    this.type = options.type
    this.rate = options.rate
    this.textureName = 'resourcestation-' + options.type
  }

  proto.coord = function(targetTime){
    return this.hideout.coordOf(this, targetTime)
  }
})
