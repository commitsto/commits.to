import { expect } from 'chai'

import { promiseGallerySort } from '../../models/promise'

const x = new Date()
const y = new Date()
y.setTime(y.getTime() + 7*86400*1000) // make y later than x

describe('promiseGallerySort', () => {
  const promises = [{
    tfin: x,
  }, {
    tfin: null,
  }]

  it('sorts completed promises after pending promises', () => {
    expect(promiseGallerySort(...promises) > 0).to.be.true
  })

  context('when both promises are pending', () => {
    const promises = [{
      tfin: null,
      tdue: x,
    }, {
      tfin: null,
      tdue: y,
    }]

    it('sorts the promises by due date (tdue) ascending', () => {
      expect(promiseGallerySort(...promises) < 0).to.be.true
    })
  })

  context('when both promises are completed', () => {
    const promises = [{
      tfin: x,
    }, {
      tfin: y,
    }]

    it('sorts the promises by completion date (tfin) descending', () => {
      expect(promiseGallerySort(...promises) > 0).to.be.true
    })
  })
})
