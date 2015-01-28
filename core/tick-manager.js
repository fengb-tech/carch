var classFactory = require('carch/util/class-factory')
var time = require('carch/util/time')

module.exports = classFactory('TickManager', function(proto){
  proto.init = function(options){
    options = options || {}

    this.lastTickAt = options.lastTickAt || time.now()
    this._tickers = {}
    this._events = []
  }

  proto.tickTo = function(targetTimestamp){
    for(var key in this._tickers){
      var ticker = this._tickers[key]
      ticker.tickTo(targetTimestamp)
    }
    this.lastTickAt = targetTimestamp

    for(var i=0; i < this._events.length; i++){
      var eventDirective = this._events[i]
      var triggerTimestamp = eventDirective[0]
      var event = eventDirective[1]
      if(targetTimestamp >= triggerTimestamp){
        event(targetTimestamp)
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
