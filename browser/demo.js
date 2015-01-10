var HideoutView = require('carch/browser/hideout-view')

exports.hideoutView = function(){
  var hideoutView = HideoutView.create()
  var hideout = hideoutView.hideout
  var minion = hideout.addMinion()
  setInterval(function loop(){
    var r = 5
    var θ = Math.random() * 2 * Math.PI
    var xChange = r*Math.cos(θ)
    var yChange = r*Math.sin(θ)
    var oldCoord = hideout.coordOfMinion[minion]
    var newCoord = [
      oldCoord[0] + xChange,
      oldCoord[1] + yChange,
    ]
    hideout.moveMinion(minion, newCoord)
  }, 1000)
  return hideoutView
}
