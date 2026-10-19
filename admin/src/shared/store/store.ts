import { configureStore } from '@reduxjs/toolkit';

import { authApi } from '@shared/api';
import { accessRequestApi } from '@shared/api/accessRequestApi';

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [accessRequestApi.reducerPath]: accessRequestApi.reducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(
    authApi.middleware,
    accessRequestApi.middleware,
  ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
