export class ListingOrderReqDto {
  /**
   * Total price (unit: DOT)
   */
  totalPrice: string;
  /**
   * Extrinsic data signed by seller
   * utility.batchAll([tx1,tx2])
   * tx1: dot-721 approve call
   * tx2: balances.transferKeepAlive call to transfer service fee to market
   */
  signedExtrinsic: string;
}
export class ListingOrderResDto {
  /**
   * Order id
   */
  id: bigint;
  /**
   * Extrinsic hash
   */
  hash: string;
}
