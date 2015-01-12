var expect = require('chai').expect

var time = require('carch/util/time')

describe('time()', function(){
  describe('.now()', function(){
    it('is within 5ms of Date.now()', function(){
      // Theoretically should be 1ms but I don't really care and this is slightly brittle
      expect(time.now()).to.be.closeTo(Date.now(), 5)
    })

    it('is super precise', function(){
      var now = time.now()
      expect(now).to.not.equal(Math.round(now))
    })
  })

  it('.ms() has correct offset', function(){
    expect(time.ms(1)).to.equal(1)
  })

  it('.sec() has correct offset', function(){
    expect(time.sec(1)).to.equal(1000)
  })

  it('.min() has correct offset', function(){
    var before = new Date(2014, 1, 1, 11, 30)
    var after = new Date(2014, 1, 1, 11, 31)
    expect(time.min(1)).to.equal(after - before)
  })

  it('.hour() has correct offset', function(){
    var before = new Date(2014, 1, 1, 11)
    var after = new Date(2014, 1, 1, 12)
    expect(time.hour(1)).to.equal(after - before)
  })

  it('.day() has correct offset', function(){
    var before = new Date(2014, 1, 1)
    var after = new Date(2014, 1, 2)
    expect(time.day(1)).to.equal(after - before)
  })

  it('.year() has correct offset', function(){
    var before = new Date(2014, 1, 1)
    var after = new Date(2015, 1, 1)
    expect(time.year(1)).to.equal(after - before)
  })

  it('aggregates all fields', function(){
    expect(time({ ms: 1, sec: 1 })).to.equal(1001)
  })
})
