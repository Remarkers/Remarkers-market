import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { Root } from './app/root';
import './styles.css';

import { ThemeProvider } from '@material-tailwind/react';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(
  <StrictMode>
    <ThemeProvider>
      <Root />
    </ThemeProvider>
  </StrictMode>,
);
