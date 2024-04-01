import { PageReq, PageRes, noAuthProcedure, router } from '../server/trpc';

export type CollectionsReq = {
  /**
   * Account address
   */
  address: string;
  /**
   * Collection name filter, support fuzzy search
   */
  name?: string;
}
export type CollectionsRes = {
  /**
   * Collection id
   */
  id: string;
  /**
   * Collection name
   */
  name: string;
  /**
   * Owned quantity
   */
  ownedQuantity: number;
  /**
   * Floor price
   */
  floorPrice: string;
}[]

export type TokensReq = PageReq & {
  /**
  * Account address
  */
  address: string;
  /**
   * Collection id
   */
  collectionId?: string;
  /**
   * Sort by field
   */
  sortBy: 'recently_received' | 'price_low_to_high' | 'price_high_to_low';
}
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
}>;

export const accountRouter = router({
  /**
   * Query account owned NFT collections
   */
  collections: noAuthProcedure.input((input) => input as CollectionsReq).query(async ({ ctx }): Promise<CollectionsRes> => {
    return null as unknown as CollectionsRes
  }),
  /**
   * Query account owned NFT tokens with pagination
   */
  tokens: noAuthProcedure.input((input) => input as TokensReq).query(async ({ ctx }): Promise<TokensRes> => {
    return null as unknown as TokensRes;
  }),
});
