export const getLatestPrices = async (currencies: string) => {
  const apiUrl = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest";

  const params = {
    headers: {
      "X-CMC_PRO_API_KEY": "3ff74387-0a6e-4e72-8742-d63376601304", //|| process.env.COINMARKET_API_KEY,
    },
  };
  try {
    // Send a GET request to the CoinMarketCap API endpoint
    const response = await fetch(`${apiUrl}?symbol=${currencies}`, params);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    // const response = await axios.get(`${apiUrl}?symbol=${currencies}`, params);
    return response.json();
  } catch (error) {
    console.error(error);
  }
};
