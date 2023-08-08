import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import instructorService from '../services/instructor.service';
import { setMessage } from './message';

//current course that is being made
//current course that is being edited
//my published courses
const initialState = {
  course: null,
  editingCourse: null,
  myCourses: [],
  success: false,
  update: false,
  videoUrl: '',
};

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
      thunkAPI.dispatch(getMyCourses());
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

export const newSection = createAsyncThunk(
  '/instructor/newsection',
  async ({ courseId, sectionName }, thunkAPI) => {
    try {
      const response = await instructorService.newSection(
        courseId,
        sectionName
      );
      thunkAPI.dispatch(setSuccessOn());
      //thunkAPI.dispatch(getSections({ courseId }));
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

export const getSections = createAsyncThunk(
  '/instructor/getSections',
  async ({ courseId }, thunkAPI) => {
    try {
      const response = await instructorService.getSection(courseId);

      thunkAPI.dispatch(setMessage(response.data.message));
      //thunkAPI.dispatch(toggleUpdate());
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

export const updateSection = createAsyncThunk(
  '/instructor/updateSection',
  async ({ courseId, sectionId, sectionName }, thunkAPI) => {
    try {
      const response = await instructorService.updateSection(
        courseId,
        sectionId,
        sectionName
      );
      thunkAPI.dispatch(setSuccessOn());
      //thunkAPI.dispatch(getSections({ courseId }));
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

export const deleteSection = createAsyncThunk(
  '/instructor/deleteSection',
  async ({ courseId, sectionId }, thunkAPI) => {
    try {
      const response = await instructorService.deleteSection(
        courseId,
        sectionId
      );
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

export const newSubSection = createAsyncThunk(
  '/instructor/newSubSection',
  async ({ sectionId, subSectionName, subSectionDescription }, thunkAPI) => {
    try {
      const response = await instructorService.newSubSection(
        sectionId,
        subSectionName,
        subSectionDescription
      );
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

export const getSubSection = createAsyncThunk(
  '/instructor/getSubSection',
  async ({ sectionId }, thunkAPI) => {
    try {
      //console.log(sectionId);
      const response = await instructorService.getSubSection(sectionId);
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

export const updateSubSection = createAsyncThunk(
  '/instructor/updateSubSection',
  async (
    { sectionId, subSectionId, subSectionName, subSectionDescription },
    thunkAPI
  ) => {
    try {
      const response = await instructorService.updateSubSection(
        sectionId,
        subSectionId,
        subSectionName,
        subSectionDescription
      );
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

export const deleteSubSection = createAsyncThunk(
  '/instructor/deleteSubSection',
  async ({ sectionId, subSectionId }, thunkAPI) => {
    try {
      const response = await instructorService.deleteSubSection(
        sectionId,
        subSectionId
      );
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

export const uploadVideo = createAsyncThunk(
  '/instructor/uploadVideo',
  async ({ subSectionId, file }, thunkAPI) => {
    try {
      const response = await instructorService.uploadVideo(subSectionId, file);
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

export const getEnrollments = createAsyncThunk(
  '/instructor/getEnrollments',
  async ({ courseId }, thunkAPI) => {
    try {
      //console.log(sectionId);
      const response = await instructorService.getEnrollments(courseId);
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
export const newAssignment = createAsyncThunk(
  '/instructor/newAssignment',
  async ({ enrollmentId, assignmentName, grade }, thunkAPI) => {
    try {
      const response = await instructorService.newAssignment(
        enrollmentId,
        assignmentName,
        grade
      );
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
export const getAssignments = createAsyncThunk(
  '/instructor/getAssignments',
  async ({ enrollmentId }, thunkAPI) => {
    try {
      const response = await instructorService.getAssignments(enrollmentId);
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
    setSuccessOn: (state) => {
      state.success = true;
    },
    setSuccessOff: (state) => {
      state.success = false;
    },
    setUpdateOn: (state) => {
      state.update = true;
    },
    setUpdateOff: (state) => {
      state.update = false;
    },
    toggleUpdate: (state) => {
      state.update = !state.update;
    },
    setVideoUrl: (state, action) => {
      state.videoUrl = action.payload;
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
      state.myCourses = action.payload;
      console.log('get my courses fulfilled');
    },
    [getMyCourses.rejected]: (state, action) => {
      console.log('get my courses rejected');
      state.myCourses = [];
    },
    [updateCourse.fulfilled]: (state, action) => {
      state.editingCourse = action.payload.course;
    },
    [newSection.fulfilled]: (state) => {
      state.update = !state.update;
    },
  },
});

const { reducer, actions } = instructorSlice;
export const {
  setEditingCourse,
  setSuccessOn,
  setSuccessOff,
  setUpdateOn,
  setUpdateOff,
  toggleUpdate,
  setVideoUrl,
} = actions;
export default reducer;
