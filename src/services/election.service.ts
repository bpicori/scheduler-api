import { Campaign, Election, Etcd3 } from 'etcd3';
import { Injectable, Logger } from '@nestjs/common';
import { CronService } from './cron.service';
import * as os from 'os';
import { ExecutorService } from './executor.service';
import { ConfigService } from './config.service';

/**
 * Election Service using etcd.
 * If this instance is a selected leader, starts cron service attaching the second and minutes executor handler
 * @see https://microsoft.github.io/etcd3/classes/election.html
 */
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
    private configService: ConfigService,
  ) {
    this.client = new Etcd3({
      hosts: this.configService.etcd,
    });
    this.election = this.client.election(
      this.configService.electionKey,
      this.configService.electionTimeout,
    );
    this.logger.log('Init Election', ElectionService.name);
  }

  public init() {
    this.logger.log('Init Election', ElectionService.name);
    this.startElection();
  }

  private startElection() {
    this.campaign = this.election.campaign(
      `${this.configService.electionCampaignPattern}-${os.hostname()}`,
    );
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
      setTimeout(() => {
        this.startElection();
      }, this.configService.electionTimeout);
    });
  }
}
