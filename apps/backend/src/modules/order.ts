import { BizError } from 'apps/libs/error';
import { scanner } from 'indexer/src/index';
import { procedure, router } from '../server/trpc';

export type SellReq = {
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
};
export type SellRes = {
  /**
   * Order id
   */
  id: bigint;
  /**
   * Extrinsic hash
   */
  hash: string;
};

export type CancelReq = {
  /**
   * Order id
   */
  id: bigint;
};
export type CancelRes = {
  /**
   * Order id
   */
  id: bigint;
  /**
   * Extrinsic hash
   */
  hash: string;
};

export type BuyReq = {
  /**
   * Order id
   */
  id: bigint;
  /**
   * Extrinsic data signed by buyer
   * balances.transferKeepAlive call to transfer total price + service fee to market
   */
  signedExtrinsic: string;
};
export type BuyRes = {
  /**
   * Order id
   */
  id: bigint;
  /**
   * Extrinsic hash
   */
  hash: string;
};

export const orderRouter = router({
  /**
   * Sell a NFT token
   */
  sell: procedure
    .input((input) => input as SellReq)
    .mutation(async ({ input, ctx }): Promise<SellRes> => {
      const extrinsic = ctx.api.tx(input.signedExtrinsic);
      const inscription = scanner.parseInscription(extrinsic);
      if (!inscription) {
        throw BizError.ofTrpc(
          'INVALID_TRANSACTION',
          'Invalid extrinsic format',
        );
      }

      // Check seller is current login user
      if (inscription.sender !== ctx.user.address) {
        throw new Error('Invalid seller');
      }
    }),
  /**
   * Cancel a NFT token sell order
   */
  cancel: procedure
    .input((input) => input as CancelReq)
    .mutation(async ({ ctx }): Promise<CancelRes> => {
      return null as unknown as CancelRes;
    }),
  /**
   * Buy a NFT token
   */
  buy: procedure
    .input((input) => input as BuyReq)
    .mutation(async ({ ctx }): Promise<BuyRes> => {
      return null as unknown as BuyRes;
    }),
});
