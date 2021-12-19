import { expect } from 'chai';
import { SuperTest, webHook } from './before';
import { insert } from './helpers/insert';
import { unix } from '../../src/helpers/unix';
import { CommandStatus } from '../../src/types/command-status';

describe('Timer Read/Create', async () => {
  let id = -1;
  it('should create a timer', async () => {
    await SuperTest.post('/timers')
      .send({
        hours: 3,
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
  it('should trigger the webhook', async () => {
    let timerId = 0;
    await SuperTest.post('/timers')
      .send({
        hours: 0,
        minutes: 0,
        seconds: 5,
        url: 'http://localhost:3001',
      })
      .expect('Content-Type', /json/)
      .expect(201)
      .expect((res) => {
        expect(res.body).to.exist;
        expect(res.body).to.be.an('object');
        timerId = res.body.id;
      });
    await webHook.waitFor(timerId, 10);
  });
  it('should trigger a passed event', async () => {
    const now = unix();
    const id = await insert({
      url: 'http://localhost:3001',
      time: now - 100,
      status: CommandStatus.Pending,
    });
    await webHook.waitFor(id, 70);
  });
});
