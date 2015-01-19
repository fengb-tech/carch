var _ = require('lodash')
var events = require('events')
var util = require('util')

var classFactory = require('carch/util/class-factory')

var Coord = require('carch/core/coord')
var Minion = require('carch/core/minion')

module.exports = classFactory(function Hideout(proto){
  this.inherits(events.EventEmitter)

  proto.init = function(options){
    this.superInit()

    this.width = options.width
    this.height = options.height
    this.dirWidth = this.width / 2
    this.dirHeight = this.height / 2
    this.coordOfMinion = {}
    this.minions = []

    this._coordOfResourceStation = {}
    this.resourceStations = []
  }

  proto.origin = Coord.create({ x: 0, y: 0 })

  proto.containsCoord = function(coord){
    return Math.abs(coord.x) < this.dirWidth &&
           Math.abs(coord.y) < this.dirHeight
  }

  proto.actors = function(callback){
    if(!callback){
      var actors = []
      callback = function(actor){
        actors.push(actor)
      }
    }
    this.resourceStations.forEach(callback)
    this.minions.forEach(callback)
    return actors
  }

  proto.addMinion = function(){
    var minion = Minion.create()
    var coord = this.origin
    this.coordOfMinion[minion] = coord
    this.minions.push(minion)
    this.emit('addMinion', this, minion, coord)
    return minion
  }

  proto.addResourceStation = function(resourceStation, coord){
    this._coordOfResourceStation[resourceStation] = coord
    this.resourceStations.push(resourceStation)
    this.emit('addResourceStation', this, resourceStation, coord)
    return resourceStation
  }

  proto.nearestResourceStationCoordTo = function(type, coord){
    // FIXME
    for(var i = 0; i < this.resourceStations.length; i++){
      var resourceStation = this.resourceStations[i]
      if(resourceStation.type === type) {
        return this._coordOfResourceStation[resourceStation]
      }
    }
  }

  proto.moveMinion = function(minion, toCoord){
    var fromCoord = this.coordOfMinion[minion]
    this.coordOfMinion[minion] = toCoord
    minion.emit('move', minion, fromCoord, toCoord)
    return true
  }

  proto.coordOf = function(actor){
    switch(actor.className){
      case 'Minion':
        return this.coordOfMinion[actor]
        break
      case 'ResourceStation':
        return this._coordOfResourceStation[actor]
        break
    }
  }

  proto.tickTo = _.noop
})
