/* eslint-disable @typescript-eslint/no-unused-vars */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import userService from '../services/user.service';
import { setMessage } from './message';

const initialState = {};

export const upload = createAsyncThunk(
  '/video/upload',
  async ({ file }, thunkAPI) => {
    try {
      const response = await userService.uploadFile(file);
      thunkAPI.dispatch(setMessage(response.data.message));
      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      console.log('in video slice error ' + message);
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const videoSlice = createSlice({
  name: 'video',
  initialState,
  extraReducers: {
    [upload.fulfilled]: (state, action) => {
      console.log('video upload fullfilled');
    },
    [upload.rejected]: (state, action) => {
      console.log('video upload rejected');
    },
  },
});

const { reducer, actions } = videoSlice;
export default reducer;
