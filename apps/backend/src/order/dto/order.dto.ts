import { ApiProperty } from '@nestjs/swagger';
import { PageReq } from 'src/core/response.dto';

export class ListingOrderReqDto {
  /**
   * Total price (unit: DOT)
   */
  @ApiProperty({ title: 'Total price (unit: DOT)', example: '10.2' })
  totalPrice: string;
  /**
   * Extrinsic hex data signed by seller
   * utility.batchAll([tx1,tx2])
   * tx1: dot-721 approve call
   * tx2: balances.transferKeepAlive call to transfer service fee to market
   */
  @ApiProperty({
    title: 'Extrinsic hex data signed by seller',
  })
  signedExtrinsic: string;
}
export class ListingOrderResDto {
  /**
   * Order id
   */
  @ApiProperty({ title: 'Order id' })
  id: bigint;
  /**
   * Extrinsic hash
   */
  @ApiProperty({ title: 'Extrinsic hash' })
  hash: string;
}

export class OrderPageReqDto extends PageReq {
  /**
   * Order status
   */
  @ApiProperty({ title: 'Order status' })
  status: string;
}
export class OrderPageResItemDto {
  /**
   * Order id
   */
  @ApiProperty({ title: 'Order id' })
  id: bigint;
  /**
   * Order status
   */
  @ApiProperty({ title: 'Order status' })
  status: string;
}

export class CancelOrderReqDto {
  /**
   * Order id
   */
  @ApiProperty({ title: 'Order id' })
  id: bigint;
  /**
   * Extrinsic hex data signed by seller
   * utility.batchAll([tx1,tx2])
   * tx1: dot-721 approve(cancel) call
   * tx2: balances.transferKeepAlive call to transfer service fee to market
   */
  @ApiProperty({
    title: 'Extrinsic hex data signed by seller',
  })
  signedExtrinsic: string;
}
export class CancelOrderResDto {
  /**
   * Order id
   */
  @ApiProperty({ title: 'Order id' })
  id: bigint;
  /**
   * Extrinsic hash
   */
  @ApiProperty({ title: 'Extrinsic hash' })
  hash: string;
}
