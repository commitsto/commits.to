import chai from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'

chai.should()
chai.use(sinonChai)

import * as sendMail from '../../lib/mail'
import actionNotifier from '../../lib/notify'


describe('actionNotifier', () => {
  let sendMailSpy

  beforeEach(() => {
    sendMailSpy = sinon.spy(sendMail, 'default')
  })

  def('args', () => ({
    resource: 'widget',
    action: 'activated',
    identifier: 'widget-123',
    meta: { info: 'this is some info', detail: 'a detail' },
  }))
  subject('email', () => actionNotifier($args))

  it('calls sendMail with the correct arguments', () => {
    chai.expect($email).to.be.undefined
    sendMailSpy.should.have.been.calledWith({
      to: 'dreeves@gmail.com',
      subject: '[commits.to] Widget activated: widget-123',
      text: '{"info":"this is some info","detail":"a detail"}',
    })
  })
})
