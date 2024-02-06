// import statements for React Native components and external dependencies
import { Text, View, Image, ScrollView } from "react-native";
import { CalendarDaysIcon} from 'react-native-heroicons/solid'
import { theme } from '../theme';
import { weatherImages } from '../constants';
import { StyleSheet } from "react-native";
// functional component for displaying daily weather forecast

export default function DailyForeCast({weather}) {

  
    return(
        <View>
           {/* Section for displaying daily forecast */}
              <View className="mb-2 space-y-3">
                <View className="flex-row items-center mx-5 space-x-2">
                  <CalendarDaysIcon size="22" color="white" />
                  <Text className="text-white text-base">Daily forecast</Text>
                </View>

                {/* Horizontal ScrollView for daily forecast items */}
                <ScrollView   
                  horizontal
                  contentContainerStyle={{paddingHorizontal: 15}}
                  showsHorizontalScrollIndicator={false}
                >
                   {/* Mapping through each day's forecast data */}
                  {
                    weather?.forecast?.forecastday?.map((item,index)=>{
                      // Extracting day name from the date
                      const date = new Date(item.date);
                      const options = { weekday: 'long' };
                      let dayName = date.toLocaleDateString('en-US', options);
                      dayName = dayName.split(',')[0];

                      // Displaying each day's forecast information
                      return (
                        <View 
                          key={index} 
                          className="flex justify-center items-center w-24 rounded-3xl py-3 space-y-1 mr-4" 
                          style={{backgroundColor: theme.bgWhite(0.15)}}
                        >
                           {/* Weather condition icon */}
                          <Image 
                            // source={{uri: 'https:'+item?.day?.condition?.icon}}
                            source={weatherImages[item?.day?.condition?.text || 'other']}
                              className="w-11 h-11" />
                          <Text className="text-white">{dayName}</Text>
                          <Text className="text-white text-xl font-semibold">
                            {item?.day?.avgtemp_c}&#176;
                          </Text>
                        </View>
                      )
                    })
                  }
                  
                </ScrollView>
              </View>
              
        </View>
    );
}
