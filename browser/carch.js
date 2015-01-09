var PIXI = require('pixi')
var _ = require('lodash')

var dom = document.getElementById('carch')
var renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight, dom)
var backgroundColor = 0x302000
var stage = new PIXI.Stage(backgroundColor)
requestAnimationFrame(function update(){
  renderer.render(stage)

  requestAnimationFrame(update)
})

window.addEventListener('resize', _.debounce(function(){
  renderer.resize(window.innerWidth, window.innerHeight)
}, 200))
