import { createSlice } from "@reduxjs/toolkit";
import { ICoursePlaceName } from "../../interfaces/Course.type";
import {
  getCourseListAction,
  bookmarkToggleAction,
  likeToggleAction,
  removeCourseAction,
  createCourseAction,
  editCourseAction,
} from "../thunks/courseThunks";

interface CourseState {
  error?: string;
  courseList: ICoursePlaceName[];
  totalElements?: number;
  totalPages?: number;
}

export interface ToggleLikeApiResponse {
  courseId: number;
  totalLikes: number;
}

const initialState: CourseState = {
  courseList: [],
};

export const courseListSlice = createSlice({
  name: "course",
  initialState: initialState,
  reducers: {
    addCourseToList: (state, action) => {
      state.courseList.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createCourseAction.fulfilled, (state, action) => {
      // state.createUserFormStatus = ApiStatus.success;
      const { formData, resData } = action.payload;
      const placeNames = formData.places.map((place) => place.name).join(",");
      const createdCourse: ICoursePlaceName = {
        courseId: parseInt(resData.courseId),
        ...formData,
        places: placeNames,
      };
      state.courseList.push(createdCourse);
    });
    builder.addCase(editCourseAction.fulfilled, (state, action) => {});

    builder.addCase(getCourseListAction.pending, (state) => {});
    builder.addCase(getCourseListAction.fulfilled, (state, action) => {
      const { courseList, totalElements, totalPages } = action.payload;
      state.courseList = courseList;
      state.totalElements = totalElements;
      state.totalPages = totalPages;
    });
    builder.addCase(getCourseListAction.rejected, (state) => {});
    builder.addCase(bookmarkToggleAction.pending, (state) => {});
    builder.addCase(bookmarkToggleAction.fulfilled, (state, action) => {
      const { courseId, isDetailPage } = action.payload;
      if (isDetailPage === undefined || isDetailPage === true) return;
      const course = state.courseList.find((c) => c.courseId === courseId);
      if (course) {
        course.isBookmarked = !course.isBookmarked;
      }
    });
    builder.addCase(bookmarkToggleAction.rejected, (state) => {});
    builder.addCase(likeToggleAction.pending, (state) => {});
    builder.addCase(likeToggleAction.fulfilled, (state, action) => {
      const { courseId, totalLikes, isDetailPage } = action.payload;

      if (isDetailPage === undefined || isDetailPage === true) return;
      if (state.courseList.length > 0) {
        const course = state.courseList.find((c) => c.courseId === courseId);
        if (course) {
          course.isLiked = !course.isLiked;
          course.likeCount = totalLikes;
        }
      }
    });
    builder.addCase(likeToggleAction.rejected, (state) => {});
    builder.addCase(removeCourseAction.pending, (state) => {});
    builder.addCase(removeCourseAction.fulfilled, (state, action) => {
      const newList = state.courseList?.filter(
        (x) => x.courseId !== action.payload
      );
      state.courseList = newList;
    });
    builder.addCase(removeCourseAction.rejected, (state) => {});
  },
});

export const { addCourseToList } = courseListSlice.actions;
export default courseListSlice.reducer;
