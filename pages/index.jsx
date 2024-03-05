import React, { useEffect, useState } from "react";
import { Map, MapTypeControl, ZoomControl } from "react-kakao-maps-sdk";
import SearchAddressBounds from "@/component/search-address-bounds";
import CustomMapMarker from "@/component/custom-map-maker";
import { useGetExcel, useGetCompletedFilterMaker } from "@/api/supabase";
import { useGetUserData, usePostSignOut } from "@/api/auth";
import Font from "@/component/font";
import Button from "@/component/button";
import Modal from "@/component/modal";
import GlobalSpinner from "@/component/global-spinner";
import styled from "styled-components";
import FilterModalChildren from "@/component/modal-children/filter-modal-children";
import { toastStateAtom } from "atoms";
import { useRecoilState } from "recoil";
import { useRouter } from "next/router";
import supabase from "@/config/supabaseClient";
import withAuth from "@/hoc/withAuth";

const Home = () => {
  const router = useRouter();
  const [toastState, setToastState] = useRecoilState(toastStateAtom);

  // 현재 지도 확대 레벨.
  const [mapLevel, setMapLevel] = useState(4);

  // 필터 모달
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // 주소 검색
  const [searchAddress, setSearchAddress] = useState({
    keyWord: "",
    lat: "",
    lng: "",
  });

  // 필터 선택
  const [statusFilter, setStatusFilter] = useState([]);
  const [companyFilter, setCompanyFilter] = useState([]);
  const [stocks, setStocks] = useState({
    start: "",
    end: "",
  });

  // 현재 위도 경도
  const [currCenter, setCurrCenter] = useState({ lat: 37.5665, lng: 126.978 });

  // 유저 정보
  const { data: user } = useGetUserData(setToastState, router);

  // 로그아웃
  const { mutate } = usePostSignOut(setToastState);

  // 로그아웃 처리
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_OUT") {
          router.reload();
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // 엑셀 데이터
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

  // 현재 필터 상황
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
    excelDataRefetch();
  }, [currCenter, mapLevel]);

  return (
    <>
      {/* 스피너 */}
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

      {/* 필터 모달 */}
      <Modal state={isFilterModalOpen} setState={setIsFilterModalOpen}>
        <FilterModalChildren
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          companyFilter={companyFilter}
          setCompanyFilter={setCompanyFilter}
          setStocks={setStocks}
          excelDataRefetch={excelDataRefetch}
          completedFilterMakerDataRefetch={completedFilterMakerDataRefetch}
          setIsFilterModalOpen={setIsFilterModalOpen}
        />
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

        {/* 로그아웃 */}
        <SignOutBtn onClick={() => mutate()}>로그아웃</SignOutBtn>

        {/* 필터 버튼 */}
        <FilterBtn onClick={() => setIsFilterModalOpen(!isFilterModalOpen)}>
          필터
        </FilterBtn>

        {/* 필터 현황 */}
        <CompletedStocksWrapper>
          <Button fontSize="1.5rem" padding="0.5rem" borderRadius="5px">
            필터 현황
          </Button>

          <Font fontSize="1.5rem">
            마커 개수 : {completedFilterMakerData?.length}
          </Font>

          <Font fontSize="1.5rem">
            주식 수의 합 : {completedFilterMakerData?.sumCompletedStocks}
          </Font>
        </CompletedStocksWrapper>

        {/* 주소 검색 */}
        <SearchAddressBounds
          searchAddress={searchAddress}
          setSearchAddress={setSearchAddress}
        />

        {/* 마커 생성 */}
        {mapLevel >= 7 &&
          excelData?.slice(0, 50)?.map((x) => {
            return (
              <CustomMapMarker
                key={x.id}
                excelData={excelData}
                makerData={x}
                userId={user && user.user?.email}
              />
            );
          })}
        {mapLevel < 7 &&
          excelData?.map((x) => {
            return (
              <CustomMapMarker
                key={x.id}
                excelData={excelData}
                makerData={x}
                userId={user && user.user?.email}
              />
            );
          })}
      </Map>
    </>
  );
};

export default withAuth(Home);

const SpinnerFrame = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 100;
  background-color: rgba(0, 0, 0, 0.5);
`;

const FilterBtn = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  font-size: 1.5rem;
  font-weight: 700;

  position: fixed;
  left: 2rem;
  top: 2rem;

  height: 5rem;
  padding: 2rem;
  border: 1px #000 solid;
  border-radius: 10px;
  background-color: #fff;
  z-index: 5;
  cursor: pointer;
`;

const CompletedStocksWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  position: fixed;
  left: 2rem;
  top: 7.5rem;

  padding: 1rem;
  border: 1px #000 solid;
  border-radius: 10px;
  background-color: #fff;
  z-index: 5;
  cursor: pointer;
`;

const SignOutBtn = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  font-size: 1.5rem;
  font-weight: 700;

  position: fixed;
  right: 13rem;
  top: 0.5rem;

  height: 5rem;
  padding: 2rem;
  border: 1px #000 solid;
  border-radius: 10px;
  background-color: #fff;
  z-index: 5;
  cursor: pointer;
`;
