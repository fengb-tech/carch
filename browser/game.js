/* globals performance, requestAnimationFrame */

var PIXI = require('pixi.js')

var colors = require('carch/browser/colors')
var HideoutView = require('carch/browser/hideout-view')

var classFactory = require('carch/util/class-factory')
var time = require('carch/util/time')

var EventManager = require('carch/core/event-manager')

module.exports = classFactory('Game', function(proto){
  proto.init = function(options){
    options = options || {}

    this.hideout = options.hideout
    this.hideout.eventManager = this.eventManager = EventManager.create()
    this.stage = new PIXI.Stage(colors.BLACK)
    this.stage.interactive = true

    this.hideoutView = HideoutView.create({
      hideout: this.hideout,
      eventManager: this.eventManager,
      pixiContainer: this.stage,
    })
  }

  proto.tickTo = function(targetTime){
    this.eventManager.tickTo(targetTime)
  }

  proto.loop = function(renderer){
    var self = this
    // DOMHighResTimeStamp = milliseconds since navigation start, not UNIX EPOCH
    if(typeof performance === 'object' && performance.timing && performance.timing.navigationStart){
      var base = performance.timing.navigationStart
      requestAnimationFrame(function gameLoop(hrTimestamp){
        self.tickTo(base + hrTimestamp)
        renderer.render(self.stage)
        requestAnimationFrame(gameLoop)
      })
    } else {
      requestAnimationFrame(function gameLoop(_){
        // Don't use timestamp argument since we don't have a good baseline
        self.tickTo(time.now())
        renderer.render(self.stage)
        requestAnimationFrame(gameLoop)
      })
    }
  }
})
