import PocketBase from "pocketbase";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { format } from "date-fns";

const pb = new PocketBase(process.env.NEXT_PUBLIC_POKETBASE_API_URL);

// =======================================
// ============== get excel ==============
// =======================================
const getExcel = async (queryString, setFilterIsLoading) => {
  try {
    setFilterIsLoading(true);

    const resultData = await pb?.collection("excel").getFullList({
      filter: queryString,
    });

    // 위도, 경도 추가
    window.kakao.maps.load();
    const geocoder = new window.kakao.maps.services.Geocoder();
    const newObj = [];

    const geocodingPromises = resultData?.map((x) => {
      return new Promise((resolve) => {
        geocoder.addressSearch(x.address, function (result, status) {
          if (status === window.kakao.maps.services.Status.OK) {
            newObj.push({
              ...x,
              lat: Number(result[0].y),
              lng: Number(result[0].x),
            });
          }

          resolve();
        });
      });
    });

    // 모든 주소 검색 작업이 완료될 때까지 기다립니다.
    await Promise.all(geocodingPromises);

    setFilterIsLoading(false);

    return newObj;
  } catch (error) {
    throw new Error("Failed to fetch data");
  }
};

export const useGetExcel = (queryString, setFilterIsLoading) => {
  return useQuery(["excel"], () => getExcel(queryString, setFilterIsLoading), {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    enabled: true,
    staleTime: 1000 * 60 * 5,
  });
};

// =========================================
// ============== patch excel ==============
// =========================================
const patchExcel = async (excelId, userId, patchData) => {
  const makeHistory = `${userId.model.name} ${format(
    new Date(),
    "yyyy/MM/dd/ HH:mm:ss"
  )}`;

  const newArr = [...patchData.history, makeHistory];

  const data = {
    name: patchData.name,
    stocks: patchData.stocks,
    address: patchData.address,
    status: patchData.status,
    company: patchData.company,
    memo: patchData.memo,
    history: newArr,
  };

  await pb.collection("excel").update(excelId, data);
};

export const usePatchExcel = (excelId, userId) => {
  const queryClient = useQueryClient();

  return useMutation((patchData) => patchExcel(excelId, userId, patchData), {
    onSuccess: () => {
      queryClient.invalidateQueries(["excel"]);
      queryClient.invalidateQueries(["filterMenu"]);
      queryClient.invalidateQueries(["completedStocks"]);
    },
  });
};

// =======================================
// ============== get filter menu ========
// =======================================
const getFilterMenu = async () => {
  const resultData = await pb?.collection("excel").getFullList({
    sort: "-created",
  });

  const statusArray = resultData?.map((item) => item.status);
  const companyMenuArray = resultData?.map((item) => item.company);

  const uniqueStatusArray = [...new Set(statusArray)];
  const uniqueCompanyMenuArray = [...new Set(companyMenuArray)];

  return {
    statusMenu: uniqueStatusArray,
    companyMenu: uniqueCompanyMenuArray,
  };
};

export const useGetFilterMenu = () => {
  return useQuery(["filterMenu"], () => getFilterMenu(), {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    enabled: true,
    staleTime: 1000 * 60 * 5,
  });
};

// ================================================
// ============== get sum of completed stocks =====
// ================================================
const getCompletedStocks = async () => {
  const resultData = await pb?.collection("excel").getFullList({
    filter: '(status="완료")',
  });

  const sumCompletedStocks = () => {
    const totalStocks = resultData
      .map((item) => item.stocks)
      .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    return totalStocks;
  };

  return sumCompletedStocks();
};

export const useGetCompletedStocks = () => {
  return useQuery(["completedStocks"], () => getCompletedStocks(), {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    enabled: true,
    staleTime: 1000 * 60 * 5,
  });
};
