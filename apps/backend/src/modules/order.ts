import { noAuthProcedure, router } from '../server/trpc';

export const orderRouter = router({
  /**
   * test
   */
  test: noAuthProcedure.query(async ({ ctx }): Promise<string> => {
    return 'hello trpc';
  }),
});
