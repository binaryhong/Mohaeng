import { useAppDispatch, useAppSelector } from "@/src/hooks/useReduxHooks";
import { selectArea } from "@/src/store/reducers/FilterSlice";
import styles from "./AreaSelector.module.css";

const areas = [
  { region: "서울", areaCode: "1" },
  { region: "인천", areaCode: "2" },
  { region: "대전", areaCode: "3" },
  { region: "대구", areaCode: "4" },
  { region: "광주", areaCode: "5" },
  { region: "부산", areaCode: "6" },
  { region: "울산", areaCode: "7" },
  { region: "세종", areaCode: "8" },
  { region: "경기", areaCode: "31" },
  { region: "강원", areaCode: "32" },
  { region: "충북", areaCode: "33" },
  { region: "충남", areaCode: "34" },
  { region: "경북", areaCode: "35" },
  { region: "경남", areaCode: "36" },
  { region: "전북", areaCode: "37" },
  { region: "전남", areaCode: "38" },
  { region: "제주", areaCode: "39" },
  { region: "전체보기", areaCode: "all" },
];

interface IArea {
  region: string;
  areaCode: string;
}

const AreaSelector = () => {
  const { area } = useAppSelector((state) => state.filter);
  const dispatch = useAppDispatch();

  const areaClickHandler = (area: IArea) => {
    dispatch(selectArea(area));
  };

  const regionChangedHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedRegion = e.target.value;
    const selectedArea = areas.find((item) => item.region === selectedRegion);
    if (selectedArea) {
      dispatch(selectArea(selectedArea));
    }
  };

  return (
    <div className={styles.container}>
      <h3>지역</h3>
      <div
        className={`${styles["selector-wrapper"]} ${styles["desktop-only"]}`}
      >
        {areas.map((item) => (
          <button
            key={item.areaCode}
            onClick={() => areaClickHandler(item)}
            className={`${styles.button} ${
              area.areaCode === item.areaCode ? styles.active : ""
            }`}
          >
            {item.region}
          </button>
        ))}
      </div>
      <div className={` ${styles.region} ${styles["mobile-only"]}`}>
        <select
          name="region"
          value={area.region}
          onChange={regionChangedHandler}
          className={styles.select}
        >
          <option value="" disabled>
            지역 선택
          </option>
          {areas.map((item) => (
            <option key={item.areaCode} value={item.region}>
              {item.region}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default AreaSelector;
