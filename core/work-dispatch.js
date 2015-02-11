var _ = require('lodash')

var classFactory = require('carch/util/class-factory')

module.exports = classFactory('WorkDispatch', function(proto){
  proto.init = function(options){
    this.hideout = options.hideout
    this.hideout.on('addMinion', _.bind(this.onAddMinion, this))
  }

  proto.onAddMinion = function(hideout, minion, coord){
    minion.resources.on('next', _.bind(this.onNextResource, this))
  }

  proto.onNextResource = function(timestamp, minion){
    var resource = minion.resources.next()
    if(!resource) {
      return
    }

    var targetCoord = this.hideout.nearestResourceStationCoordTo(resource, minion.coord())
    this.hideout.moveActor(minion, targetCoord)
  }
})
