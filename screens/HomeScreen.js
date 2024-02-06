// import statements for React and necessary components/libraries
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HomeIcon } from 'react-native-heroicons/solid'
import { debounce } from "lodash";
import * as Progress from 'react-native-progress';
import { StatusBar } from 'expo-status-bar';
import { fetchLocations, fetchWeatherForecast } from '../api/weather';
import { getData, storeData } from '../utils/asyncStorage';
import { weatherImages } from '../constants';
import SearchBar from './SearchBar';
import DailyForecast from './DailyForecast';
import Orientation from 'react-native-orientation-locker';

// functional component for the HomeScreen
export default function HomeScreen() {
  // state variables
  const [showSearch, toggleSearch] = useState(false);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [weather, setWeather] = useState({});
  
  // function to handle search input
  const handleSearch = search => {
    if (search && search.length > 2) {
      fetchLocations({ cityName: search }).then(data => {
        setLocations(data);
      });
    }
  };

  // function to handle location selection
  const handleLocation = loc => {
    setLoading(true);
    toggleSearch(false);
    setLocations([]);
    fetchWeatherForecast({
      cityName: loc.name,
      days: '7'
    }).then(data => {
      setLoading(false);
      setWeather(data);
      storeData('city', loc.name);
    });
  };

  // useEffect to fetch weather data on component mount
  useEffect(() => {
    fetchMyWeatherData();
    Orientation.lockToPortrait();

    // Unlock the orientation when the component unmounts
    return () => {
      Orientation.unlockAllOrientations();
    };
  }, []);

  // function to fetch weather data based on stored city or default city (Karachi)
  const fetchMyWeatherData = async () => {
    let myCity = await getData('city');
    let cityName = 'Karachi';
    if (myCity) {
      cityName = myCity;
    }
    fetchWeatherForecast({
      cityName,
      days: '7'
    }).then(data => {
      setWeather(data);
      setLoading(false);
    });
  };

  // debounced version of handleSearch using useCallback
  const handleTextDebounce = useCallback(debounce(handleSearch, 1200), []);

  // destructure location and current from weather object
  const { location, current } = weather;

  // JSX structure for the HomeScreen component
  return (
    <View style={{ flex: 1, position: 'relative' }}>
      <StatusBar style="light" />
      {/* Background Image */}
      <Image blurRadius={70} source={require('../assets/images/bg.png')} style={{ position: 'absolute', width: '100%', height: '100%' }} />
      {loading ? (
        // Loading spinner
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <Progress.CircleSnail thickness={10} size={140} color="#0bb3b2" />
        </View>
      ) : (
        // Main content when not loading
        <SafeAreaView style={{ flex: 1 }}>
          {/* SearchBar component */}
          <SearchBar
            showSearch={showSearch}
            onSearch={handleTextDebounce}
            locations={locations}
            onToggleSearch={toggleSearch}
            onLocationSelect={handleLocation}
          />

          {/* Weather information */}
          <View style={{ marginLeft: 16, marginRight: 16, flex: 1, justifyContent: 'space-between', marginBottom: 8 }}>
            <Text style={{ color: 'white', fontSize: 24, textAlign: 'center', fontWeight: 'bold' }}>
              {/* City and Country */}
              {location?.name}, <Text style={{ fontSize: 16, fontWeight: '600', color: 'gray' }}>{location?.country}</Text>
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              {/* Weather Condition Image */}
              <Image source={weatherImages[current?.condition?.text || 'other']} style={{ width: 120, height: 120 }} />
            </View>
            <View style={{ justifyContent: 'space-between', marginBottom: 8 }}>
              <Text style={{ textAlign: 'center', fontSize: 60, color: 'white', fontWeight: 'bold', marginLeft: 8 }}>
                {/* Current Temperature */}
                {current?.temp_c}&#176;
              </Text>
              <Text style={{ textAlign: 'center', fontSize: 20, color: 'white', fontWeight: '600', marginLeft: 8 }}>
                {/* Current Weather Condition */}
                {current?.condition?.text}
              </Text>
            </View>
            {/* Additional Weather Information */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginLeft: 16, marginRight: 16 }}>
              {/* Wind Speed */}
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image source={require('../assets/icons/wind.png')} style={{ width: 24, height: 24 }} />
                <Text style={{ color: 'white', fontWeight: '600', fontSize: 16, marginLeft: 8 }}>{current?.wind_kph}km</Text>
              </View>
              {/* Humidity */}
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image source={require('../assets/icons/drop.png')} style={{ width: 24, height: 24 }} />
                <Text style={{ color: 'white', fontWeight: '600', fontSize: 16, marginLeft: 8 }}>{current?.humidity}%</Text>
              </View>
              {/* Sunrise Time */}
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image source={require('../assets/icons/sun.png')} style={{ width: 24, height: 24 }} />
                <Text style={{ color: 'white', fontWeight: '600', fontSize: 16, marginLeft: 8 }}>
                  {weather?.forecast?.forecastday[0]?.astro?.sunrise}
                </Text>
              </View>
            </View>
            {/* Daily Forecast */}
            <DailyForecast weather={weather} />
          </View>
        </SafeAreaView>
      )}
    </View>
  );
}
