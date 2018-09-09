import { expect } from 'chai'
import moment from 'moment'

import parseCredit, { calculateReliability } from '../../../lib/parse/credit'

describe('calculateReliability', () => {
  subject('reliability', () => calculateReliability($promises))

  def('promises', () => [{
    id: 'nocredit'
  }, {
    id: 'one',
    credit: 1,
  }, {
    id: 'half',
    credit: 0.5,
  }])

  it('only counts promises that have a credit value', () => {
    expect($reliability.counted).to.eq(2)
  })

  it('calculates the average of all the "countable" promises', () => {
    expect($reliability.score).to.eq(0.75)
  })
})

describe('parseCredit', () => {
  subject('credit', () => parseCredit($promise))

  def('promise', () => ({
    dueDate: moment(),
    finishDate: moment().subtract(1, 'day'),
  }))

  it('gives full credit for an on-time promise', () => {
    expect($credit).to.eq(1)
  })

  context('when the promise is incomplete', () => {
    def('promise', () => ({
      dueDate: moment().add(1, 'week'),
    }))

    it('returns null', () => {
      expect($credit).to.eq(null)
    })
  })

  context('when the promise has no due date', () => {
    context('and the promise is complete', () => {
      def('promise', () => ({
        finishDate: moment().subtract(1, 'day'),
      }))

      it('returns the value as 1, or 100%', () => {
        expect($credit).to.eq(1)
      })
    })

    context('and the promise is incomplete', () => {
      def('promise', () => ({
        id: 'nothing',
      }))

      it('returns null', () => {
        expect($credit).to.eq(null)
      })
    })
  })
})
