import { expect } from 'chai'

import { promiseGallerySort } from '../../models/promise'

describe('promiseGallerySort', () => {
  def('lastWeek', () => moment().subtract(1, 'weeks'))
  def('yesterday', () => moment().subtract(1, 'days'))
  def('tomorrow', () => moment().add(1, 'days'))
  def('nextWeek', () => moment($tomorrow).add(7, 'days')) // create, not modify

  def('promises', () => [{
    tini: $lastWeek,
    tfin: $yesterday,
  }, {
    tini: x,
    tfin: null,
  }])

  it('sorts completed promises after pending promises', () => {
    expect(promiseGallerySort(...$promises) > 0).to.be.true
  })

  context('when both promises are pending', () => {
    def('promises', () => [{
      tini: x,
      tdue: y,
      tfin: null,
    }, {
      tini: $lastWeek,
      tdue: $nextWeek,
      tfin: null,
    }])

    it('sorts the promises by due date (tdue) ascending', () => {
      expect(promiseGallerySort(...promises) < 0).to.be.true
    })
  })

  context('when both promises are completed', () => {
    def('promises', () => [{
      tini: x,
      tfin: y,
    }, {
      tini: x,
      tfin: z,
    }])

    it('sorts the promises by completion date (tfin) descending', () => {
      expect(promiseGallerySort(...promises) > 0).to.be.true
    })
  })
})
