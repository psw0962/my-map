import React, { useEffect, useState } from "react";
import { MapMarker, CustomOverlayMap } from "react-kakao-maps-sdk";
import styled from "styled-components";
import { usePatchExcel } from "@/api/supabase";
import Font from "./font";
import Image from "next/image";
import Modal from "./modal";
import GlobalSpinner from "@/component/global-spinner";
import Line from "./line";
import Button from "./button";
import { format } from "date-fns";

const CustomMapMarker = ({ excelData, makerData, userId }) => {
  // 인포윈도우
  const [isOpen, setIsOpen] = useState(false);

  // 마커 업데이트 모달
  const [makerDataUpdateIsModalOpen, setMakerDataUpdateIsModalOpen] =
    useState(false);

  // 중복 항목 모달
  const [duplicateMakerIsModalOpen, setduplicateMakerIsModalOpen] =
    useState(false);

  // 중복 항목 데이터
  const [duplicateMakerData, setDuplicateMakerData] = useState({});

  // 중복 항목 데이터 변경 상태
  const [duplicateMakerDataState, setDuplicateMakerDataState] = useState(null);

  // 중복 항목 마커 업데이트 모달
  const [duplicateMakerUpdateIsModalOpen, setDuplicateMakerUpdateIsModalOpen] =
    useState(false);

  // 마커 데이터 변경 상태
  const [patchDataState, setPatchDataState] = useState({});

  // 마커 데이터 업데이트
  const { mutate: makerDataMutate, isLoading: makerDataMutateIsLoading } =
    usePatchExcel(makerData.id, userId);

  // 중복 항목 마커 데이터 업데이트
  const {
    mutate: duplicateMakerDataMutate,
    isLoading: duplicateMakerDataMutateIsLoading,
  } = usePatchExcel(duplicateMakerData?.id || "", userId);

  const removeTags = (str) => {
    return str?.replace(/<\/?[^>]+(>|$)/g, "");
  };

  const findDuplicateLocation = () => {
    const result = [];

    excelData?.forEach((x) => {
      if (x.lat === makerData.lat && x.lng === makerData.lng) {
        result.push(x);
      }
    });

    return result;
  };

  useEffect(() => {
    setPatchDataState(makerData);
  }, [makerData]);

  return (
    <Frame>
      {makerDataMutateIsLoading && (
        <SpinnerFrame>
          <GlobalSpinner
            width={18}
            height={18}
            marginRight={18}
            dotColor="#8536FF"
          />
        </SpinnerFrame>
      )}

      {duplicateMakerDataMutateIsLoading && (
        <SpinnerFrame>
          <GlobalSpinner
            width={18}
            height={18}
            marginRight={18}
            dotColor="#8536FF"
          />
        </SpinnerFrame>
      )}

      {/* 마커 데이터 수정하기 모달 */}
      <Modal
        state={makerDataUpdateIsModalOpen}
        setState={setMakerDataUpdateIsModalOpen}
      >
        <Button
          margin="0 0 1rem 0"
          fontSize="2rem"
          color="#000"
          padding="0.5rem"
          borderRadius="5px"
        >
          {`현재`}
        </Button>

        <InfoWrapper>
          <Font fontSize="2rem" whiteSpace="nowrap">
            이름 :
          </Font>
          <Font fontSize="2rem">{makerData.name}</Font>
        </InfoWrapper>

        <InfoWrapper>
          <Font fontSize="2rem" whiteSpace="nowrap">
            주식수 :
          </Font>
          <Font fontSize="2rem">{makerData.stocks}</Font>
        </InfoWrapper>

        <InfoWrapper>
          <Font fontSize="2rem" whiteSpace="nowrap">
            주소 :
          </Font>
          <Font fontSize="2rem" lineHeight={1.4}>
            {makerData.address}
          </Font>
        </InfoWrapper>

        <InfoWrapper>
          <Font fontSize="2rem" whiteSpace="nowrap">
            상태 :
          </Font>
          <Font fontSize="2rem">{makerData.status}</Font>
        </InfoWrapper>

        <InfoWrapper>
          <Font fontSize="2rem" whiteSpace="nowrap">
            회사 :
          </Font>
          <Font fontSize="2rem">{makerData.company}</Font>
        </InfoWrapper>

        <InfoWrapper>
          <Font fontSize="2rem" whiteSpace="nowrap">
            메모 :
          </Font>
          <Font fontSize="2rem">{makerData.memo}</Font>
        </InfoWrapper>

        <InfoWrapper>
          <Font fontSize="2rem" whiteSpace="nowrap">
            변경이력 :
          </Font>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}
          >
            {makerData?.history !== null &&
              makerData?.history?.map((x) => {
                return (
                  <Font key={x} fontSize="2rem">
                    {x}
                  </Font>
                );
              })}
          </div>
        </InfoWrapper>

        <Line margin="2rem 0 2rem 0" />

        <Button
          margin="0 0 1rem 0"
          fontSize="2rem"
          color="#000"
          padding="0.5rem"
          borderRadius="5px"
        >
          {`수정`}
        </Button>

        <InfoWrapper>
          <Font fontSize="2rem" whiteSpace="nowrap">
            상태 :
          </Font>

          <select
            name="status-select"
            id="status-select"
            value={patchDataState.status}
            onChange={(e) => {
              setPatchDataState((prev) => {
                return {
                  ...prev,
                  status: e.target.value,
                };
              });
            }}
          >
            <option
              value="선택"
              // selected={makerData.status === "" ? true : false}
            >
              선택하세요
            </option>

            <option
              value="완료"
              // selected={makerData.status === "완료" ? true : false}
            >
              완료
            </option>

            <option
              value="실패"
              // selected={makerData.status === "실패" ? true : false}
            >
              실패
            </option>
          </select>
        </InfoWrapper>

        <InfoWrapper>
          <Font fontSize="2rem" whiteSpace="nowrap">
            메모 :
          </Font>

          <textarea
            value={removeTags(patchDataState.memo)}
            onChange={(e) => {
              setPatchDataState((prev) => {
                return {
                  ...prev,
                  memo: e.target.value,
                };
              });
            }}
          />
        </InfoWrapper>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button
            fontSize="2rem"
            margin="4rem 0 0 0"
            backgroundColor="#5599FF"
            border="1px solid #5599FF"
            color="#fff"
            onClick={() => {
              makerDataMutate(patchDataState);
            }}
          >
            수정하기
          </Button>
        </div>
      </Modal>

      {/* 중복 항목 마커 데이터 수정하기 모달 */}
      <Modal
        state={duplicateMakerUpdateIsModalOpen}
        setState={setDuplicateMakerUpdateIsModalOpen}
      >
        <Button
          margin="0 0 1rem 0"
          fontSize="2rem"
          color="#000"
          padding="0.5rem"
          borderRadius="5px"
        >
          {`현재`}
        </Button>

        <InfoWrapper>
          <Font fontSize="2rem" whiteSpace="nowrap">
            이름 :
          </Font>
          <Font fontSize="2rem">{duplicateMakerData.name}</Font>
        </InfoWrapper>

        <InfoWrapper>
          <Font fontSize="2rem" whiteSpace="nowrap">
            주식수 :
          </Font>
          <Font fontSize="2rem">{duplicateMakerData.stocks}</Font>
        </InfoWrapper>

        <InfoWrapper>
          <Font fontSize="2rem" whiteSpace="nowrap">
            주소 :
          </Font>
          <Font fontSize="2rem" lineHeight={1.4}>
            {duplicateMakerData.address}
          </Font>
        </InfoWrapper>

        <InfoWrapper>
          <Font fontSize="2rem" whiteSpace="nowrap">
            상태 :
          </Font>
          <Font fontSize="2rem">{duplicateMakerData.status}</Font>
        </InfoWrapper>

        <InfoWrapper>
          <Font fontSize="2rem" whiteSpace="nowrap">
            회사 :
          </Font>
          <Font fontSize="2rem">{duplicateMakerData.company}</Font>
        </InfoWrapper>

        <InfoWrapper>
          <Font fontSize="2rem" whiteSpace="nowrap">
            메모 :
          </Font>
          <Font fontSize="2rem">{duplicateMakerData.memo}</Font>
        </InfoWrapper>

        <InfoWrapper>
          <Font fontSize="2rem" whiteSpace="nowrap">
            변경이력 :
          </Font>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}
          >
            {duplicateMakerData?.history !== null &&
              duplicateMakerData?.history?.map((x) => {
                return (
                  <Font key={x} fontSize="2rem">
                    {x}
                  </Font>
                );
              })}
          </div>
        </InfoWrapper>

        <Line margin="2rem 0 2rem 0" />

        <Button
          margin="0 0 1rem 0"
          fontSize="2rem"
          color="#000"
          padding="0.5rem"
          borderRadius="5px"
        >
          {`수정`}
        </Button>

        <InfoWrapper>
          <Font fontSize="2rem" whiteSpace="nowrap">
            상태 :
          </Font>

          <select
            name="status-select"
            id="status-select"
            value={duplicateMakerDataState?.status || ""}
            onChange={(e) => {
              setDuplicateMakerDataState((prev) => {
                if (!prev) {
                  return { ...duplicateMakerData, status: e.target.value };
                } else {
                  return {
                    ...prev,
                    status: e.target.value,
                  };
                }
              });
            }}
          >
            <option
              value="선택"
              // selected={makerData.status === "" ? true : false}
            >
              선택하세요
            </option>

            <option
              value="완료"
              // selected={makerData.status === "완료" ? true : false}
            >
              완료
            </option>

            <option
              value="실패"
              // selected={makerData.status === "실패" ? true : false}
            >
              실패
            </option>
          </select>
        </InfoWrapper>

        <InfoWrapper>
          <Font fontSize="2rem" whiteSpace="nowrap">
            메모 :
          </Font>

          <textarea
            value={removeTags(duplicateMakerDataState?.memo || "")}
            onChange={(e) => {
              setDuplicateMakerDataState((prev) => {
                if (!prev) {
                  return { ...duplicateMakerData, memo: e.target.value };
                } else {
                  return {
                    ...prev,
                    memo: e.target.value,
                  };
                }
              });
            }}
          />
        </InfoWrapper>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button
            fontSize="2rem"
            margin="4rem 0 0 0"
            backgroundColor="#5599FF"
            border="1px solid #5599FF"
            color="#fff"
            onClick={async () => {
              await duplicateMakerDataMutate(duplicateMakerDataState);
              setDuplicateMakerData(() => {
                return {
                  ...duplicateMakerDataState,
                  history: [
                    ...duplicateMakerDataState?.history,
                    `${userId} ${format(new Date(), "yyyy/MM/dd/ HH:mm:ss")}`,
                  ],
                };
              });
              setDuplicateMakerDataState(null);
            }}
          >
            수정하기
          </Button>
        </div>
      </Modal>

      {/* 중복 항복 마커 모달 */}
      <Modal
        state={duplicateMakerIsModalOpen}
        setState={setduplicateMakerIsModalOpen}
      >
        {findDuplicateLocation()?.map((x) => {
          return (
            <Button
              key={x.code}
              fontSize="2rem"
              margin="1.5rem 0 0 0"
              onClick={() => {
                // 데이터 바인딩
                setDuplicateMakerData(x);
                // 수정 모달 열기
                setDuplicateMakerUpdateIsModalOpen(
                  !duplicateMakerUpdateIsModalOpen
                );
                // 중복 항목 모달 닫기
                setduplicateMakerIsModalOpen(!duplicateMakerIsModalOpen);
                // 중복 항목 변경 상태 초기화
                setDuplicateMakerDataState(null);
              }}
            >
              {x.name} / {x.address}
            </Button>
          );
        })}
      </Modal>

      {/* 마커 */}
      <MapMarker
        position={{
          lat: `${makerData.lat}`,
          lng: `${makerData.lng}`,
        }}
        clickable={true}
        onClick={() => {
          if (findDuplicateLocation()?.length >= 2) {
            setduplicateMakerIsModalOpen(!duplicateMakerIsModalOpen);
          } else {
            setIsOpen(!isOpen);
          }
        }}
        image={{
          src: `/svg/${makerData.maker}.svg`,
          size: {
            width: 40,
            height: 50,
          },
          options: {
            offset: {
              x: 20,
              y: 69,
            },
          },
        }}
      >
        {/* 인포윈도우 */}
        {isOpen && (
          <CustomOverlayMap
            position={{
              lat: `${makerData.lat}`,
              lng: `${makerData.lng}`,
            }}
            clickable={true}
            yAnchor={1.22}
            zIndex={100}
          >
            <InfoWindow>
              <CloseBtn
                alt="close"
                src="/svg/close.svg"
                onClick={() => setIsOpen(false)}
              />

              <InfoWrapper>
                <Font fontSize="2rem">이름 : {makerData.name}</Font>
              </InfoWrapper>

              <InfoWrapper>
                <Font fontSize="2rem">보유주식 수 : {makerData.stocks}</Font>
              </InfoWrapper>

              <InfoWrapper>
                <Font fontSize="2rem" whiteSpace="pre-wrap" lineHeight={1.4}>
                  주소 :{makerData.address}
                </Font>
              </InfoWrapper>

              <InfoWrapper>
                <Font fontSize="2rem">상태 : {makerData.status}</Font>
              </InfoWrapper>

              <InfoWrapper>
                <Font fontSize="2rem" whiteSpace="pre-wrap">
                  회사명 : {makerData.company}
                </Font>
              </InfoWrapper>

              <InfoWrapper>
                <Font fontSize="2rem" whiteSpace="pre-wrap">
                  메모 : {makerData.memo}
                </Font>
              </InfoWrapper>

              {/* <Image
                width={50}
                height={50}
                src={}
                alt="test"
                priority={true}
                quality={100}
                blurDataURL="data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFklEQVR42mN8//HLfwYiAOOoQvoqBABbWyZJf74GZgAAAABJRU5ErkJggg=="
              /> */}

              <InfoWrapper>
                <Font fontSize="2rem">변경이력 :</Font>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.3rem",
                  }}
                >
                  {makerData.history !== null &&
                    makerData.history.map((x) => {
                      return (
                        <Font key={x} fontSize="2rem">
                          {x}
                        </Font>
                      );
                    })}
                </div>
              </InfoWrapper>

              <Button
                fontSize="2rem"
                margin="4rem 0 0 0"
                backgroundColor="#5599FF"
                border="1px solid #5599FF"
                color="#fff"
                onClick={() => setMakerDataUpdateIsModalOpen(patchDataState)}
              >
                수정하기
              </Button>
            </InfoWindow>
          </CustomOverlayMap>
        )}
      </MapMarker>
    </Frame>
  );
};

export default CustomMapMarker;

const Frame = styled.div``;

const InfoWindow = styled.div`
  width: 100%;
  min-width: 60rem;
  padding: 2rem;
  background-color: #fff;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  border-radius: 20px;
`;

const InfoWrapper = styled.div`
  display: flex;
  margin-top: 0.5rem;
`;

const CloseBtn = styled.img`
  width: 15px;
  height: 15px;
  position: absolute;
  right: 10px;
  top: 10px;
  cursor: pointer;
`;

const SpinnerFrame = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 100;
  background-color: rgba(0, 0, 0, 0.5);
`;
