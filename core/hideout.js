var _ = require('lodash')
var events = require('events')
var util = require('util')

var classFactory = require('carch/util/class-factory')
var time = require('carch/util/time')

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
    this._movingCoords = {}
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

  proto.moveActor = function(minion, toCoord){
    var fromCoord = this._coords[minion]
    this._coords[minion] = toCoord
    var now = time.now()
    var toTime = now + time.ms(500)
    this._movingCoords[minion] = {
      fromTime: now,
      toTime: toTime,
      fromCoord: fromCoord,
      toCoord: toCoord,
    }
    minion.emit('move', minion, fromCoord, toCoord)

    var self = this
    setTimeout(function(){
      minion.emit('stop', minion, fromCoord, toCoord)
      delete self._movingCoords[minion]
    }, toTime - now + 50)

    return true
  }

  proto.coordOf = function(actor, snapshotTime){
    if(this._movingCoords[actor] && snapshotTime < this._movingCoords[actor].toTime){
      var movingCoords = this._movingCoords[actor]
      var duration = snapshotTime - movingCoords.fromTime
      if(duration < 0){
        return movingCoords.fromCoord
      } else {
        var frac = duration / (movingCoords.toTime - movingCoords.fromTime)
        return movingCoords.fromCoord.lerp(movingCoords.toCoord, frac)
      }
    } else {
      return this._coords[actor]
    }
  }

  proto.tickTo = _.noop
})
