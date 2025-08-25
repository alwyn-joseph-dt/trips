import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MenuState {
  allowedMenuIds: string[];
}

const initialState: MenuState = {
  allowedMenuIds: [],
};

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    setAllowedMenuIds(state, action: PayloadAction<string[]>) {
      state.allowedMenuIds = action.payload;
    },
  },
});

export const { setAllowedMenuIds } = menuSlice.actions;
export default menuSlice.reducer; 