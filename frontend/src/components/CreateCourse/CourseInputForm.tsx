import { useAppDispatch, useAppSelector } from "@/src/hooks/useReduxHooks";
import { ICourseForm } from "@/src/interfaces/Course.type";
import {
  setFormValue,
  setIsFormValidFalse,
  setIsFormValidTrue,
} from "@/src/store/reducers/CourseFormSlice";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import styles from "./CourseInputForm.module.css";
import {
  validateContent,
  validateIsSelected,
  validateStartEndDate,
  validateTitle,
} from "@/src/utils/validation";
import useValidateInput from "@/src/hooks/useValidateInput";
import { ResionOptions } from "@/src/utils/input-options";

const CourseInputForm = () => {
  const course = useAppSelector((state) => {
    return state.courseForm;
  });
  const { title, startDate, endDate, isPublished, region, content } =
    course.course;
  const { errors } = course;

  const dispatch = useAppDispatch();
  const [calcCourseDays, setCalcCourseDays] = useState("");
  const [dateIsValid, setDateIsValid] = useState(true);

  function calculateCoursePeriod(startDate: string, endDate: string) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const diffInMs = end.getTime() - start.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24)) + 1;
    if (!diffInMs) return "당일 치기";
    const nightCount = diffInDays - 1;

    return `${nightCount}박 ${diffInDays}일`;
  }

  const {
    value: enteredTitle,
    isValid: enteredTitleIsValid,
    hasError: titleInputHasError,
    valueChangeHandler: titleChangedHandler,
    inputBlurHandler: titleBlurHandler,
  } = useValidateInput(validateTitle, title);

  const {
    value: enteredRegion,
    isValid: enteredRegionIsValid,
    hasError: regionInputHasError,
    valueChangeHandler: regionChangedHandler,
    inputBlurHandler: regionBlurHandler,
  } = useValidateInput(validateIsSelected, region);

  const {
    value: enteredStartDate,
    isValid: enteredStartDateIsValid,
    hasError: startDateInputHasError,
    valueChangeHandler: startDateChangedHandler,
    inputBlurHandler: startDateBlurHandler,
  } = useValidateInput(validateIsSelected, startDate);

  const {
    value: enteredEndDate,
    isValid: enteredEndDateIsValid,
    hasError: endDateInputHasError,
    valueChangeHandler: endDateChangedHandler,
    inputBlurHandler: endDateBlurHandler,
  } = useValidateInput(validateIsSelected, endDate);

  const {
    value: enteredContent,
    isValid: enteredContentIsValid,
    hasError: contentInputHasError,
    valueChangeHandler: contentChangedHandler,
    inputBlurHandler: contentBlurHandler,
  } = useValidateInput(validateContent, content);

  const checkedChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    const newValue = checked;
    dispatch(
      setFormValue({ name: name as keyof ICourseForm, value: newValue })
    );
  };
  useEffect(() => {
    if (enteredStartDate && enteredEndDate) {
      const isValid = validateStartEndDate(enteredStartDate, enteredEndDate);
      setDateIsValid(isValid);
      if (isValid) {
        const days = calculateCoursePeriod(enteredStartDate, enteredEndDate);
        if (days) {
          dispatch(
            setFormValue({
              name: "courseDays",
              value: days,
            })
          );
        }
        setCalcCourseDays(days);
      } else {
        setCalcCourseDays("");
      }
    }
  }, [enteredStartDate, enteredEndDate]);

  const setIsFormValidTrueCallback = useCallback(() => {
    dispatch(setIsFormValidTrue());
  }, [dispatch]);

  const setIsFormValidFalseCallback = useCallback(() => {
    dispatch(setIsFormValidFalse());
  }, [dispatch]);

  const isValid = useMemo(() => {
    return (
      enteredTitleIsValid &&
      enteredRegionIsValid &&
      enteredContentIsValid &&
      dateIsValid
    );
  }, [
    enteredTitleIsValid,
    enteredRegionIsValid,
    enteredContentIsValid,
    dateIsValid,
  ]);

  useEffect(() => {
    if (isValid) {
      setIsFormValidTrueCallback();
    } else {
      setIsFormValidFalseCallback();
    }
  }, [isValid, setIsFormValidTrueCallback, setIsFormValidFalseCallback]);

  const minStartDate = enteredEndDate
    ? new Date(new Date(enteredEndDate).getTime() - 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10)
    : undefined;

  const maxEndDate = enteredStartDate
    ? new Date(new Date(enteredStartDate).getTime() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10)
    : undefined;

  const toggleSwitchclassName = isPublished
    ? `${styles["toggle-switch"]} ${styles.publish}`
    : `${styles["toggle-switch"]} ${styles.private}`;
  const textclassName = isPublished
    ? `${styles["toggle-switch-text"]} ${styles.publish}`
    : `${styles["toggle-switch-text"]} ${styles.private}`;

  return (
    <form className={styles.form}>
      <div className={styles["first-input-wrapper"]}>
        <label htmlFor="isPublished" className={styles["publish-label"]}>
          <span className={textclassName}>
            {isPublished ? "공개" : "비공개"}
          </span>
          <div className={toggleSwitchclassName}>
            <input
              id="isPublished"
              type="checkbox"
              name="isPublished"
              checked={isPublished}
              onChange={checkedChangeHandler}
              className={styles.switch}
              required
            />
          </div>
        </label>
        <label className={styles["input-group"]}>
          <span className={styles["input-title"]}>코스 제목</span>
          <input
            type="text"
            name="title"
            value={enteredTitle}
            onChange={titleChangedHandler}
            onBlur={titleBlurHandler}
            placeholder={"4자 이상 25자 이하로 제목을 작성해주세요."}
            required
          />
          {titleInputHasError && (
            <>
              <div className={styles["error-text"]}>
                4자 이상 25자 이하로 작성해 주세요.
                <p className={styles["valid-title-length"]}>
                  ({enteredTitle.length}/25)
                </p>
              </div>
            </>
          )}
        </label>
      </div>

      {errors?.startDate && <p>{errors?.startDate}</p>}
      <div className={styles["second-input-wrapper"]}>
        <div className={styles["col-wrapper"]}>
          <label className={styles["input-group"]}>
            <span className={styles["input-title"]}>시작일자</span>
            <input
              type="date"
              name="startDate"
              data-placeholder="날짜 선택"
              value={enteredStartDate}
              onChange={startDateChangedHandler}
              onBlur={startDateBlurHandler}
              min={minStartDate}
              max={enteredEndDate}
              required
            />
            {startDateInputHasError && (
              <p className={styles["error-text"]}>선택해주세요.</p>
            )}
          </label>
          {enteredStartDateIsValid && enteredEndDateIsValid && !dateIsValid && (
            <p className={styles["error-text"]}>유효하지 않은 날짜 입니다.</p>
          )}

          <label className={styles["input-group"]}>
            <span className={styles["input-title"]}>종료일자</span>
            <input
              type="date"
              name="endDate"
              data-placeholder="날짜 선택"
              value={enteredEndDate}
              onChange={endDateChangedHandler}
              onBlur={endDateBlurHandler}
              min={enteredStartDate}
              max={maxEndDate}
              required
            />
            {endDateInputHasError && (
              <p className={styles["error-text"]}>선택해주세요.</p>
            )}
          </label>
        </div>
        <div className={styles["col-wrapper"]}>
          <label className={`${styles["input-group"]} ${styles.region}`}>
            <span className={styles["input-title"]}>지역</span>
            <select
              required
              name="region"
              placeholder={"지역 선택"}
              value={enteredRegion}
              onChange={regionChangedHandler}
              onBlur={regionBlurHandler}
            >
              <option value="" disabled>
                선택해주세요.
              </option>
              {ResionOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {regionInputHasError && (
              <p className={styles["error-text"]}>선택해주세요.</p>
            )}
          </label>
          <label className={`${styles["input-group"]} ${styles.courseDays}`}>
            <span className={styles["input-title"]}>소요일</span>
            <input
              disabled
              required
              value={calcCourseDays ? calcCourseDays : "자동"}
            ></input>
          </label>
        </div>
      </div>
      <label className={styles["input-group"]}>
        <span className={styles["input-title"]}>코스 설명</span>
        <textarea
          name="content"
          placeholder={"10자 이상 200자 이하로 작성해 주세요."}
          value={enteredContent}
          onChange={contentChangedHandler}
          onBlur={contentBlurHandler}
          className={styles.content}
        />
        {contentInputHasError && (
          <p className={styles["error-text"]}>
            10자 이상 200자 이하로 내용을 작성해 주세요.
          </p>
        )}
        <p className={styles["valid-text-length"]}>
          ({enteredContent.length}/200)
        </p>
      </label>
    </form>
  );
};

export default React.memo(CourseInputForm);
