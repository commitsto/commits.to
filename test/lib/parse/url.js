import { expect } from 'chai'

import isValidUrl from '../../../lib/parse/url'

describe('isValidUrl', () => {
  def('url', () => '/go_for_a_run/by/2:30pm')
  def('isValid', () => isValidUrl({ url: $url }))

  it('allows any url that has no invalid characters', () => {
    expect($isValid).to.be.true
  })

  context('when the url has a file extension', () => {
    def('url', () => '/awekjad.txt')

    it('rejects the url', () => {
      expect($isValid).to.be.false
    })

    context('when the url ends in /by', () => {
      def('url', () => '/test/this/thing/by')

      it('rejects the url', () => {
        expect($isValid).to.be.false
      })
    })

    context('when the url repeats the username and domain', () => {
      def('url', () => '/tester.commits.to/test/the/things')

      it('rejects the url', () => {
        expect($isValid).to.be.false
      })
    })
  })
})
