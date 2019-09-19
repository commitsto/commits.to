import { expect } from 'chai'
import moment from 'moment'

import promiseGallerySort from 'lib/sort'

describe('promiseGallerySort', () => {
  def('lastWeek', () => moment().subtract(1, 'weeks'))
  def('yesterday', () => moment().subtract(1, 'days'))
  def('tomorrow', () => moment().add(1, 'days'))
  def('nextWeek', () => moment($tomorrow).add(7, 'days')) // create, not modify

  def('promises', () => [{
    tini: $lastWeek,
    tfin: $yesterday,
  }, {
    tini: $lastWeek,
    tfin: null,
  }])

  it('sorts completed promises after pending promises', () => {
    expect(promiseGallerySort(...$promises) > 0).to.be.true
  })

  context('when both promises are pending', () => {
    def('promises', () => [{
      tini: $lastWeek,
      tdue: $tomorrow,
      tfin: null,
    }, {
      tini: $lastWeek,
      tdue: $nextWeek,
      tfin: null,
    }])

    it('sorts the promises by due date (tdue) ascending', () => {
      expect(promiseGallerySort(...$promises) < 0).to.be.true
    })
  })

  context('when both promises are completed', () => {
    def('promises', () => [{
      tini: $lastWeek,
      tfin: $lastWeek,
    }, {
      tini: $lastWeek,
      tfin: $yesterday,
    }])

    it('sorts the promises by completion date (tfin) descending', () => {
      expect(promiseGallerySort(...$promises) > 0).to.be.true
    })
  })

  context('when a promise is pending and tini is null', () => {
    def('promises', () => [{
      tini: null,
      tfin: null,
    }, {
      tini: null,
      tfin: $yesterday,
    }])

    it('sorts the pending promise before the completed promise', () => {
      expect(promiseGallerySort(...$promises) < 0).to.be.true
    })
  })
})
