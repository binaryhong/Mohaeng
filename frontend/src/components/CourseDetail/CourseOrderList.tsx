import Image from "next/image";
import styles from "./CourseOrderList.module.css";
import { AiOutlineMinus } from "react-icons/ai";
import { useAppDispatch, useAppSelector } from "@/src/hooks/useReduxHooks";
import {
  initialState,
  removePlace,
  updatePlaces,
} from "@/src/store/reducers/CourseFormSlice";
import TagItem from "../UI/TagItem";

import { IPlace } from "@/src/interfaces/Course.type";
import React, { DragEvent, TouchEvent, useRef, useState } from "react";
const CourseOrderList = ({ places, mode }: any) => {
  const dispatch = useAppDispatch();

  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const draggingItem = useRef<number | undefined>();
  const dragOverItem = useRef<number | undefined>();

  const handleRemovePlace = (placeId: number) => {
    if (!(mode === "write")) return;
    dispatch(removePlace(placeId));
  };

  const handleDragStart = (e: DragEvent<HTMLLIElement>, position: number) => {
    if (!(mode === "write")) return;
    draggingItem.current = position;
    const targetElement = e.target as HTMLLIElement;
    console.log(targetElement.innerHTML);
  };

  const handleDragEnter = (e: DragEvent<HTMLLIElement>, position: number) => {
    if (!(mode === "write")) return;
    setDragOverIndex(position);
    dragOverItem.current = position;
    const listCopy = [...places];
    if (
      draggingItem.current !== undefined &&
      dragOverItem.current !== undefined
    ) {
      console.log(draggingItem.current, dragOverItem.current);
      const draggingItemContent = listCopy[draggingItem.current];
      listCopy.splice(draggingItem.current, 1);
      listCopy.splice(dragOverItem.current, 0, draggingItemContent);
    }

    draggingItem.current = dragOverItem.current;
    dragOverItem.current = undefined;

    dispatch(updatePlaces(listCopy));
  };

  return (
    <div className={styles["course-orderlist-container"]}>
      <ol className={styles["course-list"]}>
        {places?.map((place: IPlace, idx: number) => (
          <li
            className={`${styles["course-item"]} ${
              dragOverIndex === idx ? styles["drag-over"] : ""
            } 
          `}
            key={place.placeId}
            onDragStart={(e) => handleDragStart(e, idx)}
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={(e) => handleDragEnter(e, idx)}
            draggable={mode === "write"}
          >
            <p className={styles["order-number"]}>{idx + 1}</p>
            {place.imgUrl ? (
              <Image
                className={styles.img}
                src={place.imgUrl}
                alt={place.name}
                width={130}
                height={110}
                priority
              />
            ) : (
              <p>이미지 준비 중</p>
            )}
            <div className={styles["item-content"]}>
              <p className={styles.name}>{place.name}</p>
              <TagItem color="black" size="SS" text="주소" bgColor="Mgrey" />
              <span className={styles.address}>{place.address}</span>
            </div>
            {mode === "write" && (
              <div className={styles["remove-btn-wrapper"]}>
                <div
                  className={styles["remove-btn"]}
                  onClick={() => handleRemovePlace(place.placeId)}
                >
                  <AiOutlineMinus />
                </div>
              </div>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
};

export default React.memo(CourseOrderList);
