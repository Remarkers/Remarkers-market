import { PageReq, PageRes, noAuthProcedure, router } from '../server/trpc';

export type TokensReq = PageReq & {
  /**
  * Account address
  */
  address?: string;
  /**
   * Collection id
   */
  collectionId?: string;
  /**
   * Sort by field
   */
  sortBy: 'recently_received' | 'price_low_to_high' | 'price_high_to_low';
};
export type TokensRes = PageRes<{
  /**
   * Token id
   */
  id: number;
  /**
   * Collection id
   */
  collectionId: string;
  /**
   * Token name
   */
  name: string;
  /**
   * Token image
   */
  image: string;
  /**
   * Status
   */
  status?: 'listed';
  /**
   * Listed order id
   */
  listedOrderId?: bigint;
  /**
   * Listed price (unit: DOT)
   */
  listedPrice?: string;
  /**
 * Last price (unit: DOT)
 */
  lastPrice?: string;
}>;

export const tokenRouter = router({
  /**
   * Query account owned NFT tokens with pagination
   */
  tokens: noAuthProcedure.input((input) => input as TokensReq).query(async ({ ctx }): Promise<TokensRes> => {
    return null as unknown as TokensRes;
  }),
});
