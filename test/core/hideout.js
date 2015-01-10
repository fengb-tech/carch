var expect = require('chai').expect

var Hideout = require('carch/core/hideout')
var Minion = require('carch/core/minion')

var capture = require('test/support/capture')

describe('Hideout', function(){
  beforeEach(function(){
    this.hideout = Hideout.create()
    this.capture = capture()
  })

  describe('#addMinion', function(){
    it('returns a minion', function(){
      var minion = this.hideout.addMinion()
      expect(minion).to.be.instanceof(Minion)
    })
  })
})
