import React, { useCallback, useEffect, useState } from "react";
import { View, Text, SafeAreaView, Image, TextInput, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Feather, Entypo, FontAwesome } from "@expo/vector-icons";
import { debounce } from "lodash";
import { fetchLocations, fetchWeatherForecast } from "@/components/api";
import { WeatherCondition, weatherImages } from "@/constants";
import * as Progress from "react-native-progress";

// Define types for Location and Weather data
interface Location {
  name: string;
  country: string;
}

interface ForecastDay {
  date: string;
  day: {
    avgtemp_c: number;
    avghumidity: number;
    condition: {
      text: WeatherCondition;
      icon: string;
    };
  };
}

interface Weather {
  location: {
    name: string;
    country: string;
  };
  forecast: {
    forecastday: ForecastDay[];
  };
}

export default function HomeScreen() {
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [locations, setLocations] = useState<Location[]>([]);
  const [weather, setWeather] = useState<Weather | null>(null);
  const [loading, setLoading] = useState(true);

  const handleLocation = (loc: Location) => {
    setLocations([]);
    setShowSearchBar(false);
    setLoading(true);
    fetchWeatherForecast({
      cityName: loc.name
    }).then((data) => {
      if (data && data.forecast && data.forecast.forecastday) {
        data.forecast.forecastday = filterForecastDays(data.forecast.forecastday);
      }
      setWeather(data);
      setLoading(false);
    });
  };

  const handleSearch = (value: string) => {
    if (value.length > 2) {
      fetchLocations({ cityName: value }).then((data) => setLocations(data));
    }
  };

  useEffect(() => {
    fetchMyWeatherData();
  }, []);

  const fetchMyWeatherData = async () => {
    fetchWeatherForecast({ cityName: "Calgary" }).then((data) => {
      if (data && data.forecast && data.forecast.forecastday) {
        data.forecast.forecastday = filterForecastDays(data.forecast.forecastday);
      }
      setWeather(data);
      setLoading(false);
    });
  };

  const filterForecastDays = (forecastDays: ForecastDay[]) => {
    const today = new Date().toISOString().split('T')[0];
    return forecastDays.filter(day => day.date >= (today+1));
  };

  const handleDebounce = useCallback(debounce(handleSearch, 1000), []);

  const { location } = weather || {};

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Image
        blurRadius={1}
        source={require("file:///C:/Users/user/Downloads/images%20(1).jpg")}
        style={StyleSheet.flatten([styles.backgroundImage])}
      />

      {loading ? (
        <View style={styles.loadingContainer}>
          <Progress.CircleSnail thickness={10} size={140} color="white" />
        </View>
      ) : (
        <SafeAreaView style={styles.safeArea}>
          {/* SEARCH BAR SECTION */}
          <View style={styles.searchBarContainer}>
            <View
              style={[
                styles.searchBar,
                {
                  backgroundColor: showSearchBar
                    ? "rgba(255, 255, 255, 0.2)"
                    : "transparent",
                },
              ]}
            >
              {showSearchBar ? (
                <TextInput
                  onChangeText={handleDebounce}
                  placeholder="Search City"
                  placeholderTextColor="white"
                  style={styles.searchInput}
                />
              ) : null}
              <TouchableOpacity
                onPress={() => setShowSearchBar(!showSearchBar)}
                style={styles.searchButton}
              >
                <Feather name="search" size={25} color="white" />
              </TouchableOpacity>
            </View>
            {locations.length > 0 && showSearchBar ? (
              <View style={styles.locationSuggestions}>
                {locations.map((loc, index) => {
                  let showBorder = index + 1 != locations.length;
                  return (
                    <TouchableOpacity
                      onPress={() => handleLocation(loc)}
                      key={index}
                      style={[
                        styles.locationItem,
                        showBorder && styles.locationItemBorder,
                      ]}
                    >
                      <Entypo name="location-pin" size={20} color="black" />
                      <Text style={styles.locationText}>
                        {loc?.name}, {loc?.country}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : null}
          </View>

          {/* FORECAST SECTION */}
          <View style={styles.forecastContainer}>
            <View style={styles.locationContainer}>
              <Text style={styles.locationName}>{location?.name},</Text>
              <Text style={styles.locationCountry}> {location?.country}</Text>
            </View>

            {/* NEXT DAYS FORECAST */}
            <View style={styles.dailyForecastHeader}>
              <FontAwesome name="calendar" size={25} color="white" />
              <Text style={styles.dailyForecastText}>Daily Forecast</Text>
            </View>
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={styles.dailyForecastContainer}
            >
              {weather?.forecast?.forecastday?.map((days, index) => {
                let date = new Date(days.date);
                let options: Intl.DateTimeFormatOptions = {
                  weekday: 'long',
                  month: 'short',
                  day: 'numeric',
                };
                let dayName = date.toLocaleDateString('en-US', options);
                return (
                  <View key={index} style={styles.forecastDay}>
                    {days?.day?.condition?.text && (
                      <Image
                        source={weatherImages[days.day.condition.text as WeatherCondition]}
                        style={styles.forecastImage}
                      />
                    )}
                    <View style={styles.forecastTextContainer}>
                      <Text style={styles.forecastDayName}>{days.day.condition.text}</Text>
                      <Text style={styles.forecastDayName}>{dayName}</Text>
                      <Text style={styles.forecastDayTemp}>
                      <Feather name="thermometer" size={15} color="white" />{days?.day?.avgtemp_c}&#176;C       <Entypo name="drop" size={15} color="white" />{days?.day?.avghumidity}%
                      </Text>
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </SafeAreaView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  backgroundImage: {
    height: "100%",
    width: "100%",
    position: "absolute",
  },
  loadingContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  safeArea: {
    flex: 1,
  },
  searchBarContainer: {
    marginHorizontal: 16,
    zIndex: 50,
  },
  searchBar: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    borderRadius: 5000,
    marginTop: 15,
    marginBottom: 8,
  },
  searchInput: {
    height: 48,
    paddingLeft: 16,
    fontSize: 20,
    paddingBottom: 4,
    flex: 1,
    color: "white",
  },
  searchButton: {
    padding: 12,
    borderRadius: 9999,
    margin: 4,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
  },
  locationSuggestions: {
    position: "absolute",
    width: "100%",
    top: 64,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    borderBottomColor: "#f0f0f0",
  },
  locationItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    paddingHorizontal: 16,
  },
  locationItemBorder: {
    borderBottomWidth: 2,
    borderBottomColor: "gray",
  },
  locationText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 18,
    marginLeft: 8,
  },
  forecastContainer: {
    flex: 1,
    justifyContent: "space-around",
    marginHorizontal: 16,
    marginBottom: 28,
  },
  locationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  locationName: {
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
  },
  locationCountry: {
    fontSize: 20,
    fontWeight: "600",
    color: "white",
  },
  dailyForecastHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    marginLeft: 8,
    marginBottom: 8,
  },
  dailyForecastText: {
    color: "white",
    fontWeight: "600",
    fontSize: 20,
    marginLeft: 12,
  },
  dailyForecastContainer: {
    marginLeft: 8,
  },
  forecastDay: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  forecastImage: {
    width: 48,
    height: 48,
    alignSelf: "center",
  },
  forecastDayName: {
    color: "#d1d5db",
    fontWeight: "600",
    textAlign: "center",
    paddingTop: 4,
  },
  forecastDayTemp: {
    color: "white",
    fontWeight: "600",
    fontSize: 20,
    textAlign: "center",
  },
  forecastTextContainer: {
    flex: 1,
    flexDirection: 'column',
  },
});
