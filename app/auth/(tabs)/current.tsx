import React, { useCallback, useEffect, useState } from "react";
import {  View,  Text,  SafeAreaView,  Image,  TextInput,  TouchableOpacity,   StyleSheet,} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Feather, Entypo } from "@expo/vector-icons";
import { debounce } from "lodash";
import { fetchLocations, fetchWeatherForecast } from "@/components/api";
import { WeatherCondition, weatherImages } from "@/constants";
import * as Progress from "react-native-progress";

// Define types for Location and Weather data
interface Location {
  name: string;
  country: string;
}

interface CurrentWeather {
  temp_c: number;
  condition: {
    text: WeatherCondition;
    icon: string;
  };
  wind_kph: number;
  humidity: number;
  cloud: number;
  uv: number;
  last_updated: string;
  feelslike_c: number;
  precip_mm: number;
  wind_dir: string;
}

interface Weather {
  location: {
    name: string;
    country: string;
  };
  current: CurrentWeather;
  };

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
      cityName: loc.name,
      days: "7",
    }).then((data) => {
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
    fetchWeatherForecast({ cityName: "Calgary"}).then((data) => {
      setWeather(data);
      setLoading(false);
    });
  };

  const handleDebounce = useCallback(debounce(handleSearch, 1000), []);

  const { current, location } = weather || {};

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Image
        blurRadius={1}
        source={{
          uri: "https://t3.ftcdn.net/jpg/05/79/86/10/360_F_579861052_KjeAAbyaXOBY6JjxMEPBVJypp2KSb59v.jpg",
        }}
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

          {/*LOCATION DETAILS */}
          <View style={styles.locationContainer}>
            <Text style={styles.locationName}>{location?.name},</Text>
            <Text style={styles.locationCountry}> {location?.country}</Text>
          </View>
          {/* IMAGE VIEW */}
          <View style={styles.weatherImageContainer}>
            {current?.condition?.text && (
              <Image
                source={weatherImages[current.condition.text]}
                style={styles.weatherImage}
              />
            )}
          </View>
          {/* TEMPERATURE CELSIUS */}
          <View style={styles.temperatureContainer}>
            <Text style={styles.temperature}>{current?.temp_c}&#176;</Text>
            <Text style={styles.conditionText}>{current?.condition?.text}</Text>
          </View>
          {/* WEATHER CONDITIONS */}
          <View style={styles.lastupdateContainer}>
            <View style={styles.conditionItem}>
              <Feather name="clock" size={15} color="white" />
              <Text style={styles.conditionSmallText}>
                Last update: {current?.last_updated}
              </Text>
            </View>
          </View>
          <View style={styles.conditionsContainer}>
            <View style={styles.column}>
              <View style={styles.conditionItem}>
                <Feather name="thermometer" size={30} color="white" />
                <Text style={styles.conditionText}>
                  Feel like: {current?.feelslike_c}&#176;
                </Text>
              </View>
              <View style={styles.conditionItem}>
                <Feather name="sun" size={30} color="white" />
                <Text style={styles.conditionText}>
                  UV index: {current?.uv}
                </Text>
              </View>
              <View style={styles.conditionItem}>
                <Feather name="wind" size={30} color="white" />
                <Text style={styles.conditionText}>
                  {current?.wind_kph} km {current?.wind_dir}
                </Text>
              </View>
            </View>
            <View style={styles.column}>
              <View style={styles.conditionItem}>
                <Entypo name="drop" size={30} color="white" />
                <Text style={styles.conditionText}>{current?.humidity}%</Text>
              </View>
              <View style={styles.conditionItem}>
                <Feather name="cloud" size={30} color="white" />
                <Text style={styles.conditionText}>{current?.cloud}%</Text>
              </View>
              <View style={styles.conditionItem}>
                <Feather name="umbrella" size={30} color="white" />
                <Text style={styles.conditionText}>{current?.precip_mm}mm</Text>
              </View>
            </View>
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
  weatherImageContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  weatherImage: {
    width: 168,
    height: 168,
    margin: 16,
  },
  temperatureContainer: {
    alignItems: "center",
  },
  temperature: {
    fontSize: 64,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  conditionSmallText: {
    fontSize: 18,
    color: "white",
    letterSpacing: 1.25,
    margin: 4,
    fontStyle: "italic",
  },
  conditionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  column: {
    flex: 1,
    alignItems: "center",
  },
  conditionItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  conditionText: {
    marginLeft: 10,
    color: "white",
    fontSize: 20,
  },
  lastupdateContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
});
