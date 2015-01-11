var classFactory = require('carch/util/class-factory')
var time = require('carch/util/time')

module.exports = classFactory(function TickManager(proto){
  proto.init = function(options){
    options = options || {}

    this.lastTickAt = options.lastTickAt || time.now()
    this._tickers = {}
  }

  proto.tickTo = function(targetTimestamp){
    for(var key in this._tickers){
      var ticker = this._tickers[key]
      ticker.tickTo(targetTimestamp)
    }
    this.lastTickAt = targetTimestamp
  }

  proto.add = function(ticker){
    this._tickers[ticker] = ticker
  }

  proto.remove = function(ticker){
    delete this._tickers[ticker]
  }
})
