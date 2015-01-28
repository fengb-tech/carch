var Heap = require('heap')

var classFactory = require('carch/util/class-factory')
var time = require('carch/util/time')

module.exports = classFactory('EventManager', function(proto){
  proto.init = function(options){
    options = options || {}

    this.lastTickAt = options.lastTickAt || time.now()
    this._tickers = {}
    this._events = new Heap(function(a, b){
      return a[0] - b[0]
    })
  }

  proto.tickTo = function(targetTimestamp){
    for(var key in this._tickers){
      var ticker = this._tickers[key]
      ticker.tickTo(targetTimestamp)
    }
    this.lastTickAt = targetTimestamp

    while(!this._events.empty()){
      var eventDirective = this._events.peek()
      var triggerTimestamp = eventDirective[0]
      if(targetTimestamp < triggerTimestamp){
        break
      } else {
        var event = eventDirective[1]
        event(targetTimestamp)
        this._events.pop()
      }
    }
  }

  proto.add = function(ticker){
    this._tickers[ticker] = ticker
    ticker.tickTo(this.lastTickAt)
  }

  proto.remove = function(ticker){
    delete this._tickers[ticker]
  }

  proto.addEvent = function(triggerTimestamp, func){
    this._events.push([triggerTimestamp, func])
  }
})
