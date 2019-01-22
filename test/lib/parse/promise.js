import { expect } from 'chai'
import moment from 'moment'

import { parsePromise, diffPromises } from 'lib/parse/promise'

describe('parsePromise', () => {
  subject('parsedPromise', () =>
    parsePromise({ username: $username, urtext: $urtext }))

  def('tdue', () =>
    $parsedPromise.tdue && moment($parsedPromise.tdue).toISOString())

  def('username', () => 'testuser')
  def('urtext', () => '/a-valid-promise')
  def('promise', () => ({
    id: 'testuser/a-valid-promise',
    slug: 'a-valid-promise',
    timezone: 'etc/UTC',
    what: 'A valid promise',
    urtext: 'a-valid-promise',
  }))

  it('parses the promise correctly', () => {
    expect($parsedPromise).to.include($promise)
    expect($tdue).to.eq(undefined)
  })

  context('when the promise text contains a date', () => {
    def('urtext', () => '/do-the-thing/by/jan-1-2020')
    def('promise', () => ({
      id: 'testuser/do-the-thing/by/jan-1-2020',
      slug: 'do-the-thing',
      timezone: 'etc/UTC',
      what: 'Do the thing by jan 1 2020',
      urtext: 'do-the-thing/by/jan-1-2020',
    }))

    it('correctly parses the deadline from the promise text', () => {
      expect($parsedPromise).to.include($promise)
      expect($tdue).to.eq(moment('2020-01-01T23:59:59.000Z').toISOString())
    })

    context('when a comparator keyword preceeds a 24-hour time format', () => {
      def('urtext', () => '/do-the-thing-before-leaving-work-by-1800')
      def('promise', () => ({
        id: 'testuser/do-the-thing-before-leaving-work-by-1800',
        slug: 'do-the-thing-before-leaving-work',
        timezone: 'etc/UTC',
        what: 'Do the thing before leaving work by 1800',
        urtext: 'do-the-thing-before-leaving-work-by-1800',
      }))

      it('correctly parses the deadline from the promise text', () => {
        const expectedDate = moment
          .utc({ hour: 18 })
          .add(0 + (moment().hours() >= 18), 'days') // if past 1800 already
          .toISOString()

        expect($parsedPromise).to.include($promise)
        expect($tdue).to.eq(expectedDate)
      })
    })
  })

  context('when the path is just a double-slash (//)', () => {
    def('urtext', () => '//')

    it('rejects the urtext and returns false', () => {
      expect($parsedPromise).to.be.false
    })
  })
})

describe('diffPromises', () => {
  subject('difference', () => diffPromises($promiseOne, $promiseTwo))

  def('promise', () => ({
    id: 'testuser/a-valid-promise',
    slug: 'a-valid-promise',
    timezone: 'etc/UTC',
    what: 'A valid promise',
    urtext: 'a-valid-promise',
    note: 'This is a note',
  }))

  def('promiseOne', () => ({ ...$promise }))
  def('promiseTwo', () => ({ ...$promise, note: 'This is a different note' }))

  it('parses the promise correctly', () => {
    expect($difference).to.have.keys('note')
    expect($difference.note).to.eq('This is a different note')
  })

  context('when an ignored field has changed', () => {
    def('promiseOne', () => ({ ...$promise, updatedAt: new Date() }))
    def('promiseTwo', () => ({ ...$promise }))

    it('detects no changes and returns an empty object', () => {
      expect($difference).to.deep.equal({})
    })
  })

  context('when the promises are identical', () => {
    def('promiseOne', () => ({ ...$promise }))
    def('promiseTwo', () => ({ ...$promise }))

    it('returns an empty object', () => {
      expect($difference).to.deep.equal({})
    })
  })
})
