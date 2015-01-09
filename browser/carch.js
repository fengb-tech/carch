var PIXI = require('pixi')
var _ = require('lodash')

var dom = document.getElementById('carch')
var parentDom = dom.parentElement
if(parentDom == document.body) {
  parentDom = window
}
var renderer = PIXI.autoDetectRenderer(parentDom.width || parentDom.innerWidth, parentDom.height || parentDom.innerHeight, dom)
var backgroundColor = 0x302000
var stage = new PIXI.Stage(backgroundColor)
requestAnimationFrame(function update(){
  renderer.render(stage)

  requestAnimationFrame(update)
})

parentDom.addEventListener('resize', _.debounce(function(){
  renderer.resize(parentDom.width || parentDom.innerWidth, parentDom.height || parentDom.innerHeight)
}, 200))
