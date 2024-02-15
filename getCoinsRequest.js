const { default: axios } = require("axios");

module.exports = {
  async getCoins() {
    const cryptoApiHeaders = {
      "X-RapidAPI-Key": process.env.COINDESK_APIKEY,
      "X-RapidAPI-Host": "coinranking1.p.rapidapi.com",
    };

    const baseUrl = "https://coinranking1.p.rapidapi.com";

    const params = {
        headers: cryptoApiHeaders
    }
    try {
      const response = await axios.get(`${baseUrl}/coins?limit=100`, params);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },

  async getLatestPrices(currencies) {
    const apiUrl = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest';

    // Define the parameters to be sent to the API endpoint
    const params = {
      headers: {
        'X-CMC_PRO_API_KEY': process.env.COINMARKET_API_KEY,

      },
    };
    try {
      // Send a GET request to the CoinMarketCap API endpoint
      const response = await axios.get(`${apiUrl}?symbol=${currencies}`, params);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },
}
