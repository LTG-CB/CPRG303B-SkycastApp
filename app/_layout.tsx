import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  ScrollView,
  ImageBackground,
  Image,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from "@expo/vector-icons";
import * as Location from 'expo-location';

import LocationInput from "./src/components/LocationInput";
import { fetchWeather } from "./src/services/weatherService";
import PreferencesToggles from "./src/components/PreferencesToggles";

type PreferenceKeys =
  | "maxTemperature"
  | "minTemperature"
  | "apparentMaxTemperature"
  | "apparentMinTemperature"
  | "precipitation"
  | "rain"
  | "snowfall"
  | "windSpeed"
  | "windGusts"
  | "weatherCode";

export default function RootLayout() {
  const [weatherData, setWeatherData] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [preferences, setPreferences] = useState<Record<PreferenceKeys, boolean>>({
    maxTemperature: true,
    minTemperature: true,
    apparentMaxTemperature: true,
    apparentMinTemperature: true,
    precipitation: false,
    rain: false,
    snowfall: false,
    windSpeed: false,
    windGusts: false,
    weatherCode: true,
  });

  const handleLocationChange = (newLocation: string) => {
    setLocation(newLocation);
  };

  const handleSearch = async () => {
    await fetchWeatherDataForLocation(location);
  };

  const handleAddToFavorites = () => {
    if (location && !favorites.includes(location)) {
      setFavorites([...favorites, location]);
    }
  };

  const handleFavoritePress = async (favoriteLocation: string) => {
    setLocation(favoriteLocation);
    await fetchWeatherDataForLocation(favoriteLocation);
  };

  const fetchWeatherDataForLocation = async (locationToFetch: string) => {
    if (!locationToFetch) return;

    setLoading(true);
    setError(null);

    try {
      const geocodedLocation = await Location.geocodeAsync(locationToFetch);

      if (geocodedLocation && geocodedLocation.length > 0) {
        const { latitude, longitude } = geocodedLocation[0];

        const data = await fetchWeather(latitude, longitude, preferences);
        setWeatherData(data);
      } else {
        throw new Error("Location not found");
      }
    } catch (err: any) {
      setError(err.message || "Error fetching weather");
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (key: PreferenceKeys) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  useEffect(() => {
    const loadInitialWeather = async () => {
      setLoading(true);
      try {
        const latitude = 51.0447; // Calgary
        const longitude = -114.0719; // Calgary

        const data = await fetchWeather(latitude, longitude, preferences);
        setWeatherData(data);
      } catch (err: any) {
        setError(err.message || "Error fetching weather");
        setWeatherData(null);
      } finally {
        setLoading(false);
      }
    };

    loadInitialWeather();
  }, []);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Permission to access location was denied');
        return;
      }
    })();
  }, []);

  const getWeatherDescription = (weathercode: number): string => {
    const descriptions: Record<number, string> = {
      0: "Clear sky",
      1: "Mainly clear",
      2: "Partly cloudy",
      3: "Overcast",
      45: "Fog",
      48: "Depositing rime fog",
      51: "Drizzle: Light intensity",
      53: "Drizzle: Moderate intensity",
      55: "Drizzle: Dense intensity",
      56: "Freezing Drizzle: Light intensity",
      57: "Freezing Drizzle: Dense intensity",
      61: "Rain: Slight intensity",
      63: "Rain: Moderate intensity",
      65: "Rain: Heavy intensity",
      66: "Freezing Rain: Light intensity",
      67: "Freezing Rain: Heavy intensity",
      71: "Snow fall: Slight intensity",
      73: "Snow fall: Moderate intensity",
      75: "Snow fall: Heavy intensity",
      77: "Snow grains",
      80: "Rain showers: Slight intensity",
      81: "Rain showers: Moderate intensity",
      82: "Rain showers: Violent intensity",
      85: "Snow showers: Slight intensity",
      86: "Snow showers: Heavy intensity",
      95: "Thunderstorm: Slight or moderate",
      96: "Thunderstorm with slight hail",
      99: "Thunderstorm with heavy hail",
    };

    return descriptions[weathercode] || "Unknown";
  };

  const getWeatherImage = (weathercode: number): any => {
    const images: Record<number, any> = {
      0: require('../assets/sun.png'),
      1: require('../assets/sun.png'),
      2: require('../assets/sun.png'),
      3: require('../assets/sun.png'),
      45: require('../assets/cloudy.png'),
      48: require('../assets/cloudy.png'),
      51: require('../assets/rain.png'),
      53: require('../assets/rain.png'),
      55: require('../assets/rain.png'),
      56: require('../assets/rain.png'),
      57: require('../assets/rain.png'),
      61: require('../assets/rain.png'),
      63: require('../assets/rain.png'),
      65: require('../assets/rain.png'),
      66: require('../assets/rain.png'),
      67: require('../assets/rain.png'),
      71: require('../assets/snow.png'),
      73: require('../assets/snow.png'),
      75: require('../assets/snow.png'),
      77: require('../assets/snow.png'),
      80: require('../assets/rain-sun.png'),
      81: require('../assets/rain-sun.png'),
      82: require('../assets/rain-sun.png'),
      85: require('../assets/snow.png'),
      86: require('../assets/snow.png'),
      95: require('../assets/thunder.png'),
      96: require('../assets/thunder.png'),
      99: require('../assets/thunder.png'),
    };

    return images[weathercode] || require('../assets/sun.png');
  };

  return (
    <ImageBackground
      source={{ uri: "https://source.unsplash.com/featured/?weather" }}
      style={styles.background}
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.8)', 'transparent']}
        style={styles.background}
      >
        <SafeAreaView style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Location Input and Search Button */}
            <View style={styles.locationHeader}>
              <LocationInput location={location} onLocationChange={handleLocationChange} />
              <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                <Ionicons name="search" size={24} color="white" />
              </TouchableOpacity>
            </View>

            {/* Add to Favorites Button */}
            <TouchableOpacity style={styles.favoritesButton} onPress={handleAddToFavorites}>
              <Text style={styles.buttonText}>Add to Favorites</Text>
            </TouchableOpacity>

            {/* Loading and Error States */}
            {loading && <ActivityIndicator size="large" color="#fff" />}
            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {/* Weather Display */}
            {weatherData && (
              <View style={styles.weatherContainer}>
                {/* Current Conditions */}
                <View style={styles.currentConditions}>
                  {/* Temperature */}
                  <View style={styles.temperatureContainer}>
                    <Text style={styles.currentTemp}>
                      High: {weatherData.daily.temperature_2m_max[0]}°C
                    </Text>
                    <Text style={styles.currentTemp}>
                      Low: {weatherData.daily.temperature_2m_min[0]}°C
                    </Text>
                  </View>

                  {/* Weather Description */}
                  <View style={styles.currentInfo}>
                    <Image
                      source={getWeatherImage(weatherData.daily.weathercode[0])}
                      style={styles.largeIcon}
                    />
                    <Text style={styles.currentDescription}>
                      {getWeatherDescription(weatherData.daily.weathercode[0])}
                    </Text>
                  </View>
                </View>
              </View>
            )}

                        {/* Favorites Section */}
            <View style={styles.favoritesSection}>
              <Text style={styles.favoritesTitle}>Favorites</Text>
              <View style={styles.favoritesContainer}>
                {favorites.map((fav) => (
                  <TouchableOpacity
                    key={fav}
                    style={styles.favoriteItemBox}
                    onPress={() => handleFavoritePress(fav)}
                  >
                    <Text style={styles.favoriteItemText}>{fav}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Preferences Section */}
            <View style={styles.preferencesSection}>
              <Text style={styles.preferencesTitle}>Preferences</Text>
              <PreferencesToggles
                preferences={preferences}
                onToggle={handleToggle}
              />
            </View>


          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  locationHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  searchButton: {
    marginLeft: 10,
    padding: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 5,
  },
  favoritesButton: {
    backgroundColor: "#007BFF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorContainer: {
    backgroundColor: "rgba(255, 0, 0, 0.2)",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  errorText: {
    color: "#fff",
    textAlign: "center",
  },
  weatherContainer: {
    marginBottom: 20,
  },
  currentConditions: {
    alignItems: "center",
    marginBottom: 20,
  },
  temperatureContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  currentTemp: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#fff",
    marginRight: 10,
  },
  currentInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  largeIcon: {
    width: 80,
    height: 80,
    marginRight: 10,
  },
  currentDescription: {
    fontSize: 24,
    color: "#fff",
  },
  preferencesSection: {
    marginBottom: 20,
  },
  preferencesTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
    marginBottom: 10,
  },
  favoritesSection: {
    marginTop: 20,
  },
  favoritesTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
  },
  favoritesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  favoriteItemBox: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 10,
    margin: 5,
    borderRadius: 5,
  },
  favoriteItemText: {
    fontSize: 16,
    color: "#fff",
    paddingVertical: 5,
  },
});