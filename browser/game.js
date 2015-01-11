var PIXI = require('pixi')

var colors = require('carch/browser/colors')
var HideoutView = require('carch/browser/hideout-view')

var classFactory = require('carch/util/class-factory')

var Hideout = require('carch/core/hideout')
var TickManager = require('carch/core/tick-manager')

module.exports = classFactory(function Game(proto){
  proto.init = function(options){
    options = options || {}

    this.hideout = options.hideout || Hideout.create()
    this.viewTickManager = TickManager.create()
    this.stage = new PIXI.Stage(colors.DARK_BROWN)

    this.hideoutView = HideoutView.create({
      hideout: this.hideout,
      tickManager: this.viewTickManager,
      pixiContainer: this.stage,
    })
  }

  proto.tickTo = function(targetTime){
    this.viewTickManager.tickTo(targetTime)
  }

  proto.loop = function(renderer){
    var self = this
    requestAnimationFrame(function(testTimestamp){
      if(testTimestamp < 1e12){
        // DOMHighResTimeStamp = milliseconds since page load, not UNIX EPOCH
        var base = Date.now() - testTimestamp
        requestAnimationFrame(function gameLoop(hrTimestamp){
          var timestamp = base + hrTimestamp
          self.tickTo(timestamp)
          renderer.render(self.stage)
          requestAnimationFrame(gameLoop)
        })
      } else {
        requestAnimationFrame(function gameLoop(timestamp){
          self.tickTo(timestamp)
          renderer.render(self.stage)
          requestAnimationFrame(gameLoop)
        })
      }
    })
  }
})
