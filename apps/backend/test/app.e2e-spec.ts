import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ApiPromise, Keyring } from '@polkadot/api';
import { KeyringPair } from '@polkadot/keyring/types';
import { u8aToHex } from '@polkadot/util';
import {
  cryptoWaitReady,
  mnemonicGenerate,
  mnemonicToMiniSecret,
} from '@polkadot/util-crypto';
import { AppModule } from 'src/app.module';
import { AuthLoginReqDto } from 'src/auth/dto/auth.dto';
import { PolkadotService } from 'src/core/polkadot.service';
import { standarAddress } from 'src/util';
import * as request from 'supertest';
import { ListingOrderReqDto } from 'src/order/dto/order.dto';
import { ApproveContent } from '../indexer/src/types';
import { ConfigService } from '@nestjs/config';
import { Config } from 'src/config/configuration';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let pair: KeyringPair;
  let token: string;
  let config: ConfigService<Config>;
  let api: ApiPromise;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Generate a new keypair to login
    await cryptoWaitReady(); // Wait for the crypto library to be initialized
    const mnemonic = mnemonicGenerate(); // Generate a new mnemonic
    const seed = mnemonicToMiniSecret(mnemonic); // Convert the mnemonic to a seed
    const keyring = new Keyring({ type: 'sr25519' }); // Create a new keyring
    pair = keyring.addFromSeed(seed); // Add a new keypair from the seed

    config = app.get(ConfigService<Config>);
    api = app.get(PolkadotService).getApi();

    // Login
    const nonce = Math.random().toString().substring(2, 7);
    const body: AuthLoginReqDto = {
      address: standarAddress(pair.address),
      nonce,
      signature: u8aToHex(pair.sign(`Login to NFT Market: ${nonce}`)),
    };
    const response = await request(app.getHttpServer())
      .post('/api/v1/login')
      .send(body)
      .expect(200);
    token = response.body.data;
  }, 30000);

  it('Not Login', () => {
    return request(app.getHttpServer())
      .post('/api/v1/order/listing')
      .expect(401);
  });

  it('Listing', async () => {
    const totalPrice = '10.2';
    const extrinsic = api.tx.utility.batchAll([
      api.tx.system.remarkWithEvent(JSON.stringify({} as ApproveContent)),
      api.tx.balances.transferKeepAlive(config.get('marketAccount'), 200),
    ]);
    const signedExtrinsic = (await extrinsic.signAsync(pair)).toHex();

    return request(app.getHttpServer())
      .post('/api/v1/order/listing')
      .set('Authorization', `Bearer ${token}`)
      .send({
        totalPrice,
        signedExtrinsic,
      } as ListingOrderReqDto)
      .expect(200);
  });

  afterEach(async () => {
    await api.disconnect();
    await app.close();
  });
});
