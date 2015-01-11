/* globals document, window, performance */
var PIXI = require('pixi')
var _ = require('lodash')

var time = require('carch/util/time')

var demo = require('carch/browser/demo')

var dom = document.getElementById('carch')
var parentDom = dom.parentElement
var renderer = PIXI.autoDetectRenderer(parentDom.clientWidth, parentDom.clientHeight, dom)

window.addEventListener('resize', _.debounce(function(){
  renderer.resize(parentDom.clientWidth, parentDom.clientHeight)
}, 200))

var hideoutView = demo.hideoutView()
requestAnimationFrame(function(testTimestamp){
  if(testTimestamp < 1e12){
    // DOMHighResTimeStamp = milliseconds since page load, not UNIX EPOCH
    var base = Date.now() - testTimestamp
    requestAnimationFrame(function gameLoop(hrTimestamp){
      var timestamp = base + hrTimestamp
      hideoutView.tickTo(timestamp)
      renderer.render(hideoutView.stage)
      requestAnimationFrame(gameLoop)
    })
  } else {
    requestAnimationFrame(function gameLoop(timestamp){
      hideoutView.tickTo(timestamp)
      renderer.render(hideoutView.stage)
      requestAnimationFrame(gameLoop)
    })
  }
})

var fpsDisplay = document.getElementById('fps')
if(fpsDisplay){
  requestAnimationFrame(function(start){
    var then = start
    var frames = 0
    requestAnimationFrame(function fpsLoop(now){
      frames++
      if(now - then >= 1000){
        fpsDisplay.innerText = frames + ' fps'
        frames = 0
        then = now
      }
      requestAnimationFrame(fpsLoop)
    })
  })
}
