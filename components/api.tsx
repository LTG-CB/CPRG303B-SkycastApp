import axios from "axios";
import { apiKey } from "../constants";

const forecastEndpoint = (params: { cityName: any;  }) =>
  `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${params.cityName}&days=8&aqi=no&alerts=no`;
const locationsEndpoint = (params: { cityName: any; }) =>
  `https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${params.cityName}`;
const historyEndpoint = (params: { cityName: any;dt:any; }) =>
  `https://api.weatherapi.com/v1/history.json?key=${apiKey}&q=${params.cityName}&dt=${params.dt}`;

const apiCall = async (endpoint: string) => {
  const options = {
    method: "GET",
    url: endpoint,
  };

  try {
    const response = await axios.request(options);
    console.log("API response data:", response.data); // Log the full response
    return response.data;
  } catch (error: any) {
    console.log("API error response:", error.response?.data); // Log detailed error response
    console.log("error: ", error);
    return {};
  }
};

export const fetchWeatherForecast = (params: any) => {
  let forecastUrl = forecastEndpoint(params);
  return apiCall(forecastUrl);
};

export const fetchLocations = (params: any) => {
  let locationsUrl = locationsEndpoint(params);
  return apiCall(locationsUrl);
};

export const fetchHistoricalWeather = (params: any) => {
  let historyUrl = historyEndpoint(params);
  console.log("History URL: ", historyUrl); // Log the history URL
  return apiCall(historyUrl);
}
