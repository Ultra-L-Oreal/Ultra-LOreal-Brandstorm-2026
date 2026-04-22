// frontend/src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './slices/uiSlice';

const store = configureStore({
  reducer: {
    ui: uiReducer
  },
  devTools: import.meta.env.DEV
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
