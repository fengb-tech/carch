var PIXI = require('pixi')
var _ = require('lodash')

var dom = document.getElementById('carch')
var renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight, dom)

window.addEventListener('resize', _.debounce(function(){
  renderer.resize(window.innerWidth, window.innerHeight)
}, 200))
