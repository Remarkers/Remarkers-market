import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { Config } from './config/configuration';

@Injectable()
export class PolkadotService implements OnModuleInit {
  private api: ApiPromise;

  constructor(private configService: ConfigService<Config>) {}

  async onModuleInit() {
    const wsProvider = new WsProvider(
      this.configService.get('polkadotEndpoint'),
    );
    this.api = await ApiPromise.create({ provider: wsProvider });
    await this.api.isReady;
  }

  getApi(): ApiPromise {
    return this.api;
  }
}
