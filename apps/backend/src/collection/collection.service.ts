import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Config } from 'src/config/configuration';
import { PolkadotService } from 'src/core/polkadot.service';
import { PrismaService } from 'src/core/prisma.service';
import { PageRes } from 'src/core/response.dto';
import {
  CollectionPageReqDto,
  CollectionPageResItemDto,
} from './dto/collection.dto';

@Injectable()
export class CollectionService {
  constructor(
    private configService: ConfigService<Config>,
    private prisma: PrismaService,
    private polkadot: PolkadotService,
  ) {}

  async page(
    req: CollectionPageReqDto,
  ): Promise<PageRes<CollectionPageResItemDto>> {
    console.log(req);
    return {
      total: 0,
      items: [],
    };
  }
}
