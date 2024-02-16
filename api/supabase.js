import supabase from "@/config/supabaseClient";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { format } from "date-fns";
import { convertQueryString } from "@/function/convert-query-string";

// =======================================
// ============== 엑셀 데이터 ===============
// =======================================
const getExcel = async (queryString, mapLevel) => {
  const { data, error } = await convertQueryString(queryString, mapLevel);

  return data;
};

export const useGetExcel = (queryString, mapLevel) => {
  return useQuery(["excel"], () => getExcel(queryString, mapLevel), {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    enabled: true,
    staleTime: 1000 * 60 * 5,
  });
};

// =========================================
// ============== 마커 정보 업데이트 ============
// =========================================
const patchExcel = async (excelId, userId, patchData) => {
  const makeHistory = `${userId} ${format(new Date(), "yyyy/MM/dd/ HH:mm:ss")}`;

  if (patchData.history !== null) {
    const newArr = [...patchData.history, makeHistory];

    const result = {
      status: patchData.status,
      memo: patchData.memo,
      history: newArr,
    };

    await supabase.from("excel").update(result).eq("id", excelId).select();

    return;
  } else {
    const result = {
      status: patchData.status,
      memo: patchData.memo,
      history: [makeHistory],
    };

    await supabase.from("excel").update(result).eq("id", excelId).select();
    return;
  }
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
// ============== 필터 메뉴 ================
// =======================================
const getFilterMenu = async () => {
  const { data, error } = await supabase.from("excel").select();

  const statusArray = data?.map((item) => item.status);
  const companyMenuArray = data?.map((item) => item.company);

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
// ============== 필터 된 마커 정보 ===================
// ================================================
const getCompletedFilterMaker = async (queryString) => {
  const { data, error } = await convertQueryString(queryString);

  const sumCompletedStocks = () => {
    const totalStocks = data
      .map((item) => item.stocks)
      .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    return totalStocks;
  };

  return {
    sumCompletedStocks: sumCompletedStocks(),
    length: data.length,
  };
};

export const useGetCompletedFilterMaker = (queryString) => {
  return useQuery(
    ["completedFilterMaker"],
    () => getCompletedFilterMaker(queryString),
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      enabled: true,
      staleTime: 1000 * 60 * 5,
    }
  );
};

// ================================================
// ============== 로그인한 유저 정보 ===================
// ================================================
const getUserInfo = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
};

export const useGetUserInfo = () => {
  return useQuery(["userInfo"], () => getUserInfo(), {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    enabled: true,
    staleTime: 1000 * 60 * 5,
  });
};
