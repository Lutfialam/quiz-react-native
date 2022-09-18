import {configureStore} from '@reduxjs/toolkit';
import serverStatusReducer from './statusServer/statusServerSlice';
import tabReducer from './tab/tabSlice';
import userReducer from './user/slice/userSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    tabScreen: tabReducer,
    serverStatus: serverStatusReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
