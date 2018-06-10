import { expect } from 'chai'

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

  // TODO: test date parsing

  context('when the path is just a double-slash (//)', () => {
    def('urtext', () => '//')

    it('rejects the urtext and returns false', () => {
      expect($parsedPromise).to.be.false
    })
  })
})
