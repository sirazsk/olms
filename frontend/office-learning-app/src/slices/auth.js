import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { setMessage } from './message';

import AuthService from '../services/auth.service';

const user = JSON.parse(localStorage.getItem('user'));

export const register = createAsyncThunk(
  '/auth/signup',
  async ({ fullName, email, password }, thunkAPI) => {
    try {
      const response = await AuthService.register(fullName, email, password);
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
      return thunkAPI.rejectWithValue();
    }
  }
);

export const login = createAsyncThunk(
  '/auth/signin',
  async ({ email, password }, thunkAPI) => {
    try {
      const data = await AuthService.login(email, password);

      return { user: data };
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue();
    }
  }
);

export const logout = createAsyncThunk('/auth/logout', async () => {
  await AuthService.logout();
});

const initialState = user
  ? { isLoggedIn: true, user, isInstructor: false }
  : { isLoggedIn: false, user: null, isInstructor: false };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setIsInstructor: (state) => {
      state.isInstructor = false;
    },
    setIsStudent: (state) => {
      state.isInstructor = true;
    },
  },
  extraReducers: {
    [register.fulfilled]: (state) => {
      state.isLoggedIn = false;
    },
    [register.rejected]: (state) => {
      state.isLoggedIn = false;
    },
    [login.fulfilled]: (state, action) => {
      state.isLoggedIn = true;
      state.user = action.payload.user;
    },
    [login.rejected]: (state) => {
      state.isLoggedIn = false;
      state.user = null;
    },
    [logout.fulfilled]: (state) => {
      state.isLoggedIn = false;
      state.user = null;
    },
  },
});

const { reducer, actions } = authSlice;
export const { setIsInstructor, setIsStudent } = actions;
export default reducer;
