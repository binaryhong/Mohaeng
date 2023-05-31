import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  removeCourseApi,
  getCourseListApi,
  toggleBookmarkApi,
  toggleLikeApi,
  createCourseApi,
  editCourseApi,
} from "@/src/services/courseService";
import { ToggleLikeApiResponse } from "../reducers/CourseListSlice";
import { getCourseDetailApi } from "@/src/services/courseDetailService";
import {
  ICourseEditParam,
  ICourseOriginForm,
  ICourseSubmitForm,
} from "@/src/interfaces/Course.type";

interface ILikeToggleParams {
  courseId: number;
  isLiked: boolean;
  isDetailPage?: boolean;
}
interface IBookmarkToggleParams {
  courseId: number;
  isBookmarked: boolean;
  isDetailPage?: boolean;
}

export const getCourseListAction = createAsyncThunk(
  "course/getCourseListAction",
  async (queryParams: any, { rejectWithValue }) => {
    try {
      const CourseListData = await getCourseListApi(queryParams);
      return CourseListData;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const removeCourseAction = createAsyncThunk(
  "course/removeCourseAction",
  async (courseId: number, { rejectWithValue }) => {
    try {
      await removeCourseApi(courseId);
      return courseId;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const likeToggleAction = createAsyncThunk(
  "course/toggleLike",
  async ({ courseId, isLiked, isDetailPage }: ILikeToggleParams) => {
    let resData: ToggleLikeApiResponse;

    if (isLiked) {
      resData = await toggleLikeApi(courseId, "DELETE");
    } else {
      resData = await toggleLikeApi(courseId, "POST");
    }
    return { ...resData, isDetailPage };
  }
);

export const bookmarkToggleAction = createAsyncThunk(
  "course/toggleBookmark",
  async ({ courseId, isBookmarked, isDetailPage }: IBookmarkToggleParams) => {
    if (isBookmarked) {
      await toggleBookmarkApi(courseId, "DELETE");
    } else {
      await toggleBookmarkApi(courseId, "POST");
    }
    return { courseId, isDetailPage };
  }
);

export const getCourseDetailAction = createAsyncThunk(
  "course/getCourseDetailAction",
  async (courseId: number, { rejectWithValue }) => {
    try {
      const response = await getCourseDetailApi(courseId);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

async function convertCourseOriginToSubmitForm(
  params: ICourseOriginForm
): Promise<ICourseSubmitForm> {
  const { places, thumbnailUrl, ...rest } = params;
  const extractedPlaceIds = places.map((place) => place.placeId);
  const foundPlaceObj = places.find(
    (place) =>
      place.imgUrl.startsWith("http://tong.visitkorea.or.kr") ||
      place.imgUrl.startsWith("https://cdn.visitkorea.or.kr")
  );

  const thumbnailUrlFormat = foundPlaceObj?.imgUrl || places[0].imgUrl;
  return {
    ...rest,
    placeIds: extractedPlaceIds,
    thumbnailUrl: thumbnailUrlFormat,
  };
}

export const createCourseAction = createAsyncThunk(
  "course/createCourseAction",
  async (formData: ICourseOriginForm, { rejectWithValue }) => {
    try {
      const validData = await convertCourseOriginToSubmitForm(formData);
      const resData = await createCourseApi(validData);
      return { formData, resData };
    } catch (error) {
      return rejectWithValue("코스를 생성하는 데에 실패했습니다.");
    }
  }
);

export const editCourseAction = createAsyncThunk(
  "course/editCourseAction",
  async ({ formData, courseId }: ICourseEditParam, { rejectWithValue }) => {
    try {
      const validData = await convertCourseOriginToSubmitForm(formData);
      await editCourseApi(courseId, validData);
      return formData;
    } catch (error) {
      return rejectWithValue("코스를 수정하는 데에 실패했습니다.");
    }
  }
);
