import axios from 'axios';

const WEATHER_BASE_URL = 'https://api.open-meteo.com/v1/forecast';

export const fetchWeather = async (
  latitude: number,
  longitude: number,
  preferences: Record<string, boolean>
) => {
  try {
    const dailyParams = [];
    if (preferences.maxTemperature) dailyParams.push('temperature_2m_max');
    if (preferences.minTemperature) dailyParams.push('temperature_2m_min');
    if (preferences.apparentMaxTemperature) dailyParams.push('apparent_temperature_max');
    if (preferences.apparentMinTemperature) dailyParams.push('apparent_temperature_min');
    if (preferences.precipitation) dailyParams.push('precipitation_sum');
    if (preferences.rain) dailyParams.push('rain_sum');
    if (preferences.snowfall) dailyParams.push('snowfall_sum');
    if (preferences.windSpeed) dailyParams.push('windspeed_10m_max');
    if (preferences.windGusts) dailyParams.push('windgusts_10m_max');
    if (preferences.weatherCode) dailyParams.push('weathercode');

    const params = {
      latitude,
      longitude,
      daily: dailyParams.join(','),
      forecast_days: 1,
      timezone: 'auto',
    };

    const response = await axios.get(WEATHER_BASE_URL, { params });

    console.log('Weather API response:', response.data);

    return response.data;
  } catch (error) {
    console.error('Error fetching weather:', error);
    throw error;
  }
};