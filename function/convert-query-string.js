import supabase from "@/config/supabaseClient";

export const convertQueryString = (queryString, mapLevel) => {
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

  // 맵 확대 레벨 7 이하
  if (queryString.lat && queryString.lat !== "" && mapLevel <= 7) {
    query = query.gte("lat", queryString.lat - 0.02);
    query = query.lte("lat", queryString.lat + 0.02);
  }

  if (queryString.lng && queryString.lng !== "" && mapLevel <= 7) {
    query = query.gte("lng", queryString.lng - 0.02);
    query = query.lte("lng", queryString.lng + 0.02);
  }

  // 맵 확대 레벨 7이상 ~ 10이하
  if (
    queryString.lat &&
    queryString.lat !== "" &&
    mapLevel >= 7 &&
    mapLevel <= 10
  ) {
    query = query.gte("lat", queryString.lat - 0.07);
    query = query.lte("lat", queryString.lat + 0.07);
  }

  if (
    queryString.lng &&
    queryString.lng !== "" &&
    mapLevel >= 7 &&
    mapLevel <= 10
  ) {
    query = query.gte("lng", queryString.lng - 0.07);
    query = query.lte("lng", queryString.lng + 0.07);
  }

  // 맵 확대 레벨 11~14
  if (
    queryString.lat &&
    queryString.lat !== "" &&
    mapLevel >= 10 &&
    mapLevel <= 14
  ) {
    query = query.gte("lat", queryString.lat - 0.12);
    query = query.lte("lat", queryString.lat + 0.12);
  }

  if (
    queryString.lng &&
    queryString.lng !== "" &&
    mapLevel > 10 &&
    mapLevel <= 14
  ) {
    query = query.gte("lng", queryString.lng - 0.1);
    query = query.lte("lng", queryString.lng + 0.1);
  }

  return query;
};
