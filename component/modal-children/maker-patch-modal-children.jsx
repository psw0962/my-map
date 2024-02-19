import styled from "styled-components";
import Line from "../line";
import Button from "../button";
import Font from "../font";

const MakerPatchModalChildren = ({
  makerData, // 현재 마커 데이터
  patchDataState, // 수정할 마커 데이터 state
  setPatchDataState, // 수정할 마커 데이터 setState
  makerDataMutate, // 마커 수정 API
}) => {
  const removeTags = (str) => {
    return str?.replace(/<\/?[^>]+(>|$)/g, "");
  };

  return (
    <>
      <Button
        margin="0 0 1rem 0"
        fontSize="2.5rem"
        color="#000"
        padding="0.5rem"
        borderRadius="5px"
      >
        {`현재`}
      </Button>

      <InfoWrapper>
        <Font fontSize="2.5rem" whiteSpace="nowrap">
          이름 :
        </Font>
        <Font fontSize="2.5rem">{makerData.name}</Font>
      </InfoWrapper>

      <InfoWrapper>
        <Font fontSize="2.5rem" whiteSpace="nowrap">
          주식수 :
        </Font>
        <Font fontSize="2.5rem">{makerData.stocks}</Font>
      </InfoWrapper>

      <InfoWrapper>
        <Font fontSize="2.5rem" whiteSpace="nowrap">
          주소 :
        </Font>
        <Font fontSize="2.5rem" lineHeight={1.4}>
          {makerData.address}
        </Font>
      </InfoWrapper>

      <InfoWrapper>
        <Font fontSize="2.5rem" whiteSpace="nowrap">
          상태 :
        </Font>
        <Font fontSize="2.5rem">{makerData.status}</Font>
      </InfoWrapper>

      <InfoWrapper>
        <Font fontSize="2.5rem" whiteSpace="nowrap">
          회사 :
        </Font>
        <Font fontSize="2.5rem">{makerData.company}</Font>
      </InfoWrapper>

      <InfoWrapper>
        <Font fontSize="2.5rem" whiteSpace="nowrap">
          메모 :
        </Font>
        <Font fontSize="2.5rem">{makerData.memo}</Font>
      </InfoWrapper>

      <InfoWrapper>
        <Font fontSize="2.5rem" whiteSpace="nowrap">
          변경이력 :
        </Font>

        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}
        >
          {makerData?.history !== null &&
            makerData?.history?.map((x) => {
              return (
                <Font key={x} fontSize="2.5rem">
                  {x}
                </Font>
              );
            })}
        </div>
      </InfoWrapper>

      <Line margin="2rem 0 2rem 0" />

      <Button
        margin="0 0 1rem 0"
        fontSize="2.5rem"
        color="#000"
        padding="0.5rem"
        borderRadius="5px"
      >
        {`수정`}
      </Button>

      <InfoWrapper>
        <Font fontSize="2.5rem" whiteSpace="nowrap">
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
          <option value="선택">선택하세요</option>
          <option value="완료">완료</option>
          <option value="실패">실패</option>
        </select>
      </InfoWrapper>

      <InfoWrapper>
        <Font fontSize="2.5rem" whiteSpace="nowrap">
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
          fontSize="2.5rem"
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
    </>
  );
};

export default MakerPatchModalChildren;

const InfoWrapper = styled.div`
  display: flex;
  margin-top: 0.5rem;
`;
