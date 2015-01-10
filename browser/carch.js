var PIXI = require('pixi')
var _ = require('lodash')

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
requestAnimationFrame(function mainLoop(){
  hideoutView.update()
  renderer.render(hideoutView.stage)
  requestAnimationFrame(mainLoop)
})
