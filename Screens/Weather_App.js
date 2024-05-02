import React , {useEffect, useState} from 'react'
import { View , Text , StyleSheet , ImageBackground , Dimensions, ScrollView, Image, TouchableOpacity} from 'react-native'
import { format } from 'date-fns';
import { useNavigation , useRoute } from '@react-navigation/native';

const WeatherApp = () => {

const navigation = useNavigation();
const route = useRoute();
const location = route.params?.location;

const [weather, setWeather] = useState(null);
const [error, setError] = useState('');
const [forecasts, setForecast] = useState(null);

const API_KEY = '71ced1189a124a88a7093942241504';
const BASE_URL = 'https://api.weatherapi.com/v1/current.json'
const FORECAST_URL = 'https://api.weatherapi.com/v1/forecast.json'



useEffect(() => {
  if(location != '') {
    console.log("Location received in WeatherApp:", location);
    getWeather(location)
  }
}, [location])

const getWeather = async (location) => {
    try {
      console.log("Inside Get Weather function");
      // console.log("Location received in WeatherApp:", location);
      const response = await fetch(`${BASE_URL}?q=${location}&key=${API_KEY}`);
      const forecast_response = await fetch(`${FORECAST_URL}?q=${location}&days=1&key=${API_KEY}`);
      data = await response.json()
      forecast_data  = await forecast_response.json()
      // console.log("Weather",data)
      // console.log("Forecast_data", forecast_data)
      setWeather(data);
      setForecast(forecast_data);
      setError('');
    } catch (error) {
      setError('Error fetching weather data. Please try again.');
      setWeather(null);
      setForecast(null);
    }
  };

    return (
   
      <ImageBackground
      source={require('../sky.jpg')}
      style={styles.background}
      > 
        <View style={styles.container}>
        <View style={styles.searchIconContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('LocationsScreen')} >
        <Image source={require('../search_icon.png')} style={styles.searchIcon}/>
        </TouchableOpacity>
        </View>

        <View>
        <Text style={styles.locationText}>{location}</Text>
        </View>

        {weather && (
          <View style={styles.weatherContainer}>
          <Image 
          source={{uri: 'https://'+weather.current.condition.icon}}
          style={styles.weatherIcon}/>
          <Text style={styles.weatherText}>{weather.current.temp_c}°C</Text>
          <Text style={styles.descText}>{weather.current.condition.text}</Text> 
          <ScrollView horizontal={true} contentContainerStyle={styles.scrollContainer}>
  {forecasts && forecasts.forecast.forecastday && forecasts.forecast.forecastday.map(day => (
    day.hour.map((hour, index) => (
      <View key={index} style={styles.forecastHour}>
        <Image
              source={{ uri: 'https://' + hour.condition.icon }}
              style={styles.weatherIcon}
            />
        <Text style={styles.scrollTime}>{format(new Date(hour.time), "hh:mm")}</Text>
        <Text style={styles.scrollTemp}>{hour.temp_c}°C</Text>
        <Text style={styles.scrollFeelslike}>Feels Like</Text>
        <Text style={styles.scrollText}>{hour.feelslike_c}°C</Text>
        {/* Add more data rendering here if needed */}
      </View>
    ))
  ))}
</ScrollView>
          </View> 
        )}
        {error !== '' && <Text style={styles.errorText}>{error}</Text>}
      </View>
      </ImageBackground>
    )
}

const styles = StyleSheet.create({
  background:{
    flex: 1,
    resizeMode: 'cover',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,

  },
    container: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'center',
      paddingHorizontal: 15,
      paddingVertical : 20 
    },
    input: {
      width: '87%',
      height: 40,
      borderColor: 'white',
      borderWidth: 1,
      marginBottom: 20,
      paddingHorizontal: 10,
      paddingVertical : 5,
      color: 'white',
      fontSize : 17 ,
      fontWeight :'500'
    },
    weatherContainer: {
      marginTop: 20,
      alignItems : 'center',
      marginBottom: 10,
      minHeight: 100
    },
    weatherText: {
      fontSize: 50,
      marginBottom: 10,
      color : 'black'
    },
    locationText:
    {
      fontSize: 35,
      fontWeight : '600',
      fontStyle: 'italic',
      color: 'white',
    },
    descText:{
      fontSize: 30,
      marginBottom: 10,
      color : 'black'
    },
    searchIconContainer: {
      position: 'absolute',
      top: 20,
      right: 20,
    },
    searchIcon: {
      width: 30, 
      height: 30, 
    },
    scrollContainer:{
      //flex:1,
      flexDirection:'row',
      paddingHorizontal : 10,
    },
    scrollTime:{
      fontSize: 15,
      fontWeight: '600'
    },
    scrollTemp:{
      fontSize: 24,
      fontWeight : 'bold'
    },
    scrollText:{
      fontSize: 17,
      fontWeight: '900'
    },
    scrollFeelslike:{
      fontSize: 13,
      fontWeight: '500'
    },
    forecastHour:{
      marginRight: 10 ,
      alignItems: 'center'
    },
    errorText: {
      fontSize: 16,
      color: 'red',
      marginTop: 20,
    },
    weatherIcon: {
      width: 50,
      height: 50,
    }
  });

export default WeatherApp;