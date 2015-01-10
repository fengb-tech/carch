/* globals document, window, performance */
var PIXI = require('pixi')
var _ = require('lodash')

var time = require('carch/util/time')

var demo = require('carch/browser/demo')

var dom = document.getElementById('carch')
var parentDom = dom.parentElement
if(parentDom == document.body) {
  parentDom = window
}
var renderer = PIXI.autoDetectRenderer(parentDom.width || parentDom.innerWidth, parentDom.height || parentDom.innerHeight, dom)

parentDom.addEventListener('resize', _.debounce(function(){
  renderer.resize(parentDom.width || parentDom.innerWidth, parentDom.height || parentDom.innerHeight)
}, 200))

var hideoutView = demo.hideoutView()
requestAnimationFrame(function(testTimestamp){
  var gameloop
  if(testTimestamp < 1e12){
    gameloop = function(hrTimestamp){
      // DOMHighResTimeStamp = milliseconds since page load, not UNIX EPOCH
      var timestamp = time.loadTime + hrTimestamp
      hideoutView.tickTo(timestamp)
      renderer.render(hideoutView.stage)
      requestAnimationFrame(gameloop)
    }
  } else {
    gameloop = function(timestamp){
      hideoutView.tickTo(timestamp)
      renderer.render(hideoutView.stage)
      requestAnimationFrame(gameloop)
    }
  }
  requestAnimationFrame(gameloop)
})
