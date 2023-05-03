import styles from "./PlaceSelectList.module.css";
import Image from "next/image";
import FiveStarRating from "../FiveStarRating/FiveStarRating";
import React, { useEffect, useRef, useState } from "react";
import { useAppDispatch } from "@/src/hooks/useReduxHooks";
import { addPlaceObject } from "@/src/store/reducers/courseFormSlice";

const PlaceSelectList = ({ places, isLoading, debouncedSearch }: any) => {
  const [items, setItems] = useState([...places]);
  const [loading, setLoading] = useState(false);
  const [hasNext, setHasNext] = useState(true);
  const [page, setPage] = useState(0);

  const dispatch = useAppDispatch();

  const listRef = useRef<HTMLDivElement>(null)!;

  useEffect(() => {
    setItems([...places]);
  }, [places]);

  useEffect(() => {
    function handleScroll() {
      if (listRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = listRef.current;
        if (scrollTop + clientHeight >= scrollHeight && hasNext && !loading) {
          console.log("조건에 맞ㅇ음");
          setLoading(true);
          setPage((prevPage) => prevPage + 1);
        } else {
          console.log(Math.round(scrollHeight) - scrollTop === clientHeight);
          console.log(hasNext);
          console.log(!loading);
          console.log("조건에 안맞음");
        }
      }
    }

    if (listRef.current) {
      listRef.current.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (listRef.current) {
        listRef.current.removeEventListener("scroll", handleScroll);
      }
    };
  }, [hasNext, loading]);

  useEffect(() => {
    if (page === 0) return;
    console.log(`페이지 ${page}`);
    const lastItemIndex = items ? items.length - 1 : -1;
    const lastid = items[lastItemIndex]?.placeId;
    const lastRating = items[lastItemIndex]?.rating;
    console.log(`마지막 itme index${lastItemIndex}`);
    console.log(`item의 placeId${lastid}`);
    console.log(`item의 lastRating${lastRating}`);
    async function fetchItems() {
      try {
        console.log("실행");
        const placeSearchRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/course/placeSearch?keyword=${debouncedSearch}&lastId=${lastid}&lastRating=${lastRating}`
        );
        if (!placeSearchRes.ok) return;
        const placeSearchResult = await placeSearchRes.json();
        console.log(placeSearchResult);
        setItems((prevItems) => [
          ...prevItems,
          ...placeSearchResult?.data.places,
        ]);
        //  placeSearchResult?.data 가 undefined 일 때 기본값 false 를 할당
        setHasNext(placeSearchResult?.data?.hasNext || false);
        setLoading(false);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchItems();
  }, [page]);

  const itemClickHandler = (place: any) => {
    dispatch(addPlaceObject(place));
  };

  return (
    <div className={styles["search-list"]} ref={listRef}>
      {isLoading && <p>Loading...</p>}
      {items.map((place: any) => {
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
      {!hasNext && <p>더 이상 검색 결과가 존재하지 않습니다.</p>}
    </div>
  );
};

export default PlaceSelectList;
