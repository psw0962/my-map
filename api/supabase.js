import supabase from "@/config/supabaseClient";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { format } from "date-fns";

// =======================================
// ============== get excel ==============
// =======================================
const getExcel = async (queryString) => {
  let query = supabase.from("excel").select();

  if (queryString.status && queryString.status.length > 0) {
    query = query.in("status", queryString.status);
  }

  if (queryString.company && queryString.company.length > 0) {
    query = query.in("company", queryString.company);
  }

  if (queryString.startStocks && queryString.startStocks !== "") {
    query = query.gte("stocks", queryString.startStocks);
  }

  if (queryString.endStocks && queryString.endStocks !== "") {
    query = query.lte("stocks", queryString.endStocks);
  }

  if (queryString.lat && queryString.lat !== "") {
    query = query.gte("lat", queryString.lat - 0.05);
    query = query.lte("lat", queryString.lat + 0.05);
  }

  if (queryString.lng && queryString.lng !== "") {
    query = query.gte("lng", queryString.lng - 0.05);
    query = query.lte("lng", queryString.lng + 0.05);
  }

  // 최종 쿼리 실행
  const { data, error } = await query;

  return data;
};

export const useGetExcel = (queryString) => {
  return useQuery(["excel"], () => getExcel(queryString), {
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
// ============== get filter menu ========
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
// ============== get sum of completed stocks =====
// ================================================
const getCompletedStocks = async () => {
  let { data, error } = await supabase
    .from("excel")
    .select("*")
    .eq("status", "완료");

  const sumCompletedStocks = () => {
    const totalStocks = data
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

// ================================================
// ============== get user info ===================
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
