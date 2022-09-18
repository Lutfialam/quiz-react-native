import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface serverStatusType {
  code: number;
  status: 'ok' | 'failed';
  message: string;
}

const initialState: serverStatusType = {
  code: 0,
  status: 'ok',
  message: '',
};

export const serverStatusSlice = createSlice({
  name: 'serverStatus',
  initialState,
  reducers: {
    setServerStatus(state, action: PayloadAction<serverStatusType>) {
      return action.payload;
    },
    resetServerStatus() {
      return initialState;
    },
  },
});

export const {setServerStatus, resetServerStatus} = serverStatusSlice.actions;
export default serverStatusSlice.reducer;
