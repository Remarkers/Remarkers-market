import { accountRouter } from '../modules/account';
import { collectionRouter } from '../modules/collection';
import { orderRouter, } from '../modules/order';
import { tokenRouter } from '../modules/token';
import { router } from './trpc';

export const appRouter = router({
  account: accountRouter,
  order: orderRouter,
  collection: collectionRouter,
  token: tokenRouter,
});

export type AppRouter = typeof appRouter;
