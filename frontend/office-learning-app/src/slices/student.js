import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import studentService from '../services/student.service';
import { setSuccessOff, setSuccessOn, toggleUpdate } from './instructor';
import { setMessage } from './message';

const initialState = {};

export const getSingleCourse = createAsyncThunk(
  '/student/getSingleCourse',
  async ({ courseId }, thunkAPI) => {
    try {
      //console.log(sectionId);
      const response = await studentService.getSingleCourse(courseId);
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

export const getAllCourses = createAsyncThunk(
  '/student/getallcourses',
  async (thunkAPI) => {
    try {
      //console.log(sectionId);
      const response = await studentService.getAllCourses();
      //thunkAPI.dispatch(setMessage(response.data.message));
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

export const searchCourse = createAsyncThunk(
  '/student/searchCourse',
  async ({ s }, thunkAPI) => {
    try {
      const response = await studentService.searchCourse(s);
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
export const enrollInCourse = createAsyncThunk(
  '/student/enrollInCourse',
  async ({ courseId }, thunkAPI) => {
    try {
      const response = await studentService.enrollInCourse(courseId);
      thunkAPI.dispatch(setSuccessOn());
      thunkAPI.dispatch(toggleUpdate());
      thunkAPI.dispatch(setMessage(response.data.message));
      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      thunkAPI.dispatch(setSuccessOff());
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message);
    }
  }
);
export const getEnrolledCourses = createAsyncThunk(
  '/student/getEnrolledCourses',
  async (thunkAPI) => {
    try {
      const response = await studentService.getEnrolledCourses();
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

const studentSlice = createSlice({
  name: 'student',
  initialState,
  extraReducers: {
    [getSingleCourse.fulfilled]: (state, action) => {
      console.log('get single course fullfilled');
    },
  },
});

const { reducer, actions } = studentSlice;
export default reducer;
