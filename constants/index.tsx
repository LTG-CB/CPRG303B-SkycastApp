// @constants file
export const apiKey = "459aebedd10e410f85f165913240508";

export type WeatherCondition =
  | "Partly Cloudy"
  | "Moderate rain"
  | "Rainfall Possible"
  | "Sunny"
  | "Clear"
  | "Overcast"
  | "Cloudy"
  | "Light rain"
  | "Patchy rain nearby"
  | "Patchy rain possible"
  | "Patchy snow possible"
  | "Patchy sleet possible"
  | "Patchy freezing drizzle possible"
  | "Thundery outbreaks possible"
  | "Blowing snow"
  | "Blizzard"
  | "Fog"
  | "Freezing fog"
  | "Patchy light drizzle"
  | "Light drizzle"
  | "Freezing drizzle"
  | "Heavy freezing drizzle"
  | "Patchy light rain"
  | "Moderate rain at times"
  | "Heavy rain at times"
  | "Light freezing rain"
  | "Moderate or heavy freezing rain"
  | "Light sleet"
  | "Patchy light snow"
  | "Light snow"
  | "Heavy Rain"
  | "Moderate Rain shower"
  | "Moderate Rain with thunder"
  | "Mist"
  | "Light rain shower"
  | "Moderate or heavy rain shower"
  | "Patchy light rain with thunder"
  | "other";

export const weatherImages: Record<WeatherCondition, any> = {
  "Partly Cloudy": require("../assets/images/cloud.png"),
  "Moderate rain": require("../assets/images/moderaterain.png"),
  "Patchy light rain with thunder": require("../assets/images/moderaterain.png"),
  "Moderate or heavy rain shower": require("../assets/images/moderaterain.png"),
  "Light rain shower": require("../assets/images/moderaterain.png"),
  "Rainfall Possible": require("../assets/images/moderaterain.png"),
  "Sunny": require("../assets/images/sun.png"),
  "Clear": require("../assets/images/sun.png"),
  "Overcast": require("../assets/images/cloud.png"),
  "Cloudy": require("../assets/images/cloud.png"),
  "Light rain": require("../assets/images/moderaterain.png"),
  "Patchy rain nearby": require("../assets/images/moderaterain.png"),
  "Patchy rain possible": require("../assets/images/moderaterain.png"),
  "Patchy snow possible": require("../assets/images/cloud.png"),
  "Patchy sleet possible": require("../assets/images/cloud.png"),
  "Patchy freezing drizzle possible": require("../assets/images/cloud.png"),
  "Thundery outbreaks possible": require("../assets/images/moderaterain.png"),
  "Blowing snow": require("../assets/images/cloud.png"),
  "Blizzard": require("../assets/images/cloud.png"),
  "Fog": require("../assets/images/mist.png"),
  "Freezing fog": require("../assets/images/mist.png"),
  "Patchy light drizzle": require("../assets/images/moderaterain.png"),
  "Light drizzle": require("../assets/images/moderaterain.png"),
  "Freezing drizzle": require("../assets/images/moderaterain.png"),
  "Heavy freezing drizzle": require("../assets/images/moderaterain.png"),
  "Patchy light rain": require("../assets/images/moderaterain.png"),
  "Moderate rain at times": require("../assets/images/moderaterain.png"),
  "Heavy rain at times": require("../assets/images/heavyrain.png"),
  "Light freezing rain": require("../assets/images/moderaterain.png"),
  "Moderate or heavy freezing rain": require("../assets/images/heavyrain.png"),
  "Light sleet": require("../assets/images/moderaterain.png"),
  "Patchy light snow": require("../assets/images/cloud.png"),
  "Light snow": require("../assets/images/cloud.png"),
  "Heavy Rain": require("../assets/images/heavyrain.png"),
  "Moderate Rain shower": require("../assets/images/moderaterain.png"),
  "Moderate Rain with thunder": require("../assets/images/moderaterain.png"),
  "Mist": require("../assets/images/mist.png"),
  "other": require("../assets/images/moderaterain.png"),
};

