import React, { useEffect, useState } from "react";
import { MapMarker, CustomOverlayMap } from "react-kakao-maps-sdk";
import styled from "styled-components";
import { usePatchExcel } from "@/api/supabase";
import Font from "./font";
import Image from "next/image";
import Modal from "./modal";
import GlobalSpinner from "@/component/global-spinner";

const CustomMapMarker = ({ makerData, userId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [patchDataState, setPatchDataState] = useState({});

  const { mutate, isLoading } = usePatchExcel(makerData.id, userId);

  useEffect(() => {
    setPatchDataState(makerData);
  }, [makerData]);

  const removeTags = (str) => {
    return str?.replace(/<\/?[^>]+(>|$)/g, "");
  };

  return (
    <Frame>
      {isLoading && (
        <SpinnerFrame>
          <GlobalSpinner
            width={18}
            height={18}
            marginRight={18}
            dotColor="#8536FF"
          />
        </SpinnerFrame>
      )}

      <Modal state={isModalOpen} setState={setIsModalOpen}>
        <InfoWrapper>
          <Font fontSize="2rem">상태 :</Font>

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
          <Font fontSize="2rem">메모 :</Font>

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

        <Font
          fontSize="2rem"
          margin="4rem 0 0 0"
          cursor="pointer"
          onClick={() => {
            mutate(patchDataState);
          }}
        >
          수정하기
        </Font>
      </Modal>

      {/* 마커 */}
      <MapMarker
        position={{
          lat: `${makerData.lat}`,
          lng: `${makerData.lng}`,
        }}
        clickable={true}
        onClick={() => setIsOpen(!isOpen)}
        image={{
          src: `/svg/${makerData.maker}.svg`,
          size: {
            width: 40,
            height: 50,
          },
          options: {
            offset: {
              x: 27,
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
            yAnchor={1.25}
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
                <Font fontSize="2rem">주소 :{makerData.address}</Font>
              </InfoWrapper>

              <InfoWrapper>
                <Font fontSize="2rem">상태 : {makerData.status}</Font>
              </InfoWrapper>

              <InfoWrapper>
                <Font fontSize="2rem">회사명 : {makerData.company}</Font>
              </InfoWrapper>

              <InfoWrapper>
                <Font fontSize="2rem">메모 : {makerData.memo}</Font>
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

                {makerData.history !== null &&
                  makerData.history.map((x) => {
                    return (
                      <Font key={x} fontSize="2rem">
                        {x}
                      </Font>
                    );
                  })}
              </InfoWrapper>

              <Font
                fontSize="2rem"
                margin="4rem 0 0 0"
                cursor="pointer"
                onClick={() => setIsModalOpen(patchDataState)}
              >
                수정하기
              </Font>
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
  z-index: 9998;
  background-color: rgba(0, 0, 0, 0.5);
`;
