var expect = require('carch/test/support/chai').expect
var sinon = require('sinon')

var TickManager = require('carch/core/tick-manager')

describe('TickManager', function(){
  beforeEach(function(){
    this.tickManager = TickManager.create()
    this.startTime = this.tickManager.lastTickAt
    this.targetTime = this.startTime + 10
    this.ticker = sinon.stub({ tickTo: function(){} })
  })

  describe('#add()', function(){
    it('forces tick', function(){
      this.tickManager.add(this.ticker)
      expect(this.ticker.tickTo).to.have.been.calledWith(this.startTime)
    })
  })

  describe('#tickTo()', function(){
    it('accepts calls by default', function(){
      this.tickManager.tickTo(this.targetTime)
    })

    it('delegates to #add() tickers', function(){
      this.tickManager.add(this.ticker)
      this.tickManager.tickTo(this.targetTime)
      expect(this.ticker.tickTo).to.have.been.calledWith(this.targetTime)
    })

    it('does not delegate to #remove() tickers', function(){
      this.tickManager.add(this.ticker)
      expect(this.ticker.tickTo).to.have.callCount(1)

      this.tickManager.remove(this.ticker)
      this.tickManager.tickTo(this.targetTime)
      expect(this.ticker.tickTo).to.have.callCount(1)
    })

    describe('#addEvent()', function(){
      beforeEach(function(){
        this.spy = sinon.spy()
        this.targetTime = 100000
      })

      it('runs upon ticking past time', function(){
        this.tickManager.addEvent(this.targetTime, this.spy)
        this.tickManager.tickTo(this.targetTime + 1)
        expect(this.spy).to.have.been.calledWith(this.targetTime + 1)
        expect(this.spy).to.have.callCount(1)
      })

      xit('only runs once', function(){
        this.tickManager.addEvent(this.targetTime, this.spy)
        this.tickManager.tickTo(this.targetTime)
        this.tickManager.tickTo(this.targetTime + 1)
        expect(this.spy).to.have.been.calledWith(this.targetTime)
        expect(this.spy).to.have.callCount(1)
      })

      it('does not run for ticking before time', function(){
        this.tickManager.addEvent(this.targetTime, this.spy)
        this.tickManager.tickTo(this.targetTime - 1)
        expect(this.spy).to.have.callCount(0)
      })
    })
  })
})
