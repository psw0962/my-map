import React, { useEffect, useState } from "react";
import { Map, MapTypeControl, ZoomControl } from "react-kakao-maps-sdk";
import ReSetttingMapBounds from "@/component/resetting-map-bounds";
import CustomMapMarker from "@/component/custom-map-maker";
import {
  useGetExcel,
  useGetFilterMenu,
  useGetUserInfo,
  useGetCompletedFilterMaker,
} from "@/api/supabase";
import Font from "@/component/font";
import Modal from "@/component/modal";
import GlobalSpinner from "@/component/global-spinner";
import styled from "styled-components";

const Home = () => {
  // 현재 지도 확대 레벨
  const [mapLevel, setMapLevel] = useState(4);

  // 필터 모달
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // 위도, 경도 기반 리바운스
  // const [points, setPoints] = useState([]);

  // 필터 선택
  const [statusFilter, setStatusFilter] = useState([]);
  const [companyFilter, setCompanyFilter] = useState([]);
  const [stocks, setStocks] = useState({
    start: "",
    end: "",
  });

  // 현재 위도 경도
  const [currCenter, setCurrCenter] = useState({ lat: 37.5665, lng: 126.978 });

  const { data: user } = useGetUserInfo();

  const {
    data: excelData,
    refetch: excelDataRefetch,
    isLoading: excelIsLoading,
  } = useGetExcel(
    {
      status: statusFilter,
      company: companyFilter,
      startStocks: stocks.start,
      endStocks: stocks.end,
      lat: currCenter.lat,
      lng: currCenter.lng,
    },
    mapLevel
  );

  const { data: filterMenu } = useGetFilterMenu();

  const {
    data: completedFilterMakerData,
    refetch: completedFilterMakerDataRefetch,
  } = useGetCompletedFilterMaker({
    status: statusFilter,
    company: companyFilter,
    startStocks: stocks.start,
    endStocks: stocks.end,
  });

  // 지도 확대 레벨 트리거 핸들러
  const handleZoomChange = (map) => {
    const currentLevel = map.getLevel();
    setMapLevel(currentLevel);
  };

  // 지도 드래그 트리거 핸들러
  const handleDragEnd = (map) => {
    const latlng = map.getCenter();
    const lat = latlng.getLat();
    const lng = latlng.getLng();
    setCurrCenter({ lat, lng });
  };

  // 지도 드래그, 확대 레벨 트리거
  useEffect(() => {
    console.log("here");
    excelDataRefetch();
  }, [currCenter, mapLevel]);

  // 경도, 위도만 따로 생성(리바운스에 사용)
  // useEffect(() => {
  //   const latLng = [];

  //   excelData?.map((x) => {
  //     latLng.push({ lat: x.lat, lng: x.lng });
  //   });

  //   setPoints(latLng);
  // }, [excelData]);

  return (
    <>
      {excelIsLoading && (
        <SpinnerFrame>
          <GlobalSpinner
            width={18}
            height={18}
            marginRight={18}
            dotColor="#8536FF"
          />
        </SpinnerFrame>
      )}

      <FilterBtn onClick={() => setIsFilterModalOpen(!isFilterModalOpen)}>
        필터
      </FilterBtn>

      <CompletedStocksWrapper>
        <Font fontSize="2rem">- 필터 정보</Font>

        <Font fontSize="2rem">
          마커 개수 : {completedFilterMakerData?.length}
        </Font>

        <Font fontSize="2rem">
          주식 수의 합 : {completedFilterMakerData?.sumCompletedStocks}
        </Font>
      </CompletedStocksWrapper>

      {/* 필터 모달 */}
      <Modal state={isFilterModalOpen} setState={setIsFilterModalOpen}>
        <FilterFrame>
          <Font fontSize="2rem" margin="0 0 1rem 0">
            상태
          </Font>

          <FilterWrapper>
            {filterMenu?.statusMenu?.map((x) => {
              const isExist = statusFilter?.find((y) => y === x) || false;

              return (
                <li key={x}>
                  <FilterLabel>
                    <input
                      type="checkbox"
                      id={`status${x}`}
                      name={`status${x}`}
                      onChange={(e) => {
                        if (isExist) {
                          setStatusFilter(() =>
                            statusFilter.filter((k) => k !== x)
                          );
                        } else {
                          setStatusFilter((prev) => [...prev, x]);
                        }
                      }}
                      checked={isExist}
                    />

                    {x}
                  </FilterLabel>
                </li>
              );
            })}
          </FilterWrapper>

          <Font fontSize="2rem" margin="3rem 0 1rem 0">
            회사
          </Font>

          <FilterWrapper>
            {filterMenu?.companyMenu?.map((x) => {
              const isExist = companyFilter?.find((y) => y === x) || false;

              return (
                <li key={x}>
                  <FilterLabel htmlFor={`company${x}`}>
                    <input
                      type="checkbox"
                      id={`company${x}`}
                      name={`company${x}`}
                      onChange={(e) => {
                        if (isExist) {
                          setCompanyFilter(() =>
                            companyFilter.filter((k) => k !== x)
                          );
                        } else {
                          setCompanyFilter((prev) => [...prev, x]);
                        }
                      }}
                      checked={isExist}
                    />
                    {x}
                  </FilterLabel>
                </li>
              );
            })}
          </FilterWrapper>

          <Font fontSize="2rem" margin="3rem 0 1rem 0">
            주식 수
          </Font>

          <FilterWrapper>
            <input
              type="number"
              onChange={(e) => {
                setStocks((prev) => {
                  return {
                    ...prev,
                    start: e.target.value,
                  };
                });
              }}
            />

            <div>~</div>

            <input
              type="number"
              onChange={(e) => {
                setStocks((prev) => {
                  return {
                    ...prev,
                    end: e.target.value,
                  };
                });
              }}
            />
          </FilterWrapper>

          <Font
            fontSize="2rem"
            onClick={() => {
              excelDataRefetch();
              completedFilterMakerDataRefetch();
              setIsFilterModalOpen(false);
            }}
            margin="6rem 0 0 0"
            cursor="pointer"
          >
            적용하기
          </Font>
        </FilterFrame>
      </Modal>

      {/* 지도 */}
      <Map
        center={{
          lat: 37.552839406975586,
          lng: 126.97228481049244,
        }}
        style={{
          width: "100%",
          height: "100vh",
        }}
        level={mapLevel}
        onZoomChanged={handleZoomChange}
        onDragEnd={handleDragEnd}
      >
        {/* 컨트롤러 생성 */}
        <MapTypeControl position={"TOPRIGHT"} />
        <ZoomControl position={"RIGHT"} />

        {/* 마커 갯수 기반 동적 현재 커서 위치 이동 */}
        {/* {points.length > 0 && <ReSetttingMapBounds points={points} />} */}

        {/* 마커 생성 */}
        {mapLevel > 7 &&
          excelData?.slice(0, 50)?.map((x) => {
            return (
              <CustomMapMarker key={x.id} makerData={x} userId={user?.email} />
            );
          })}

        {mapLevel < 7 &&
          excelData?.map((x) => {
            return (
              <CustomMapMarker key={x.id} makerData={x} userId={user?.email} />
            );
          })}
      </Map>
    </>
  );
};

export default Home;

const FilterFrame = styled.div`
  width: 30rem;
  height: 20rem;
`;

const FilterWrapper = styled.ul`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const FilterLabel = styled.label`
  display: flex;
  align-items: center;
`;

const FilterBtn = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  font-size: 1.4rem;
  font-weight: 700;

  position: fixed;
  left: 20px;
  top: 20px;
  padding: 2rem;
  border: 1px #000 solid;
  border-radius: 10px;
  background-color: #fff;
  z-index: 100;
  cursor: pointer;
`;

const SpinnerFrame = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9998;
  background-color: rgba(0, 0, 0, 0.5);
`;

const CompletedStocksWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  position: fixed;
  left: 120px;
  top: 20px;
  padding: 1rem;
  border: 1px #000 solid;
  border-radius: 10px;
  background-color: #fff;
  z-index: 100;
  cursor: pointer;
`;
