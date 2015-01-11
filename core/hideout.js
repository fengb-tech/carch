var _ = require('lodash')
var events = require('events')
var util = require('util')

var classFactory = require('carch/util/class-factory')

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
  }

  proto.origin = [0, 0]

  proto.containsCoord = function(coord){
    return Math.abs(coord[0]) < this.dirWidth &&
           Math.abs(coord[1]) < this.dirHeight
  }

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
    return true
  }

  proto.tickTo = _.noop()
})
