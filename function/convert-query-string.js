import supabase from "@/config/supabaseClient";

export const convertQueryString = (queryString) => {
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

  return query;
};
