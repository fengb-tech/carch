var _ = require('lodash')
var events = require('events')
var util = require('util')

var classFactory = require('carch/util/class-factory')

var Minion = require('carch/core/minion')

module.exports = classFactory(function Hideout(proto){
  this.inherits(events.EventEmitter)

  proto.init = function(options){
    this.superInit()

    this.coordOfMinion = {}
  }

  proto.origin = [0, 0]

  proto.addMinion = function(){
    var minion = Minion.create()
    var coord = this.origin
    this.coordOfMinion[minion] = coord
    this.emit('addMinion', this, minion, coord)
    return minion
  }

  proto.moveMinion = function(minion, toCoord){
    var fromCoord = this.coordOfMinion[minion]
    this.coordOfMinion[minion] = toCoord
    minion.emit('move', minion, fromCoord, toCoord)
  }

  proto.tickTo = _.noop()
})
