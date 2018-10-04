import { expect } from 'chai'

import isValidUrl, { isBotFromUserAgent } from '../../../lib/parse/url'

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

    context('when the url ends in abby', () => {
      def('url', () => '/test/this/thing/for/abby')

      it('does not reject the url', () => {
        expect($isValid).to.be.true
      })
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

describe('isQueryString', () => {
  def('url', () => '/go_running?by=2:30pm')
  def('isValid', () => isValidUrl({ url: $url }))

  it('rejects any url that has a "valid" querystring', () => {
    expect($isValid).to.be.false
  })

  context('when the "?" is followed by a "/"', () => {
    def('url', () => 'go_running?/by/2:30pm')

    it('does not consider the url to have a querystring', () => {
      expect($isValid).to.be.true
    })
  })
})

describe('isBotFromUserAgent', () => {
  def('useragent', () => ({
    useragent: {
      isAuthoritative: true,
      isBot: false,
      browser: 'chrome',
    },
  }))
  def('isBot', () => isBotFromUserAgent({ req: $useragent }))

  it('allows any valid useragent that is not recognized as a bot', () => {
    expect($isBot).to.be.false
  })

  context('when there is a cURL request', () => {
    def('useragent', () => ({
      useragent: {
        isAuthoritative: true,
        browser: 'curl',
        isBot: 'curl',
      },
    }))

    it('allows cURL as a valid isBot entry', () => {
      expect($isBot).to.be.false
    })
  })

  context('when the useragent is recognized as a bot', () => {
    def('useragent', () => ({
      useragent: {
        isAuthoritative: true,
        isBot: true,
      },
    }))

    it('rejects anything identified as a bot', () => {
      expect($isBot).to.be.true
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
      expect($isBot).to.be.true
    })
  })
})
