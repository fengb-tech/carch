var expect = require('carch/test/support/chai').expect
var sinon = require('sinon')

var EventManager = require('carch/core/event-manager')

describe('EventManager', function(){
  beforeEach(function(){
    this.eventManager = EventManager.create()
    this.startTime = this.eventManager.lastTickAt
    this.targetTime = this.startTime + 10
    this.ticker = sinon.stub({ tickTo: function(){} })
  })

  describe('#addTicker()', function(){
    it('forces tick', function(){
      this.eventManager.addTicker(this.ticker)
      expect(this.ticker.tickTo).to.have.been.calledWith(this.startTime)
    })
  })

  describe('#tickTo()', function(){
    it('accepts calls by default', function(){
      this.eventManager.tickTo(this.targetTime)
    })

    it('delegates to #addTicker() tickers', function(){
      this.eventManager.addTicker(this.ticker)
      this.eventManager.tickTo(this.targetTime)
      expect(this.ticker.tickTo).to.have.been.calledWith(this.targetTime)
    })

    it('does not delegate to #remove() tickers', function(){
      this.eventManager.addTicker(this.ticker)
      expect(this.ticker.tickTo).to.have.callCount(1)

      this.eventManager.removeTicker(this.ticker)
      this.eventManager.tickTo(this.targetTime)
      expect(this.ticker.tickTo).to.have.callCount(1)
    })

    describe('#addEvent()', function(){
      beforeEach(function(){
        this.spy = sinon.spy()
        this.targetTime = 100000
      })

      it('runs upon ticking past time', function(){
        this.eventManager.addEvent(this.targetTime, this.spy)
        this.eventManager.tickTo(this.targetTime + 1)
        expect(this.spy).to.have.been.calledWith(this.targetTime + 1)
        expect(this.spy).to.have.callCount(1)
      })

      it('only runs once', function(){
        this.eventManager.addEvent(this.targetTime, this.spy)
        this.eventManager.tickTo(this.targetTime)
        this.eventManager.tickTo(this.targetTime + 1)
        expect(this.spy).to.have.been.calledWith(this.targetTime)
        expect(this.spy).to.have.callCount(1)
      })

      it('does not run for ticking before time', function(){
        this.eventManager.addEvent(this.targetTime, this.spy)
        this.eventManager.tickTo(this.targetTime - 1)
        expect(this.spy).to.have.callCount(0)
      })
    })
  })
})
