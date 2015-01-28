var demo = require('carch/browser/demo')
var time = require('carch/util/time')

var game = demo.createGame(10000)
demo.aiRandomWalk(game)

var TEN_SEC = time.sec(10)
var SEC = time.sec(1)

window.benchmark = function(){
  var ops = 0
  var start = time.now()
  var current
  while((current = time.now()) < start + TEN_SEC){
    game.tickTo(ops * 16.666666666667)
    ops++
  }

  return ops * SEC / (current - start)
}
