import {configureStore} from '@reduxjs/toolkit';
import tabReducer from '@/state/tab/tabSlice';
import userReducer from '@/state/user/slice/userSlice';
import alertReducer from '@/state/alert/alertSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    alert: alertReducer,
    tabScreen: tabReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
