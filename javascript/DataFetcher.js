import { fetchData } from "./utilities.js";

/**
 * @returns {Object} An object with a method to fetch JSON values.
 * @typedef {Object} DataFetcher
 * @property {Function} initializeDataFetcher - Initializes the data fetcher and returns an object
 * with a method to fetch JSON values.
 * @property {Function} getJsonValues - Fetches JSON values from a specified URL.
 * @param {number} [pageSize=14] - The number of items per page.
 * @param {number} [pageNumber=1] - The page number to fetch.
 * @returns {Promise<Array>} A promise that resolves to an array of JSON values.
 * @throws {Error} If the fetch operation fails or the response is not OK.
 */

export default function createDataFetcher() {
  const dataFetcher = {
    initializeDataFetcher: function () {
      const getJsonValues = async (pageSize = 14, pageNumber = 1) => {
        const url = `https://brandstestowy.smallhost.pl/api/random?pageSize=${pageSize}&pageNumber=${pageNumber}`;
        return fetchData(url, "data");
      };

      return { getJsonValues };
    },
  };
  return dataFetcher;
}
