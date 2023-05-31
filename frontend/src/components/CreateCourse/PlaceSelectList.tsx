import styles from "./PlaceSelectList.module.css";
import Image from "next/image";
import FiveStarRating from "../FiveStarRating/FiveStarRating";
import React from "react";
import { useAppDispatch, useAppSelector } from "@/src/hooks/useReduxHooks";
import { addPlaceObject } from "@/src/store/reducers/CourseFormSlice";
import { Loader } from "./Loader";
import { IPlacesSearch } from "@/src/interfaces/Course.type";

interface ISelectListProps {
  places: IPlacesSearch[];
  isLoading: boolean;
  loadMoreCallback: (el: HTMLDivElement) => void;
  isLastPage: boolean;
}

const PlaceSelectList = ({
  places,
  isLoading,
  loadMoreCallback,
  isLastPage,
}: ISelectListProps) => {
  const dispatch = useAppDispatch();
  const AddedPlaces = useAppSelector((state) => state.courseForm.course.places);
  const itemClickHandler = (place: any) => {
    if (!(AddedPlaces.length >= 20)) {
      dispatch(addPlaceObject(place));
    } else {
      window.alert("더 이상 추가하실 수 없습니다.");
    }
  };

  return (
    <div className={styles["search-list"]}>
      {places?.map((place: any) => {
        return (
          <div
            key={place.placeId}
            className={styles["search-item"]}
            onClick={() => itemClickHandler(place)}
          >
            {place?.imgUrl && (
              <Image
                src={place.imgUrl}
                width={100}
                height={90}
                alt={place.name}
                className={styles["place-image"]}
              />
            )}
            <div className={styles.notice_body}>
              <p>{place.name}</p>
              <FiveStarRating rating={place.rating} />
            </div>
          </div>
        );
      })}
      <Loader
        isLoading={isLoading}
        isLastPage={isLastPage}
        loadMoreCallback={loadMoreCallback}
      />
    </div>
  );
};

export default React.memo(PlaceSelectList);
