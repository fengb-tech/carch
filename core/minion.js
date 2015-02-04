var events = require('events')

var classFactory = require('carch/util/class-factory')

var MinionResources = require('carch/core/minion-resources')

module.exports = classFactory('Minion', function(proto){
  this.inherits(events.EventEmitter)

  proto.init = function(options){
    options = options || {}
    this.hideout = options.hideout

    this.resources = MinionResources.create()
  }

  proto.tickTo = function(targetTime){
    this.resources.tickTo(targetTime)
  }

  proto.coord = function(targetTime){
    return this.hideout.coordOf(this, targetTime)
  }
})
