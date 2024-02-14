// export const convertQueryString = (obj) => {
//   if (!obj || typeof obj !== "object") {
//     return "";
//   }

//   const queryStringArray = Object.keys(obj)
//     .map((key) => {
//       if (
//         !obj[key] ||
//         (Array.isArray(obj[key]) && obj[key].length === 0) ||
//         (typeof obj[key] === "object" && Object.keys(obj[key]).length === 0)
//       ) {
//         return "";
//       }
//       if (key === "startStocks") {
//         return `(stocks >= "${obj[key]}")`;
//       } else if (key === "endStocks") {
//         return `(stocks <= "${obj[key]}")`;
//       } else {
//         const values = obj[key].map((value) => `${key}="${value}"`).join("||");
//         return `(${values})`;
//       }
//     })
//     .filter((str) => str !== "");

//   const queryString = queryStringArray.join("&&");

//   return queryString;
// };

// export const convertQueryString = (obj) => {
//   if (!obj || typeof obj !== "object") {
//     return {};
//   }

//   const queryParams = {};

//   if (obj.status && Array.isArray(obj.status) && obj.status.length > 0) {
//     queryParams.status = obj.status.map((status) => `eq.${status}`).join(",");
//   }

//   if (obj.company && Array.isArray(obj.company) && obj.company.length > 0) {
//     queryParams.company = obj.company
//       .map((company) => `eq.${company}`)
//       .join(",");
//   }

//   if (obj.startStocks) {
//     queryParams.stocks = queryParams.stocks
//       ? `${queryParams.stocks}&gte.${obj.startStocks}`
//       : `gte.${obj.startStocks}`;
//   }

//   if (obj.endStocks) {
//     queryParams.stocks = queryParams.stocks
//       ? `${queryParams.stocks}&lte.${obj.endStocks}`
//       : `lte.${obj.endStocks}`;
//   }

//   return queryParams;
// };

// export const convertQueryString = (obj) => {
//   if (!obj || typeof obj !== "object") {
//     return {};
//   }

//   const queryParams = {};

//   if (obj.status && Array.isArray(obj.status) && obj.status.length > 0) {
//     queryParams.status = obj.status.map((status) => `in.${status}`).join(",");
//   }

//   if (obj.company && Array.isArray(obj.company) && obj.company.length > 0) {
//     queryParams.company = obj.company
//       .map((company) => `eq.${company}`)
//       .join(",");
//   }

//   if (obj.startStocks) {
//     queryParams.stocks = queryParams.stocks
//       ? `${queryParams.stocks},gte.${obj.startStocks}`
//       : `gte.${obj.startStocks}`;
//   }

//   if (obj.endStocks) {
//     queryParams.stocks = queryParams.stocks
//       ? `${queryParams.stocks},lte.${obj.endStocks}`
//       : `lte.${obj.endStocks}`;
//   }

//   return queryParams;
// };

export const convertQueryString = (obj) => {
  if (!obj || typeof obj !== "object") {
    return {};
  }

  const queryParams = {};

  if (obj.status && Array.isArray(obj.status) && obj.status.length > 0) {
    queryParams.status = `in.('status', [${obj.status
      .map((status) => `'${status}'`)
      .join(",")}])`;
  }

  if (obj.company && Array.isArray(obj.company) && obj.company.length > 0) {
    queryParams.company = `in.('company', [${obj.company
      .map((company) => `'${company}'`)
      .join(",")}])`;
  }

  if (obj.startStocks) {
    queryParams.stocks = queryParams.stocks
      ? `${queryParams.stocks},gte.${obj.startStocks}`
      : `gte.${obj.startStocks}`;
  }

  if (obj.endStocks) {
    queryParams.stocks = queryParams.stocks
      ? `${queryParams.stocks},lte.${obj.endStocks}`
      : `lte.${obj.endStocks}`;
  }

  return queryParams;
};
