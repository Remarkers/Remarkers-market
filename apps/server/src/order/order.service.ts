import { Injectable } from '@nestjs/common';
import { PolkadotService } from 'src/polkadot.service';
import { PrismaService } from 'src/prisma.service';
import { parseInscription } from '../../indexer/src/types';
import { ListingOrderReqDto, ListingOrderResDto } from './dto/order.dto';

@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService,
    private polkadot: PolkadotService,
  ) {}

  async listing(
    createOrderDto: ListingOrderReqDto,
  ): Promise<ListingOrderResDto> {
    const extrinsic = this.polkadot.getApi().tx(createOrderDto.signedExtrinsic);
    const inscription = parseInscription(extrinsic);
    if (!inscription) {
      throw Error('INVALID_TRANSACTION');
    }

    const order = await this.prisma.order.create({
      data: {
        seller: 'test',
        buyer: 'test',
        collection_id: 'test',
        token_id: 1,
        totalPrice: 100n,
        buyServiceFee: 100n,
        buyPayPrice: 100n,
        sellServiceFee: 100n,
        sellPayPrice: 100n,
        sellHash: 'test',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return {
      id: order.id,
      hash: extrinsic.hash.toHex(),
    };
  }
}
