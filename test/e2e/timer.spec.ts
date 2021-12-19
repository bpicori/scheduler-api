import { assert, expect } from 'chai';
import { SuperTest } from './before';

describe('Timer Read/Create', async () => {
  let id = '';
  it('should create a timer', async () => {
    await SuperTest.post('/timers')
      .send({
        hours: 1,
        minutes: 0,
        seconds: 10,
        url: 'http://localhost:3001',
      })
      .expect('Content-Type', /json/)
      .expect(201)
      .expect((res) => {
        expect(res.body).to.exist;
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('id');
        id = res.body.id;
      });
  });
  it('should get timer', async () => {
    await SuperTest.get(`/timers/${id}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).to.exist;
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('id');
        expect(res.body).to.have.property('time_left');
      });
  });
});
