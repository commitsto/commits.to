import { expect } from 'chai'
import moment from 'moment'

import { parsePromise } from '../../../lib/parse/promise'

describe('parsePromise', () => {
  def('username', () => 'testuser')
  def('urtext', () => '/a-valid-promise')

  def('parsedPromise', () =>
    parsePromise({ username: $username, urtext: $urtext }))

  it('parses the promise correctly', () => {
    const promise = {
      id: 'testuser/a-valid-promise',
      slug: 'a-valid-promise',
      timezone: 'etc/UTC',
      what: 'A valid promise',
      urtext: 'a-valid-promise',
    }
    expect($parsedPromise).to.include(promise)
  })

  context('when the promise text contains a date', () => {
    def('urtext', () => '/do-the-thing/by/jan-1-2020')

    it('correctly parses the deadline from the promise text', () => {
      const promise = {
        id: 'testuser/do-the-thing/by/jan-1-2020',
        slug: 'do-the-thing',
        timezone: 'etc/UTC',
        what: 'Do the thing',
        urtext: 'do-the-thing/by/jan-1-2020',
      }
      const tdue = moment($parsedPromise.tdue).toISOString()

      expect($parsedPromise).to.include(promise)
      expect(tdue).to.eq(moment('2020-01-01T23:59:59.000Z').toISOString())
    })
  })

  context('when the path is just a double-slash (//)', () => {
    def('urtext', () => '//')

    it('rejects the urtext and returns false', () => {
      expect($parsedPromise).to.be.false
    })
  })
})
