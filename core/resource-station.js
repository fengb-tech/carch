var events = require('events')

var classFactory = require('carch/util/class-factory')

module.exports = classFactory('ResourceStation', function(proto){
  this.inherits(events.EventEmitter)

  proto.init = function(options){
    this.type = options.type
    this.rate = options.rate
    this.textureName = 'resourcestation-' + options.type
  }
})
