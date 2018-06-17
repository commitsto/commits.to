import chai from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'

chai.should()
chai.use(sinonChai)

import * as sendMail from '../../lib/mail'
import actionNotifier from '../../lib/notify'


describe('actionNotifier', () => {
  let sendMailSpy

  before(() => {
    sendMailSpy = sinon.spy(sendMail, 'default')
  })

  subject('email', () => actionNotifier($args))

  def('args', () => ({
    resource: 'widget',
    action: 'activated',
    identifier: 'widget-123',
    meta: { info: 'this is some info', detail: 'a detail' },
  }))

  it('calls sendMail with the correct arguments', () => {
    chai.expect($email).to.be.undefined
    const text = 'Widget activated: widget-123'
    sendMailSpy.should.have.been.calledWith({
      to: 'dreeves@gmail.com',
      subject: `[commits.to] ${text}`,
      text: `${text}\n{"info":"this is some info","detail":"a detail"}`,
    })
  })

  context('when there is no meta info given', () => {
    def('args', () => ({
      resource: 'widget',
      action: 'deleted',
      identifier: 'widget-123',
    }))

    it('calls sendMail with the correct arguments', () => {
      chai.expect($email).to.be.undefined
      sendMailSpy.should.have.been.calledWith({
        to: 'dreeves@gmail.com',
        subject: '[commits.to] Widget deleted: widget-123',
        text: 'Widget deleted: widget-123',
      })
    })
  })
})
