import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/auth';
import messageReducer from './slices/message';
import videoReducer from './slices/video';
import instructorReducer from './slices/instructor';
const reducer = {
  auth: authReducer,
  message: messageReducer,
  video: videoReducer,
  instructor: instructorReducer,
};

const store = configureStore({
  reducer: reducer,
  devTools: true,
});

export default store;
