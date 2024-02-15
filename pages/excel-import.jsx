import { useState } from "react";
import * as XLSX from "xlsx";
import supabase from "@/config/supabaseClient";
import Font from "@/component/font";
import styled from "styled-components";

const ExcelImport = () => {
  const [failData, setFailData] = useState([]);
  const [failCount, setFailCount] = useState(0);
  const [excelFile, setExcelFile] = useState(null);
  const [typeError, setTypeError] = useState(null);

  // submit state
  // const [excelData, setExcelData] = useState(null);

  //   const login = async () => {
  //     await supabase.auth.signInWithPassword({
  //       email: "",
  //       password: "",
  //     });
  //   };

  //   useEffect(() => {
  //     login();
  //   }, []);

  // onchange event
  const handleFile = (e) => {
    let fileTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv",
    ];

    let selectedFile = e.target.files[0];

    if (selectedFile) {
      if (selectedFile && fileTypes.includes(selectedFile.type)) {
        setTypeError(null);
        let reader = new FileReader();
        reader.readAsArrayBuffer(selectedFile);
        reader.onload = (e) => {
          setExcelFile(e.target.result);
        };
      } else {
        setTypeError("Please select only excel file types");
        setExcelFile(null);
      }
    } else {
      console.log("Please select your file");
    }
  };

  // submit event
  const handleFileSubmit = async (e) => {
    e.preventDefault();

    if (excelFile !== null) {
      const workbook = XLSX.read(excelFile, { type: "buffer" });
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);
      // setExcelData(data.slice(0, 10));

      window.kakao.maps.load();
      const geocoder = new window.kakao.maps.services.Geocoder();
      const result = [];

      const geocodeBatch = async (batchAddresses) => {
        const geocodingPromises = batchAddresses.map((x) => {
          return new Promise((resolve) => {
            geocoder.addressSearch(x.address, function (k, status) {
              if (status === "ZERO_RESULT") {
                setFailData((prev) => [...prev, x.address]);
                setFailCount((prev) => prev + 1);
              }

              if (status === window.kakao.maps.services.Status.OK) {
                result.push({
                  ...x,
                  lat: k[0].y.toString(),
                  lng: k[0].x.toString(),
                });
              }
              resolve();
            });
          });
        });

        // 모든 주소 검색 작업이 완료될 때까지 기다립니다.
        await Promise.all(geocodingPromises);
      };

      const delay = (ms) => {
        return new Promise((resolve) => setTimeout(resolve, ms));
      };

      const geocodeAddresses = async (addresses) => {
        const batchSize = 200; // 한 번에 보낼 주소의 갯수
        const totalBatches = Math.ceil(addresses.length / batchSize); // 총 배치 수

        for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
          const startIndex = batchIndex * batchSize;
          const endIndex = Math.min(
            (batchIndex + 1) * batchSize,
            addresses.length
          );

          const batchAddresses = addresses.slice(startIndex, endIndex);

          await geocodeBatch(batchAddresses);

          if (batchIndex < totalBatches - 1) {
            await delay(10000);
          }
        }

        // 검색이 완료된 결과 반환
        return result;
      };

      // 주소 데이터가 있다고 가정하고 함수 호출
      const geocodedResult = await geocodeAddresses(data);

      if (failCount > 0) {
        alert(
          "주소 변환에 실패한 주소가 있습니다. 수정 후 다시 업로드 해주세요."
        );
        return;
      } else {
        await supabase.from("excel").insert(geocodedResult).select();
      }

      // await supabase.from("excel").insert(geocodedResult).select();
    }
  };

  return (
    <Frame>
      <form onSubmit={handleFileSubmit}>
        <input type="file" required onChange={handleFile} />

        <button type="submit">UPLOAD</button>

        {typeError && <div role="alert">{typeError}</div>}
      </form>

      <FailFrame>
        {failCount > 0 && (
          <FailWrapper>
            <Font fontSize="2rem">주소 변환 실패 갯수</Font>
            <Font fontSize="2rem">{failCount}</Font>
          </FailWrapper>
        )}
      </FailFrame>

      <FailFrame>
        {failData?.map((x, index) => {
          return (
            <FailWrapper key={index}>
              <Font fontSize="2rem">실패</Font>
              <Font fontSize="2rem">{x}</Font>
            </FailWrapper>
          );
        })}
      </FailFrame>

      {/* <div className="viewer">
        {excelData ? (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  {Object.keys(excelData[0]).map((key) => (
                    <th key={key}>{key}</th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {excelData.map((individualExcelData, index) => (
                  <tr key={index}>
                    {Object.keys(individualExcelData).map((key) => (
                      <td key={key}>{individualExcelData[key]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div>No File is uploaded yet!</div>
        )}
      </div> */}
    </Frame>
  );
};

export default ExcelImport;

const Frame = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 0;
`;

const FailFrame = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 4rem;
`;

const FailWrapper = styled.div`
  display: flex;
  gap: 3rem;
  margin-top: 1rem;
`;
