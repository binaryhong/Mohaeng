import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { IPlacesSearch } from "../interfaces/Course.type";
import CourseApiConfig from "../services/ApiConfig";

// useInfiniteScroll.ts
export interface UseInfiniteScroll {
  isLoading: boolean;
  loadMoreCallback: (el: HTMLDivElement) => void;
  isInfiniteScrolling: boolean;
  dynamicPlaces: IPlacesSearch[];
  isLastPage: boolean;
}

export const useInfiniteScroll = (
  places: IPlacesSearch[],
  hasNext: boolean,
  keyword: string | null
): UseInfiniteScroll => {
  const [dynamicPlaces, setDynamicPlaces] = useState<IPlacesSearch[]>(places);
  const [isInfiniteScrolling, setIsInfiniteScrolling] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLastPage, setIsLastPage] = useState(false);

  const [lastItemId, setLastItemId] = useState<number | undefined>(undefined);
  const [lastItemRating, setLastItemRating] = useState<string | undefined>(
    undefined
  );

  const observerRef = useRef<IntersectionObserver>();
  const loadMoreTimeout: NodeJS.Timeout = setTimeout(() => null, 500);
  const loadMoreTimeoutRef = useRef<NodeJS.Timeout>(loadMoreTimeout);

  useEffect(() => {
    const lastIndex = places.length - 1;
    // post가 변경되면 dynamicPosts에 저장하고 마지막 item의 id와 rating을 저장함.
    setDynamicPlaces(places);
    setLastItemId(places[lastIndex]?.placeId);
    setLastItemRating(places[lastIndex]?.rating);
    setIsLastPage(!hasNext);
  }, [places]);

  /** Intersection Observer의 콜백 함수 */
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      // 감지된 요소와 관련된 정보를 포함하고 있는 첫 번째 요소 사용.
      const target = entries[0];

      // 관찰 대상 요소가 뷰포트에 진입했는지를 나타내는 불리언 값
      if (target.isIntersecting) {
        setIsLoading(true);
        if (loadMoreTimeoutRef.current) {
          // 이전에 설정된 타임아웃을 제거 함으로써 이전의 타임아웃 이벤트가 실행되지 않도록 한다.
          clearTimeout(loadMoreTimeoutRef.current);
        }

        //새로운 타임아웃이 설정되기 전에 이전 타임아웃이 제거되어 중복 실행되는 이슈를 방지하고, Intersection Observer 이벤트를 디바운스하여 일정 시간 동안 여러 이벤트 중 마지막 이벤트만을 처리할 수 있도록 함.
        // intersection 이벤트를 디바운스한다. 500ms의 지연 시간 후에 함수 내의 코드 블록이 실행된다.
        loadMoreTimeoutRef.current = setTimeout(() => {
          axios
            .get(
              `${CourseApiConfig.course}/placeSearch?keyword=${keyword}&lastId=${lastItemId}&lastRating=${lastItemRating}`
            )
            .then((resp) => {
              const { hasNext, places } = resp.data.data;
              if (places?.length > 0) {
                const newDynamicPosts = [...dynamicPlaces, ...places];
                setDynamicPlaces(newDynamicPosts);
                setIsInfiniteScrolling(true);
                setIsLastPage(!hasNext);

                if (hasNext) {
                  const lastIndex = places.length - 1;
                  setLastItemId(places[lastIndex].placeId);
                  setLastItemRating(places[lastIndex].rating);
                }
              }
            })
            .finally(() => {
              setIsLoading(false);
              const parentElement = target.target.parentNode;
              if (
                parentElement instanceof HTMLElement &&
                !isInfiniteScrolling
              ) {
                // 부모 요소의 스크롤을 맨 위로 이동시킨다.
                parentElement.scrollTop = 0;
              }
            });
        }, 500);
      }
    },
    [dynamicPlaces]
  );

  const loadMoreCallback = useCallback(
    (el: HTMLDivElement) => {
      if (isLoading) return;
      if (observerRef.current) observerRef.current.disconnect();

      const option: IntersectionObserverInit = {
        root: null,
        rootMargin: "0px",
        threshold: 1.0,
      };

      observerRef.current = new IntersectionObserver(handleObserver, option);

      if (el) observerRef.current.observe(el);
    },
    [handleObserver, isLoading]
  );

  return {
    isLoading,
    loadMoreCallback,
    isInfiniteScrolling,
    dynamicPlaces,
    isLastPage,
  };
};
