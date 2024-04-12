import { ApiProperty } from '@nestjs/swagger';

export class ListingOrderReqDto {
  /**
   * Total price (unit: DOT)
   */
  @ApiProperty({ description: 'Total price (unit: DOT)', example: '10.2' })
  totalPrice: string;
  /**
   * Extrinsic hex data signed by seller
   * utility.batchAll([tx1,tx2])
   * tx1: dot-721 approve call
   * tx2: balances.transferKeepAlive call to transfer service fee to market
   */
  @ApiProperty({
    description: 'Extrinsic hex data signed by seller',
  })
  signedExtrinsic: string;
}
export class ListingOrderResDto {
  /**
   * Order id
   */
  @ApiProperty({ description: 'Order id' })
  id: bigint;
  /**
   * Extrinsic hash
   */
  @ApiProperty({ description: 'Extrinsic hash' })
  hash: string;
}
