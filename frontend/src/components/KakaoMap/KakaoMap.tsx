import ReactDOMServer from "react-dom/server";
import { PositionsProps } from "@/src/interfaces/Course";
import React, { useEffect } from "react";
import CustomOverlayContent from "./CustomOverlayContent";

declare global {
  interface Window {
    kakao: any;
  }
}
export default React.memo(function KakaoMap({ mapData }: PositionsProps) {
  useEffect(() => {
    const { kakao } = window;

    const mapContainer = document.getElementById("map");

    if (!mapContainer) return;
    mapContainer.innerHTML = "";

    const center = () => {
      const lastPosition = mapData[mapData.length - 1];
      return new kakao.maps.LatLng(lastPosition?.mapY, lastPosition?.mapX);
    };
    const mapOption = {
      center: center(), // 지도의 중심좌표
      level: 7, // 지도의 확대 레벨
    };

    var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다
    map.relayout();

    mapData.forEach((position) => {
      var imageSrc =
          "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png", // 마커이미지의 주소입니다
        imageSize = new kakao.maps.Size(28, 35), // 마커이미지의 크기입니다
        imageOption = { offset: new kakao.maps.Point(10, 30) }; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.

      // 마커의 이미지정보를 가지고 있는 마커이미지를 생성합니다
      var markerImage = new kakao.maps.MarkerImage(
          imageSrc,
          imageSize,
          imageOption
        ),
        markerPosition = new kakao.maps.LatLng(position.mapY, position.mapX); // 마커가 표시될 위치입니다

      // 마커를 생성합니다
      var marker = new kakao.maps.Marker({
        position: markerPosition,
        image: markerImage, // 마커이미지 설정
      });

      const content = ReactDOMServer.renderToString(
        <CustomOverlayContent title={position.name} id={position.placeId} />
      );

      const customOverlay = new kakao.maps.CustomOverlay({
        content: content,
        map: map,
        position: new kakao.maps.LatLng(position.mapY, position.mapX),
        yAnchor: 1,
      });

      marker.setMap(map);
      customOverlay.setMap(map);
    });

    // 지도 확대 축소를 제어할 수 있는  줌 컨트롤을 생성합니다
    var zoomControl = new kakao.maps.ZoomControl();
    map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

    // 선을 구성하는 좌표 배열입니다. 이 좌표들을 이어서 선을 표시합니다
    var PolylinePath = mapData.map(
      (position) => new kakao.maps.LatLng(position.mapY, position.mapX)
    );

    // 지도에 표시할 선을 생성합니다
    var linePath = new kakao.maps.Polyline({
      path: PolylinePath, // 선을 구성하는 좌표배열 입니다
      strokeWeight: 4, // 선의 두께 입니다
      strokeColor: "red", // 선의 색깔입니다
      strokeOpacity: 0.6, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
      strokeStyle: "solid", // 선의 스타일입니다
    });

    // 지도에 선을 표시합니다
    linePath.setMap(map);
  }, [mapData]);

  return (
    <>
      <div id="map" style={{ flex: "1" }} />
      <p id="result" />
    </>
  );
});
