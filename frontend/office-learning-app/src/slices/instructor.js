import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import instructorService from '../services/instructor.service';
import { setMessage } from './message';

//current course that is being made
const initialState = { course: null };

export const newCourse = createAsyncThunk(
  '/instructor/newCourse',
  async ({ courseName, courseDescription }, thunkAPI) => {
    try {
      const response = await instructorService.newCourse(
        courseName,
        courseDescription
      );
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

export const updateCourse = createAsyncThunk(
  '/instructor/updateCourse',
  async ({ courseName, courseDescription }, thunkAPI) => {
    try {
      const response = await instructorService.updateCourse(
        courseName,
        courseDescription
      );
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

export const deleteCourse = createAsyncThunk(
  '/instructor/deleteCourse',
  async ({ id }, thunkAPI) => {
    try {
      const response = await instructorService.deleteCourse(id);
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

const instructorSlice = createSlice({
  name: 'instructor',
  initialState,
  extraReducers: {
    [newCourse.fulfilled]: (state, action) => {
      console.log('new course request fulfilled');
      state.course = action.course;
    },
    [newCourse.rejected]: (state) => {
      console.log('new course request rejected, state: ' + state);
    },
  },
});

const { reducer } = instructorSlice;
export default reducer;
