import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { Config } from 'src/config/configuration';

@Injectable()
export class PolkadotService implements OnModuleInit {
  private api: ApiPromise;
  private decimals: number;

  constructor(private configService: ConfigService<Config>) {}

  async onModuleInit() {
    const wsProvider = new WsProvider(
      this.configService.get('polkadotEndpoint'),
    );
    this.api = await ApiPromise.create({ provider: wsProvider });
    await this.api.isReady;
    this.decimals = this.api.registry.chainDecimals[0];
  }

  getApi(): ApiPromise {
    return this.api;
  }

  getDecimals(): number {
    return this.decimals;
  }
}
