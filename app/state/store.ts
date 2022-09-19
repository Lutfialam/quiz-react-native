import {configureStore} from '@reduxjs/toolkit';
import tabReducer from '@/app/state/tab/tabSlice';
import userReducer from '@/app/state/user/slice/userSlice';
import alertReducer from '@/app/state/alert/alertSlice';

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
