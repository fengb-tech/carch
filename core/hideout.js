var _ = require('lodash')
var events = require('events')
var util = require('util')

var classFactory = require('carch/util/class-factory')

var Coord = require('carch/core/coord')
var Minion = require('carch/core/minion')

module.exports = classFactory('Hideout', function(proto){
  this.inherits(events.EventEmitter)

  proto.init = function(options){
    this.width = options.width
    this.height = options.height
    this.dirWidth = this.width / 2
    this.dirHeight = this.height / 2
    this.minions = []

    this.resourceStations = []

    this._coords = {}
  }

  proto.origin = Coord.create({ x: 0, y: 0 })

  proto.containsCoord = function(coord){
    return Math.abs(coord.x) < this.dirWidth &&
           Math.abs(coord.y) < this.dirHeight
  }

  proto.actors = function(callback){
    var actors = []
    if(!callback){
      callback = function(actor){
        actors.push(actor)
      }
    }
    this.resourceStations.forEach(callback)
    this.minions.forEach(callback)
    return actors
  }

  proto.addMinion = function(){
    var minion = Minion.create({ hideout: this })
    var coord = this.origin
    this._coords[minion] = coord
    this.minions.push(minion)
    this.emit('addMinion', this, minion, coord)
    return minion
  }

  proto.addResourceStation = function(resourceStation, coord){
    resourceStation.hideout = this
    this._coords[resourceStation] = coord
    this.resourceStations.push(resourceStation)
    this.emit('addResourceStation', this, resourceStation, coord)
    return resourceStation
  }

  proto.nearestResourceStationCoordTo = function(type, coord){
    // FIXME
    for(var i = 0; i < this.resourceStations.length; i++){
      var resourceStation = this.resourceStations[i]
      if(resourceStation.type === type) {
        return this._coords[resourceStation]
      }
    }
  }

  proto.moveMinion = function(minion, toCoord){
    var fromCoord = this._coords[minion]
    this._coords[minion] = toCoord
    minion.emit('move', minion, fromCoord, toCoord)
    minion.emit('stop', minion, fromCoord, toCoord)
    return true
  }

  proto.moveResourceStation = function(resourceStation, toCoord){
    var fromCoord = this._coords[resourceStation]
    this._coords[resourceStation] = toCoord
    resourceStation.emit('move', resourceStation, fromCoord, toCoord)
    resourceStation.emit('stop', resourceStation, fromCoord, toCoord)
    return true
  }

  proto.moveActor = function(actor, toCoord){
    switch(actor.cfName){
      case 'Minion':
        this.moveMinion(actor, toCoord)
        break;
      case 'ResourceStation':
        this.moveResourceStation(actor, toCoord)
        break
    }
  }

  proto.coordOf = function(actor){
    return this._coords[actor]
  }

  proto.tickTo = _.noop
})
