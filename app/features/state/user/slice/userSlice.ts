import {UserType} from '@/types/user';
import {API_URL} from '@env';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

const initialState: UserType = {
  id: 0,
  name: '',
  email: '',
  image: ``,
  level: '',
  created_at: '',
  updated_at: '',
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserType>) {
      return {
        image: `${API_URL}/images/${action.payload.image}`,
        ...action.payload,
      };
    },
    resetUser() {
      return initialState;
    },
  },
});

export const {setUser, resetUser} = userSlice.actions;
export default userSlice.reducer;
