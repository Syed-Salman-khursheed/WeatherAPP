// SearchBar.js
import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { MagnifyingGlassIcon, XMarkIcon } from 'react-native-heroicons/outline';
import { HomeIcon} from 'react-native-heroicons/solid'
import { MapPinIcon } from 'react-native-heroicons/solid';
import { debounce } from "lodash";
import { theme } from '../theme';

// SearchBar component for handling city search and selection
export default function SearchBar({ showSearch, onSearch, locations, onToggleSearch, onLocationSelect }) {

  // Debounced function for handling text input changes
  const handleTextChange = useCallback(debounce(onSearch, 1200), []);

  // JSX structure for the SearchBar component
  return (
    <View style={{ height: '7%' }} className="mx-4 relative z-50">
      <View
        className="flex-row justify-end items-center rounded-full"
        style={{ backgroundColor: showSearch ? theme.bgWhite(0.2) : 'transparent' }}
      >
        {/* Text input for city search */}
        {showSearch ? (
          <TextInput
            onChangeText={handleTextChange}
            placeholder="Search city"
            placeholderTextColor={'lightgray'}
            className="pl-6 h-10 pb-1 flex-1 text-base text-white"
          />
        ) : null}

        {/* Toggle button for showing/hiding search */}
        <TouchableOpacity
          onPress={() => onToggleSearch(!showSearch)}
          className="rounded-full p-3 m-1"
          style={{ backgroundColor: theme.bgWhite(0.3) }}
        >
          {showSearch ? <XMarkIcon size="25" color="white" /> : <MagnifyingGlassIcon size="25" color="white" />}
        </TouchableOpacity>

        {/* Home button for selecting default location (Karachi) */}
        <TouchableOpacity
            onPress={() => onLocationSelect({"country": "Pakistan", "id": 1906565, "lat": 24.87, "lon": 67.05, "name": "Karachi", "region": "Sindh", "url": "karachi-sindh-pakistan"})}
            style={{
              
              left: 5,
              backgroundColor: 'rgba(192, 192, 192, 0.3)',
              padding: 15,
              borderRadius: 50,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <HomeIcon size={24} color="black" />
          </TouchableOpacity>
      </View>

      {/* Display search results if available */}
      {locations.length > 0 && showSearch ? (
        <View className="absolute w-full bg-gray-300 top-16 rounded-3xl">
          {locations.map((loc, index) => {
            const showBorder = index + 1 !== locations.length;
            const borderClass = showBorder ? ' border-b-2 border-b-gray-400' : '';

              // Displaying each location result as a selectable item
            return (
              <TouchableOpacity
                key={index}
                onPress={() => {console.log(loc),onLocationSelect(loc)}}
                className={"flex-row items-center border-0 p-3 px-4 mb-1 " + borderClass}
              >
                <MapPinIcon size="20" color="gray" />
                <Text className="text-black text-lg ml-2">{loc?.name}, {loc?.country}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ) : null}
    </View>
  );
}
