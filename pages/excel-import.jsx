import { useState } from "react";
import * as XLSX from "xlsx";
import supabase from "@/config/supabaseClient";

const ExcelImport = () => {
  // onchange states
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

      // // 위도, 경도 추가
      // window.kakao.maps.load();
      // const geocoder = new window.kakao.maps.services.Geocoder();
      // const result = [];

      // const geocodingPromises = data?.map((x) => {
      //   return new Promise((resolve) => {
      //     geocoder.addressSearch(x.address, function (k, status) {
      //       if (status === window.kakao.maps.services.Status.OK) {
      //         result.push({
      //           ...x,
      //           lat: k[0].y.toString(),
      //           lng: k[0].x.toString(),
      //         });
      //       }

      //       resolve();
      //     });
      //   });
      // });

      // // 모든 주소 검색 작업이 완료될 때까지 기다립니다.
      // await Promise.all(geocodingPromises);
      // // 데이터베이스에 해당 데이터를 저장
      // await supabase.from("excel").insert(result).select();

      // ===========
      // ===========
      // ===========
      // ===========
      // ===========
      window.kakao.maps.load();
      const geocoder = new window.kakao.maps.services.Geocoder();
      const result = [];

      const geocodeBatch = async (batchAddresses) => {
        const geocodingPromises = batchAddresses.map((x) => {
          return new Promise((resolve) => {
            geocoder.addressSearch(x.address, function (k, status) {
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
          console.log(batchAddresses);

          await geocodeBatch(batchAddresses); // 배치 주소 검색 함수 호출

          if (batchIndex < totalBatches - 1) {
            // 마지막 배치가 아니라면 5초 대기
            await delay(10000);
          }
        }

        // 검색이 완료된 결과 반환
        return result;
      };

      // 주소 데이터가 있다고 가정하고 함수 호출
      const geocodedResult = await geocodeAddresses(data);
      console.log("Geocoded Result:", geocodedResult);
    }
  };

  return (
    <div className="wrapper">
      {/* form */}
      <form className="form-group custom-form" onSubmit={handleFileSubmit}>
        <input
          type="file"
          className="form-control"
          required
          onChange={handleFile}
        />
        <button type="submit" className="btn btn-success btn-md">
          UPLOAD
        </button>
        {typeError && (
          <div className="alert alert-danger" role="alert">
            {typeError}
          </div>
        )}
      </form>

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
    </div>
  );
};

export default ExcelImport;
