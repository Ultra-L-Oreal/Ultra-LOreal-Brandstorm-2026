// frontend/src/store/slices/uiSlice.ts
//import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';


interface UiState {
  mobileMenuOpen: boolean;
}

const initialState: UiState = {
  mobileMenuOpen: false
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleMenu(state) {
      state.mobileMenuOpen = !state.mobileMenuOpen;
    },
    setMenu(state, action: PayloadAction<boolean>) {
      state.mobileMenuOpen = action.payload;
    }
  }
});

export const { toggleMenu, setMenu } = uiSlice.actions;
export default uiSlice.reducer;
