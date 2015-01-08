var PIXI = require('pixi')

var dom = document.getElementById('carch')
var background = 0x66FF99
var stage = new PIXI.Stage(background)
var renderer = PIXI.autoDetectRenderer(512, 384, dom)
