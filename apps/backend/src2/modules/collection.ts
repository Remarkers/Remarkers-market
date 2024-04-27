import { PageReq, PageRes, noAuthProcedure, router } from '../server/trpc';

export type CollectionsReq = PageReq & {
  /**
   * Account address
   */
  address?: string;
  /**
   * Collection name filter, support fuzzy search
   */
  name?: string;
  /**
   * Sort by field
   */
  sortBy:
    | 'volume_low_to_high'
    | 'volume_hight_to_low'
    | 'price_low_to_high'
    | 'price_high_to_low'
    | 'recently_created';
};
export type CollectionsRes = PageRes<{
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
}>;

export const collectionRouter = router({
  /**
   * Query NFT collections
   */
  collections: noAuthProcedure
    .input((input) => input as CollectionsReq)
    .query(async ({ ctx }): Promise<CollectionsRes> => {
      return null as unknown as CollectionsRes;
    }),
});
