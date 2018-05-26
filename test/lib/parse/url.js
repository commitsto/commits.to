import { expect } from 'chai'

import isValidUrl, { isValidUserAgent } from '../../../lib/parse/url'

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

describe('isValidUserAgent', () => {
  def('useragent', () => ({
    useragent: {
      isAuthoritative: true,
      isBot: false,
      browser: 'chrome',
    },
  }))
  def('isValidAgent', () => isValidUserAgent({ req: $useragent }))

  it('allows any valid useragent that is not recognized as a bot', () => {
    expect($isValidAgent).to.be.true
  })

  context('when the useragent is recognized as a bot', () => {
    def('useragent', () => ({
      useragent: {
        isAuthoritative: true,
        isBot: true,
      },
    }))

    it('rejects anything identified as a bot', () => {
      expect($isValidAgent).to.be.false
    })
  })

  context('when the useragent does not contain a valid browser string', () => {
    def('useragent', () => ({
      useragent: {
        isAuthoritative: true,
        browser: 'unknown',
      },
    }))

    it('rejects any useragent without a valid browser string', () => {
      expect($isValidAgent).to.be.false
    })
  })
})
