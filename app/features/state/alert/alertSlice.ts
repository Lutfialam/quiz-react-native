import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface AlertType {
  title: string;
  message: string;
  status: 'success' | 'info' | 'failed';
}

const initialState: AlertType = {
  title: '',
  message: '',
  status: 'success',
};

export const alertSlice = createSlice({
  name: 'alert',
  initialState,
  reducers: {
    setAlert(state, action: PayloadAction<AlertType>) {
      return action.payload;
    },
    resetAlert() {
      return initialState;
    },
  },
});

export const {setAlert, resetAlert} = alertSlice.actions;
export default alertSlice.reducer;
