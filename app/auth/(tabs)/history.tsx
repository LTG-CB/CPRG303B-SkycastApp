import React, { useCallback, useEffect, useState } from "react";
import { View, Text, SafeAreaView, Image, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Feather, Entypo } from "@expo/vector-icons";
import { debounce } from "lodash";
import { fetchLocations, fetchHistoricalWeather } from "@/components/api";
import { WeatherCondition, weatherImages } from "@/constants";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Progress from "react-native-progress";

// Define types for Location and Weather data
interface Location {
  name: string;
  country: string;
}

interface Day {
  maxtemp_c: number;
  mintemp_c: number;
  avgtemp_c: number;
  condition: {
    text: WeatherCondition;
    icon: string;
  };
  maxwind_kph: number;
  avghumidity: number;
  uv: number;
  totalprecip_mm: number;
  totalsnow_cm: number;
  moon_phase: string;
}

interface Weather {
  location: {
    name: string;
    country: string;
  };
  day: Day;
};

export default function HomeScreen() {
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [locations, setLocations] = useState<Location[]>([]);
  const [weather, setWeather] = useState<Weather | null>(null);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date());

  const handleLocation = (loc: Location, selectedDate: Date) => {
    setLocations([]);
    setShowSearchBar(false);
    setLoading(true);
    const formattedDate = selectedDate.toISOString().split('T')[0];
    console.log(`Fetching weather data for ${loc.name} on ${formattedDate}`);
    fetchHistoricalWeather({ cityName: loc.name, dt: formattedDate }).then((data) => {
      console.log("Fetched weather data: ", data);
      const weatherData = data.forecast?.forecastday[0]?.day; // Safely access forecastday
      if (weatherData) {
        setWeather({
          location: data.location,
          day: weatherData
        });
      }
      setLoading(false);
    }).catch(error => {
      console.log("Error fetching weather data: ", error);
      setLoading(false);
    });
  };

  const handleSearch = (value: string) => {
    if (value.length > 2) {
      fetchLocations({ cityName: value }).then((data) => setLocations(data));
    }
  };

  const fetchMyWeatherData = async (selectedDate: Date, currentLocation: Location) => {
    setLoading(true);
    const formattedDate = selectedDate.toISOString().split('T')[0];
    console.log(`Fetching weather data for ${currentLocation.name} on ${formattedDate}`);
    fetchHistoricalWeather({ cityName: currentLocation.name, dt: formattedDate }).then((data) => {
      console.log("Fetched weather data: ", data);
      const weatherData = data.forecast?.forecastday[0]?.day; // Safely access forecastday
      if (weatherData) {
        setWeather({
          location: data.location,
          day: weatherData
        });
      }
      setLoading(false);
    }).catch(error => {
      console.log("Error fetching weather data: ", error);
      setLoading(false);
    });
  };

  useEffect(() => {
    if (weather) {
      fetchMyWeatherData(date, weather.location);
    } else {
      fetchMyWeatherData(date, { name: "Calgary", country: "Canada" });
    }
  }, []);

  const handleDebounce = useCallback(debounce(handleSearch, 1000), []);

  const { day, location } = weather || {};

  const onChange = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
    if (location) {
      fetchMyWeatherData(currentDate, location); // Fetch weather data when date changes
    }
  };

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
                      onPress={() => handleLocation(loc, date)}
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

          {/* DATE PICKER SECTION */}
          <View style={styles.datePickerContainer}>            
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode="date"
                display="default"
                onChange={onChange}
              />
          </View>

          {/* LOCATION DETAILS */}
          <View style={styles.locationContainer}>
            <Text style={styles.locationName}>{location?.name},</Text>
            <Text style={styles.locationCountry}> {location?.country}</Text>
          </View>
          {/* IMAGE VIEW */}
          <View style={styles.weatherImageContainer}>
            {day?.condition?.text && (
              <Image
                source={weatherImages[day.condition.text]}
                style={styles.weatherImage}
              />
            )}
          </View>
          {/* TEMPERATURE CELSIUS */}
          <View style={styles.temperatureContainer}>
            <Text style={styles.temperature}>{day?.avgtemp_c}&#176;</Text>
            <Text style={styles.conditionText}>{day?.condition?.text}</Text>
            <Text style={styles.conditionText}>{day?.moon_phase}</Text>
          </View>
          {/* WEATHER CONDITIONS */}          
          <View style={styles.conditionsContainer}>
            <View style={styles.column}>
              <View style={styles.conditionItem}>
                <Feather name="thermometer" size={30} color="white" />
                <Text style={styles.conditionText}>
                  {day?.mintemp_c}&#176;C / {day?.maxtemp_c}&#176;C
                </Text>
              </View>
              <View style={styles.conditionItem}>
                <Feather name="sun" size={30} color="white" />
                <Text style={styles.conditionText}>
                  UV index: {day?.uv}
                </Text>
              </View>
              <View style={styles.conditionItem}>
                <Feather name="wind" size={30} color="white" />
                <Text style={styles.conditionText}>
                  {day?.maxwind_kph} km 
                </Text>
              </View>
            </View>
            <View style={styles.column}>
              <View style={styles.conditionItem}>
                <Entypo name="drop" size={30} color="white" />
                <Text style={styles.conditionText}>{day?.avghumidity}%</Text>
              </View>
              <View style={styles.conditionItem}>
                <Feather name="cloud-snow" size={30} color="white" />
                <Text style={styles.conditionText}>{day?.totalsnow_cm} cm</Text>
              </View>
              <View style={styles.conditionItem}>
                <Feather name="umbrella" size={30} color="white" />
                <Text style={styles.conditionText}>{day?.totalprecip_mm}mm</Text>
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
  datePickerContainer: {
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 10,
    padding: 8,
    fontSize: 28,
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
  datePickerText: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    marginVertical: 10,
  },
});
