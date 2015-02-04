var _ = require('lodash')
var PIXI = require('pixi.js')
var events = require('events')

var classFactory = require('carch/util/class-factory')

var colors = require('carch/browser/colors')

var texture = _.memoize(function(name){
  return PIXI.Texture.fromImage('/'+name+'.png')
})

module.exports = classFactory('ActorView', function(proto){
  this.inherits(events.EventEmitter)

  proto.init = function(options){
    options = options || {}

    this.eventManager = options.eventManager
    this.displayCoord = options.displayCoord
    this.actor = options.actor
    this.textureName = options.actor.textureName || options.actor.cfName.toLowerCase()
    this.sprite = new PIXI.Sprite(texture(this.textureName))
    this.sprite.interactive = true
    if(options.coord){
      this.displayCoord(options.coord, this.sprite.position)
    }

    this.actor.on('move', _.bind(this.onMove, this))
    this.actor.on('stop', _.bind(this.onStop, this))

    this.sprite.click = _.bind(this.select, this)
  }

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

  proto.onMove = function(_){
    this.eventManager.addTicker(this)
  }

  proto.onStop = function(_){
    this.eventManager.removeTicker(this)
  }

  proto.tickTo = function(targetTime){
    var modelCoord = this.actor.coord(targetTime)
    this.displayCoord(modelCoord, this.sprite)
  }
})
