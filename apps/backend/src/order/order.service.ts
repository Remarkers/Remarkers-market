import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Decimal } from '@prisma/client/runtime/library';
import { AuthUser } from 'src/auth/dto/auth.dto';
import { Config } from 'src/config/configuration';
import { PolkadotService } from 'src/core/polkadot.service';
import { PrismaService } from 'src/core/prisma.service';
import { submitSignedExtrinsicAndWait } from 'src/dapp';
import { sameAddress } from 'src/util';
import { ApproveContent, parseInscription } from '../../indexer/src/types';
import {
  CancelOrderReqDto,
  CancelOrderResDto,
  ListingOrderReqDto,
  ListingOrderResDto,
} from './dto/order.dto';

@Injectable()
export class OrderService {
  constructor(
    private configService: ConfigService<Config>,
    private prisma: PrismaService,
    private polkadot: PolkadotService,
  ) {}

  async listing(
    user: AuthUser,
    createOrderDto: ListingOrderReqDto,
  ): Promise<ListingOrderResDto> {
    const extrinsic = this.polkadot.getApi().tx(createOrderDto.signedExtrinsic);
    const inscription = parseInscription(extrinsic);
    if (!inscription) {
      throw new BadRequestException('Invalid extrinsic');
    }

    // Check is approve content
    if (inscription.content.op !== 'approve') {
      throw new BadRequestException('Invalid extrinsic');
    }

    // Check is approve to market account
    const approveContent = inscription.content as ApproveContent;
    const marketAccount = this.configService.get('marketAccount');
    if (!sameAddress(approveContent.approved, marketAccount)) {
      throw new BadRequestException('Invalid extrinsic');
    }

    // Check singer is current user
    if (!sameAddress(inscription.sender, user.address)) {
      throw new BadRequestException('Invalid extrinsic');
    }

    // Check if the NFT is not listed yet
    const listedOrder = this.prisma.order.findFirst({
      where: {
        collection_id: approveContent.id,
        token_id: approveContent.token_id,
        status: {
          in: ['PENDING', 'LISTING'],
        },
      },
    });
    if (listedOrder) {
      throw new BadRequestException('NFT is already listed');
    }

    // Save order
    const date = new Date();
    const order = await this.prisma.order.create({
      data: {
        seller: user.address,
        collection_id: approveContent.id,
        token_id: approveContent.token_id,
        status: 'PENDING',
        chainStatus: 'PENDING',
        totalPrice: new Decimal(createOrderDto.totalPrice),
        sellHash: extrinsic.hash.toString(),
        createdAt: date,
        updatedAt: date,
      },
    });

    // Submit extrinsic to chain and wait
    const errMsg = await submitSignedExtrinsicAndWait(
      this.polkadot.getApi(),
      extrinsic,
    );
    if (errMsg) {
      await this.prisma.order.update({
        where: { id: order.id },
        data: {
          status: 'FAILED',
          chainStatus: 'SELL_BLOCK_FAILED',
          failReason: errMsg,
          updatedAt: new Date(),
        },
      });

      throw new BadRequestException('Submit extrinsic failed');
    }

    await this.prisma.order.update({
      where: { id: order.id },
      data: {
        status: 'LISTING',
        chainStatus: 'SELL_BLOCK_CONFIRMED',
        updatedAt: new Date(),
      },
    });

    return {
      id: order.id,
      hash: extrinsic.hash.toString(),
    };
  }

  async cancel(
    user: AuthUser,
    cancelOrderReqDto: CancelOrderReqDto,
  ): Promise<CancelOrderResDto> {
    const extrinsic = this.polkadot
      .getApi()
      .tx(cancelOrderReqDto.signedExtrinsic);
    const inscription = parseInscription(extrinsic);
    if (!inscription) {
      throw new BadRequestException('Invalid extrinsic');
    }

    // Check is approve content
    if (inscription.content.op !== 'approve') {
      throw new BadRequestException('Invalid extrinsic');
    }

    // Check is revoke approval
    const approveContent = inscription.content as ApproveContent;
    if (approveContent.approved) {
      throw new BadRequestException('Invalid extrinsic');
    }

    // Check order is exist
    const order = await this.prisma.order.findUnique({
      where: { id: cancelOrderReqDto.id },
    });
    if (!order) {
      throw new BadRequestException('Order not found');
    }

    // Check is seller
    if (!sameAddress(inscription.sender, order.seller)) {
      throw new BadRequestException('Not order owner');
    }

    // Try to update order status, only LISTING order can be canceled
    const date = new Date();
    const result = await this.prisma.order.updateMany({
      where: { id: order.id, status: 'LISTING' },
      data: {
        status: 'CANCELING',
        cancelHash: extrinsic.hash.toString(),
        updatedAt: date,
      },
    });
    if (result.count === 0) {
      throw new BadRequestException('Order status failed');
    }

    // Submit extrinsic to chain and wait
    const errMsg = await submitSignedExtrinsicAndWait(
      this.polkadot.getApi(),
      extrinsic,
    );
    if (errMsg) {
      await this.prisma.order.update({
        where: { id: order.id },
        data: {
          status: 'LISTING',
          chainStatus: 'CANCEL_BLOCK_FAILED',
          failReason: errMsg,
          updatedAt: new Date(),
        },
      });

      throw new BadRequestException('Submit extrinsic failed');
    }

    await this.prisma.order.update({
      where: { id: order.id },
      data: {
        chainStatus: 'CANCEL_BLOCK_CONFIRMED',
        updatedAt: new Date(),
      },
    });

    return {
      id: order.id,
      hash: extrinsic.hash.toString(),
    };
  }
}
