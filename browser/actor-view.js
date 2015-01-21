var _ = require('lodash')
var PIXI = require('pixi.js')
var events = require('events')

var classFactory = require('carch/util/class-factory')
var time = require('carch/util/time')

var colors = require('carch/browser/colors')

var texture = _.memoize(function(name){
  return PIXI.Texture.fromImage('/'+name+'.png')
})

module.exports = classFactory('ActorView', function(proto){
  this.inherits(events.EventEmitter)

  proto.init = function(options){
    options = options || {}

    this.tickManager = options.tickManager
    this.displayCoord = options.displayCoord
    this.actor = options.actor
    this.textureName = options.actor.textureName || options.actor.cfName.toLowerCase()
    this.sprite = new PIXI.Sprite(texture(this.textureName))
    this.sprite.interactive = true
    if(options.coord){
      this.displayCoord(options.coord, this.sprite.position)
    }

    this.actor.on('move', _.bind(this.onMove, this))

    this.sprite.click = _.bind(this.select, this)
  }

  proto.tickTo = _.noop

  proto.deselect = function(){
    if(!this.selected){
      return
    }

    this.selected = false
    this.emit('deselect', this)

    this.sprite.removeChild(this.selectionBox)
    delete this.selectionBox
  }

  proto.select = function(){
    if(this.selected){
      return
    }

    this.selected = true
    this.emit('select', this)

    var bounds = this.sprite.getBounds()
    var box = this.selectionBox = new PIXI.Graphics()
    box.lineStyle(2, colors.YELLOW)
    box.drawRect(0, 0, bounds.width, bounds.height)
    this.sprite.addChild(box)
  }

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
