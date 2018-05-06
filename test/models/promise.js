import { expect } from 'chai'

import { promiseGallerySort } from '../../models/promise'

describe('promiseGallerySort', () => {
  let promises = [{
    tfin: 1,
  }, {
    tfin: null,
  }]

  it('sorts completed promises after pending promises', () => {
    expect(promiseGallerySort(...promises) > 0).to.be.true
  })

  context('when both promises are pending', () => {
    promises = [{
      tfin: null,
      tdue: 10,
    }, {
      tfin: null,
      tdue: 50,
    }]

    it('sorts the promises by due date (tdue) ascending', () => {
      expect(promiseGallerySort(...promises) < 0).to.be.true
    })
  })

  context('when both promises are completed', () => {
    promises = [{
      tfin: 20,
    }, {
      tfin: 40,
    }]

    it('sorts the promises by completion date (tfin) descending', () => {
      expect(promiseGallerySort(...promises) > 0).to.be.true
    })
  })
})
