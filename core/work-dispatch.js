var _ = require('lodash')

var classFactory = require('carch/util/class-factory')

var WorkDispatch = module.exports = function(options){
  this.on('addMinion', _.bind(this.onAddMinion, this))
}

WorkDispatch.prototype.onAddMinion = function(hideout, minion, coord){
  minion.resources.on('next', _.bind(this.onNextResource, this))
}

WorkDispatch.prototype.onNextResource = function(timestamp, minion){
  var resource = minion.resources.next()
  if(!resource) {
    return
  }

  var targetCoord = this.nearestResourceStationCoordTo(resource, minion.coord())
  this.moveActor(minion, targetCoord)
}
