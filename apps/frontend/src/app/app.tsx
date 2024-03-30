import { Button } from '@material-tailwind/react';
import { trpc } from '@utils/trpc';

export function App() {
  const resp = trpc.order.test.useQuery();

  return <Button>{resp.data ?? 'loading'}</Button>;
}

export default App;
