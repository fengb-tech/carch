var PIXI = require('pixi')
var _ = require('lodash')

var classFactory = require('carch/util/class-factory')
var time = require('carch/util/time')

var Minion = require('carch/core/minion')

var texture = _.once(function(){
  return PIXI.Texture.fromImage('/minion.png')
})

module.exports = classFactory(function MinionView(proto){
  proto.init = function(options){
    options = options || {}
    this.minion = options.minion
    this.sprite = new PIXI.Sprite(texture())
    if(options.coord){
      var displayCoord = this.displayCoord(options.coord)
      this.sprite.position.x = displayCoord[0]
      this.sprite.position.y = displayCoord[1]
    }

    this.minion.on('move', _.bind(this.onMove, this))
  }

  proto.tickTo = function(targetTime){
    if(this._tickDisplayCoord){
      this._tickDisplayCoord(targetTime)
    }
  }

  proto.onMove = function(minion, fromCoord, toCoord){
    var startMoveTime = time.timestamp()
    var totalDiffTime = time.sec(1)
    var endMoveTime = startMoveTime + totalDiffTime

    var fromDisplayCoord = this.displayCoord(fromCoord)
    var toDisplayCoord = this.displayCoord(toCoord)

    this._tickDisplayCoord = function(targetTime){
      if(targetTime >= endMoveTime){
        this.sprite.position.x = toDisplayCoord[0]
        this.sprite.position.y = toDisplayCoord[1]
        delete this._tickDisplayCoord
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

  proto.displayCoord = function(coord){
    return [coord[0] * 16, coord[1] * 16]
  }
})
