import { useAppDispatch } from "@/src/hooks/useReduxHooks";
import { selectArea } from "@/src/store/reducers/FilterSlice";
import { useState } from "react";
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
  const [selectedArea, setSelectedArea] = useState("all");

  const dispatch = useAppDispatch();

  const areaClickHandler = (area: IArea) => {
    setSelectedArea(area.areaCode);
    dispatch(selectArea(area));
  };

  return (
    <div className={styles.container}>
      <h3>지역</h3>
      <div className={styles["selector-wrapper"]}>
        {areas.map((area) => (
          <button
            key={area.areaCode}
            onClick={() => areaClickHandler(area)}
            className={`${styles.button} ${
              selectedArea === area.areaCode ? styles.active : ""
            }`}
          >
            {area.region}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AreaSelector;