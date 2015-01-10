var util = require('util')
var events = require('events')

var classFactory = require('carch/core/class-factory')
var Minion = require('carch/core/minion')

module.exports = classFactory(function Hideout(proto){
  this.inherits(events.EventEmitter)

  proto.init = function(options){
    this.superInit()

    this.coordOfMinion = {}
    this.minionOfCoord = {}
  }

  proto.addMinion = function(){
    var minion = Minion.create()
    var coord = [0, 0]
    this.minionOfCoord[coord] = minion
    this.coordOfMinion[minion] = coord
    this.emit('addMinion', this, minion, coord)
    return minion
  }

  proto.moveMinion = function(minion, toCoord){
    var fromCoord = this.coordOfMinion[minion]
    this.coordOfMinion[minion] = toCoord
    this.emit('moveMinion', this, minion, fromCoord, toCoord)
    minion.emit('move', minion, fromCoord, toCoord)
  }

  proto.tick = function(){
  }
})
