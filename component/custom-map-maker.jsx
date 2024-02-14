import React, { useEffect, useState } from "react";
import { MapMarker, CustomOverlayMap } from "react-kakao-maps-sdk";
import styled from "styled-components";
import { usePatchExcel } from "@/api/supabase";
import Font from "./font";
import Image from "next/image";
import Modal from "./modal";
import GlobalSpinner from "@/component/global-spinner";

const CustomMapMarker = ({ patchData, userId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [patchDataState, setPatchDataState] = useState({});

  const { mutate, isLoading } = usePatchExcel(patchData.id, userId);

  useEffect(() => {
    setPatchDataState(patchData);
  }, [patchData]);

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
      <Modal
        state={isModalOpen}
        setState={setIsModalOpen}
        setPatchDataState={setPatchDataState}
        patchData={patchData}
      >
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
              // selected={patchData.status === "" ? true : false}
            >
              선택하세요
            </option>

            <option
              value="완료"
              // selected={patchData.status === "완료" ? true : false}
            >
              완료
            </option>

            <option
              value="실패"
              // selected={patchData.status === "실패" ? true : false}
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
            // alert("정보가 수정되었습니다.");
          }}
        >
          수정하기
        </Font>
      </Modal>

      {/* 마커 */}
      <MapMarker
        position={{
          lat: `${patchData.lat}`,
          lng: `${patchData.lng}`,
        }}
        clickable={true}
        onClick={() => setIsOpen(!isOpen)}
      >
        {/* 인포윈도우 */}
        {isOpen && (
          <CustomOverlayMap
            position={{
              lat: `${patchData.lat}`,
              lng: `${patchData.lng}`,
            }}
            clickable={true}
            yAnchor={1.149}
            zIndex={100}
          >
            <InfoWindow>
              <CloseBtn
                alt="close"
                src="/svg/close.svg"
                onClick={() => setIsOpen(false)}
              />

              <InfoWrapper>
                <Font fontSize="2rem">이름 : {patchData.name}</Font>
              </InfoWrapper>

              <InfoWrapper>
                <Font fontSize="2rem">보유주식 수 : {patchData.stocks}</Font>
              </InfoWrapper>

              <InfoWrapper>
                <Font fontSize="2rem">주소 :{patchData.address}</Font>
              </InfoWrapper>

              <InfoWrapper>
                <Font fontSize="2rem">상태 : {patchData.status}</Font>
              </InfoWrapper>

              <InfoWrapper>
                <Font fontSize="2rem">회사명 : {patchData.company}</Font>
              </InfoWrapper>

              <InfoWrapper>
                <Font fontSize="2rem">메모 : {patchData.memo}</Font>
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

                {patchData.history !== null &&
                  patchData.history.map((x) => {
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
                // onClick={() => mutate(patchDataState)}
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
