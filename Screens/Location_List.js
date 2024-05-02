import React , {useEffect, useState} from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, 
  Modal, Dimensions , TextInput, Button } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import Icon from 'react-native-vector-icons/FontAwesome';
import WeatherApp from './Weather_App';

const LocationsScreen = () => {

  const [locations, setLocation] = useState(['Chennai']);
  const [modalVisible, setModalVisible ] = useState(false);
  const [searchCities, setSearchCities] = useState('');
  const [suggestions , setSuggestions] = useState(['']);

//Whenever value of searchCities changes useEffect will be executed .. 
useEffect(() => {
  if(searchCities)
  {
    fetchCities();
  }
}, [searchCities])

useEffect(() => {
  const retrieveLocations = async () => {
    try {
      const storedLocations = await AsyncStorage.getItem('locations');
      if (storedLocations !== null) {
        setLocation(JSON.parse(storedLocations));
      }
    } catch (error) {
      console.error('Error retrieving locations from AsyncStorage:', error);
    }
  };

  retrieveLocations();
 
} ,[])

const navigation = useNavigation();

const fetchCities = async () => {
  try 
  {
  console.log("Inside fetchCities function");
  const citiesResponse = await fetch('https://countriesnow.space/api/v0.1/countries');
  citiesData = await citiesResponse.json()
  //console.log("CitiesData", citiesData)
  if(citiesData && citiesData.data)
  {
      const citiesList = citiesData.data.map(country => country.cities).flat();
     //console.log(citiesList);
     const filterCities = citiesList.filter(city => city.toLowerCase().includes(searchCities.toLowerCase()));
     setSuggestions(filterCities);
  }
  }
  catch (error) {
    console.error("Error while fetching Cities Drop Down", error)
  }
}

const handleAddLocation = () => {
  if (searchCities)
  {
  setLocation(prevLocations => [...prevLocations, searchCities]);
  saveLocations([...locations, searchCities]);
  setModalVisible(false); 
  }
  else{
    setModalVisible(true); 
  }
 
}

const navigate_to_weather_app = (loc) => {
  console.log("Navigating to WeatherApp with location:", loc);
  navigation.navigate('WeatherApp', { location: loc });
  };


const saveLocations = async (updatedLocations) => {
  try {
    await AsyncStorage.setItem('locations' , JSON.stringify(updatedLocations));
  }
  catch (error) {
    console.error('Error saving locations to AsyncStorage', error)
  }
}

const deleteLocation = async (locationToDelete) => {
  // Filter out the location to be deleted
  const updatedLocations = locations.filter(loc => loc !== locationToDelete);
  // Update the state
  setLocation(updatedLocations);
  
  try {
    // Update AsyncStorage
    await AsyncStorage.setItem('locations', JSON.stringify(updatedLocations));
  } catch (error) {
    console.error('Error saving locations to AsyncStorage', error);
  }
};

  return (
    <ImageBackground
      source={require('../sky.jpg')}
      style={styles.background}
      > 
    <View style={styles.container}> 
       
          {
            locations.map( (loc, index) => (
              <TouchableOpacity 
              key={index} 
              style={styles.locationContainer} 
              onPress={() => navigate_to_weather_app(loc)}>
              <Text style={styles.locationText}>{loc.toUpperCase()}</Text>

              <TouchableOpacity onPress={() => deleteLocation(loc)}>
                 <Icon name="trash-o" size={20} color="red"/>
              </TouchableOpacity>
           
          </TouchableOpacity>
        
          ))
          }
      
        <TouchableOpacity style={styles.addButton} onPress={() => (setModalVisible(true))}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
        {/* Modal View */}
        <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={()=> setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}> 
            <TouchableOpacity
        style={[styles.closeButton, { top: 10, right: 10 }]}
        onPress={() => setModalVisible(false)}
      >
        <Icon name='times' size={15} color="red" />
      </TouchableOpacity>
              <Text style={styles.modalTitle}>Add Cities</Text>

              <TextInput 
              style={styles.searchCitiesContainer}
              placeholder='Search City'
              value={searchCities}
              placeholderTextColor={'white'}
              fontSize = {18}
              onChangeText={text => setSearchCities(text)}
              />

              <FlatList
              data={suggestions}
              keyExtractor={(item,index) => index.toString()}
              renderItem={({item}) => (
                <TouchableOpacity style={styles.suggestionItem} onPress={() => {
                  setSearchCities(item)
                  setSuggestions(['']) }}>
                  <Text style={styles.suggestionText}>{item}</Text>
                </TouchableOpacity>
              )}/>
               <TouchableOpacity
  style={[styles.addButtonContainer, { backgroundColor: 'gray' }]} // Change background color here
  onPress={handleAddLocation}
>
  <Text style={styles.buttonText}>Add</Text>
</TouchableOpacity>
                
            </View> 
          </View>
        </Modal>

      </View>
      </ImageBackground>           
  );
};

const styles = StyleSheet.create (
  {
    background:{
      flex: 1,
      resizeMode: 'cover',
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
  
    },
    container:{
      flex:1,
      justifyContent:'flex-start',
      alignItems:'center',
      padding : 35
    },
    addButton:{
      height:80,
      width:80,
      borderRadius:20,
      backgroundColor : 'plum',
      justifyContent:'center',
      alignItems:'center',
      bottom : 70,
      right: 40,
      position: 'absolute' // It will put the + symbol to bottom right corner
    },
    addButtonText:{
      fontSize: 50,
      color: 'black',
    },
    locationContainer: {
      width: '110%' ,
      backgroundColor: '#cce6ff',
      // padding: 30,
      borderRadius: 10,
      marginBottom: 30,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 15, // Adjusted padding vertically
      paddingHorizontal: 20, // Adjusted padding horizontally
    },
    locationText: {
      fontSize: 18,
      fontWeight: '600',
      color: '#483D8B',
    },
    modalContainer:{
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent:{
      backgroundColor: '#F0FFFF',
      padding: 20,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      width: '100%',
      alignItems: 'center',
    },
    modalTitle:{
      fontSize: 20,
      fontWeight: '800',
      marginBottom : 10 
    },
    searchCitiesContainer:{
      width: '100%',
      padding:20,
      backgroundColor: 'gray',
      borderRadius:20
    },
    searchCitiesText:{
     fontSize:20
    },
    suggestionItem: {
      padding: 10,
      borderBottomWidth: 1,
      borderStyle : 'dotted',
      borderBottomColor: 'black',
      width: '100%',
      alignItems: 'center',
    },
    suggestionText: {
      fontSize: 17,
      fontWeight: '400'
    },
    closeButton: {
      position: 'absolute',
      top: 10,
      right: 10,
      zIndex: 1,
    },
    closeButtonText: {
      fontSize: 14,
      fontWeight: 'bold',
      color : 'red'
    },
    addButtonContainer: {
      borderRadius: 20,
      paddingVertical: 10,
      paddingHorizontal: 20,
      backgroundColor: '#cce6ff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: 'white', // Change text color here
    },
    closeButton: {
      position: 'absolute',
      zIndex: 1,
    },
  }
)

export default LocationsScreen;
