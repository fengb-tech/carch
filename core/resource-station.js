var events = require('events')

var classFactory = require('carch/util/class-factory')

module.exports = classFactory(function ResourceStation(proto){
  this.inherits(events.EventEmitter)

  proto.init = function(options){
    this.superInit()

    this.type = options.type
    this.rate = options.rate
    this.textureName = 'resourcestation-' + options.type
  }
})
