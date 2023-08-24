import { createSlice } from '@reduxjs/toolkit';

export interface SubwayState {
  selected: string;
}

const initialState: SubwayState = {
  selected: '',
};

const subwaySlice = createSlice({
  name: 'subwayStation',
  initialState,
  reducers: {
    selectStation: (state, action) => {
      state.selected = action.payload;
    },
  },
});

export const { selectStation } = subwaySlice.actions;
export default subwaySlice.reducer;
