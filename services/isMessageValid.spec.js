const should = require('should');
const isMessageValid = require('./isMessageValid');

describe('isMessageValid', () => {

  it('msg is valid', () => {
    const msg = {
      payload: {foo: 'bar'},
      templateName: 'someName'
    };

    isMessageValid(msg).should.be.exactly(true);
  });

  it('msg is missing payload', () => {
    const msg = {
      templateName: 'someName'
    };

    isMessageValid(msg).should.be.exactly(false);
  });

  it('msg is missing templateName', () => {
    const msg = {
      payload: {foo: 'bar'}
    };

    isMessageValid(msg).should.be.exactly(false);
  });
});
