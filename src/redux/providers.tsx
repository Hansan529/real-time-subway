'use client';

import { Provider } from 'react-redux';
import { store } from './store';
import { RootLayout } from '@/app/layout';

export default function ReactProvider({ children }: RootLayout) {
  return <Provider store={store}>{children}</Provider>;
}
