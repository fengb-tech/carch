var _ = require('lodash')
var PIXI = require('pixi.js')

var classFactory = require('carch/util/class-factory')
var time = require('carch/util/time')

var texture = _.memoize(function(name){
  return PIXI.Texture.fromImage('/'+name.toLowerCase()+'.png')
})

module.exports = classFactory(function ActorView(proto){
  proto.init = function(options){
    options = options || {}

    this.tickManager = options.tickManager
    this.displayCoord = options.displayCoord
    this.actor = options.actor
    this.textureName = options.actorName || options.actor.className
    this.sprite = new PIXI.Sprite(texture(this.textureName))
    if(options.coord){
      this.displayCoord(options.coord, this.sprite.position)
    }

    this.actor.on('move', _.bind(this.onMove, this))
  }

  proto.tickTo = _.noop

  proto.onMove = function(actor, fromCoord, toCoord){
    var fromDisplayCoord = this.displayCoord(fromCoord)
    var toDisplayCoord = this.displayCoord(toCoord)

    var startMoveTime = time.now()
    var totalDiffTime = time.sec(0.5)
    var endMoveTime = startMoveTime + totalDiffTime

    this.tickManager.add(this)
    this.tickTo = function(targetTime){
      if(targetTime >= endMoveTime){
        this.sprite.position.x = toDisplayCoord.x
        this.sprite.position.y = toDisplayCoord.y
        this.tickTo = _.noop
        this.tickManager.remove(this)
        return
      }
      var percentTime = (targetTime - startMoveTime) / totalDiffTime
      fromDisplayCoord.lerp(toDisplayCoord, percentTime, this.sprite.position)
    }
  }
})
