import { configureStore } from '@reduxjs/toolkit';
import subwayReducer from './feature/subway/subwaySlice';

export const store = configureStore({
  reducer: {
    subway: subwayReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
