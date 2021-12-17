import { Campaign, Election, Etcd3 } from 'etcd3';
import { Injectable, Logger } from '@nestjs/common';
import { CronService } from './cron.service';
import * as os from 'os';
import { ExecutorService } from './executor.service';

@Injectable()
export class ElectionService {
  private client: Etcd3;
  private election: Election;
  private campaign: Campaign | null = null;
  public isLeader = false;

  public constructor(
    private logger: Logger,
    private cronService: CronService,
    private executorService: ExecutorService,
  ) {
    this.client = new Etcd3({
      hosts: ['http://etcd-1:2380', 'http://etcd-2:2380', 'http://etcd-3:2380'],
    });
    this.election = this.client.election('scheduler-election');
  }

  public init() {
    this.startElection();
    this.observeLeader();
  }

  private startElection() {
    this.campaign = this.election.campaign(`scheduler-${os.hostname()}`);
    this.campaign.on('elected', () => {
      this.logger.log('I am the leader', ElectionService.name);
      this.isLeader = true;
      this.cronService.start();
      this.cronService.subscribeSecond(() => {
        this.executorService.executeCycle();
      });
      this.cronService.subscribeMinute(() => {
        this.executorService.sync();
      });
    });
    this.campaign.on('error', (error) => {
      this.logger.error('Error in election', error, ElectionService.name);
      this.isLeader = false;
      this.cronService.stop();
      this.logger.log('Retrying election', ElectionService.name);
      setTimeout(this.startElection, 5000);
    });
  }

  private async observeLeader() {
    try {
      const observer = await this.election.observe();
      this.logger.debug('Observe leader', ElectionService.name);
      observer.on('change', (leader) => {
        this.logger.log(
          `The current leader is: ${leader}`,
          ElectionService.name,
        );
      });
      observer.on('error', () => {
        setTimeout(this.observeLeader, 5000);
      });
    } catch (err) {
      this.logger.error('Error in observing leader', err, ElectionService.name);
    }
  }
}
