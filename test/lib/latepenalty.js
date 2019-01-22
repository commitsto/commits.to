import { expect } from 'chai'
import moment from 'moment'

import latePenalty from 'lib/latepenalty'

describe('latePenalty', () => {
  def('seconds', () => moment.duration($lateness).asSeconds())
  subject('credit', () => latePenalty($seconds))

  it('gives full credit if the promise is not late', () => {
    expect($credit).to.eq(1)
  })

  context('when the promise is a minute late', () => {
    def('lateness', () => ({ minutes: 1 }))

    it('gives 99.999% credit', () => {
      expect($credit).to.eq(0.99999)
    })
  })

  context('when the promise is an hour late', () => {
    def('lateness', () => ({ hours: 1 }))

    it('gives 99.9% credit', () => {
      expect($credit).to.eq(0.999)
    })
  })

  context('when the promise is a day late', () => {
    def('lateness', () => ({ days: 1 }))

    it('gives 99% credit', () => {
      expect($credit).to.eq(0.99)
    })
  })

  context('when the promise is a week late', () => {
    def('lateness', () => ({ weeks: 1 }))

    it('gives 90% credit', () => {
      expect($credit).to.eq(0.9)
    })
  })

  context('when the promise is a month late', () => {
    def('lateness', () => ({ months: 1 }))

    it('gives 50% credit', () => {
      expect($credit).to.eq(0.5)
    })
  })

  context('when the promise is a year late', () => {
    def('lateness', () => ({ years: 1 }))

    it('gives 10% credit', () => {
      expect($credit).to.eq(0.1)
    })
  })

  context('when the promise is 10 years late', () => {
    def('lateness', () => ({ years: 10 }))

    it('gives less than 1% credit', () => {
      expect($credit).to.be.below(0.01)
    })
  })
})
