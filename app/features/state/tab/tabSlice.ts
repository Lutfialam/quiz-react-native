import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface TabType {
  currentScreen: string;
}

const initialState: TabType = {
  currentScreen: '',
};

export const tabSlice = createSlice({
  name: 'tab',
  initialState,
  reducers: {
    setTab(state, action: PayloadAction<TabType>) {
      return action.payload;
    },
    resetTab() {
      return initialState;
    },
  },
});

export const {setTab, resetTab} = tabSlice.actions;
export default tabSlice.reducer;
