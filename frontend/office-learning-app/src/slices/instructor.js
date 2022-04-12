import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import instructorService from '../services/instructor.service';
import { setMessage } from './message';

//current course that is being made
//current course that is being edited
//my published courses
const initialState = { course: null, editingCourse: null, myCourses: [] };

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
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getMyCourses = createAsyncThunk(
  '/instructor/getMyCourses',
  async (thunkAPI) => {
    try {
      const response = await instructorService.getMyCourses();
      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateCourse = createAsyncThunk(
  '/instructor/updateCourse',
  async ({ courseName, courseDescription, id }, thunkAPI) => {
    try {
      const response = await instructorService.updateCourse(
        courseName,
        courseDescription,
        id
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
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const instructorSlice = createSlice({
  name: 'instructor',
  initialState,
  reducers: {
    setEditingCourse: (state, action) => {
      state.editingCourse = action.payload;
    },
  },
  extraReducers: {
    [newCourse.fulfilled]: (state, action) => {
      console.log('new course request fulfilled');
      state.course = action.payload.course;
    },
    [newCourse.rejected]: (state) => {
      console.log('new course request rejected, state: ' + state);
    },
    [getMyCourses.fulfilled]: (state, action) => {
      console.log('get my courses fulfilled');
      state.myCourses = action.payload;
    },
    [getMyCourses.rejected]: (state, action) => {
      console.log('get my courses rejected');
      state.myCourses = [];
    },
    [updateCourse.fulfilled]: (state, action) => {
      state.editingCourse = action.payload.course;
    },
  },
});

const { reducer, actions } = instructorSlice;
export const { setEditingCourse } = actions;
export default reducer;
