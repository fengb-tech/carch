var _ = require('lodash')
var PIXI = require('pixi')

var classFactory = require('carch/util/class-factory')
var time = require('carch/util/time')

var Minion = require('carch/core/minion')

var texture = _.once(function(){
  return PIXI.Texture.fromImage('/minion.png')
})

module.exports = classFactory(function MinionView(proto){
  proto.init = function(options){
    options = options || {}

    this.tickManager = options.tickManager
    this.displayCoord = options.displayCoord
    this.minion = options.minion
    this.sprite = new PIXI.Sprite(texture())
    if(options.coord){
      var displayCoord = this.displayCoord(options.coord)
      this.sprite.position.x = displayCoord[0]
      this.sprite.position.y = displayCoord[1]
    }

    this.minion.on('move', _.bind(this.onMove, this))
  }

  proto.tickTo = _.noop

  proto.onMove = function(minion, fromCoord, toCoord){
    var fromDisplayCoord = this.displayCoord(fromCoord)
    var toDisplayCoord = this.displayCoord(toCoord)

    var startMoveTime = time.now()
    var totalDiffTime = time.sec(0.5)
    var endMoveTime = startMoveTime + totalDiffTime

    this.tickManager.add(this)
    this.tickTo = function(targetTime){
      if(targetTime >= endMoveTime){
        this.sprite.position.x = toDisplayCoord[0]
        this.sprite.position.y = toDisplayCoord[1]
        this.tickTo = _.noop
        this.tickManager.remove(this)
        return
      }
      var percentTime = (targetTime - startMoveTime) / totalDiffTime
      this.sprite.position.x = this.lerp(fromDisplayCoord[0], toDisplayCoord[0], percentTime)
      this.sprite.position.y = this.lerp(fromDisplayCoord[1], toDisplayCoord[1], percentTime)
    }
  }

  proto.lerp = function(from, to, percent){
    var diff = to - from
    return from + diff * percent
  }
})
