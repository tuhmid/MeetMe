import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, StyleSheet, Alert } from 'react-native';
import Header from '../Header';
import { useNavigation } from '@react-navigation/native';
import { RadioButton } from 'react-native-paper';
import * as Location from 'expo-location';
import styles from '../style';
import db from '@react-native-firebase/database'

export default function CreateMeetDetails() {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    name: '',
    allowLocation: false,
    manualLocation: '',
    travelTimeOption: '',
    userLocation: null,
  });

  useEffect(() => {
    let locationSubscription;

    const getLocation = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'Permission Denied',
            'You need to grant location permission to use this feature.'
          );
          setFormData({ ...formData, allowLocation: false });
        } else {
          // Start watching for location updates
          locationSubscription = Location.watchPositionAsync(
            { accuracy: Location.Accuracy.Balanced, timeInterval: 5000 },
            (location) => {
              // Update the user's location in the state
              setFormData((prevData) => ({
                ...prevData,
                userLocation: location.coords,
              }));

              // Log the location data to the console whenever it changes
              console.log('Location:', location.coords);
            }
          );
        }
      } catch (error) {
        console.error('Error requesting location permission:', error);
      }
    };

    if (formData.allowLocation) {
      getLocation();
    }

    return () => {
      // Stop watching for location updates when the component unmounts or allowLocation changes
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, [formData.allowLocation]);

  const handleNext = () => {


    
    // Perform any necessary actions with the collected data
    // For example, you can save the data to state or send it to an API

    // Log the collected data to the console (for demonstration purposes)
    console.log('Collected Data:', formData);

    // Navigate to the 'CreateMeet' screen
    navigation.navigate('CreateMeet');
  };

  return (
    <View>
      <Header title="Create Meet Details" />
      <View style={styles.container}>
        <Text>This is the Create Meet Details screen.</Text>

        {/* Text input for Name/Screenname */}
        <TextInput
          style={styles.input}
          placeholder="Name/Screenname"
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
        />

        {/* Button to allow location */}
        <Button
          title={formData.allowLocation ? 'Location Allowed' : 'Allow Location'}
          onPress={() => {
            setFormData({ ...formData, allowLocation: !formData.allowLocation });
          }}
        />

        {/* Text input for entering location manually */}
        <TextInput
          style={styles.input}
          placeholder="Enter Location Manually"
          value={formData.manualLocation}
          onChangeText={(text) => setFormData({ ...formData, manualLocation: text })}
        />

        {/* Radio buttons for travel time options */}
        <RadioButton.Group
          onValueChange={(value) => setFormData({ ...formData, travelTimeOption: value })}
          value={formData.travelTimeOption}
        >
          <View>
            <RadioButton.Item label="Minimize everyone’s travel time" value="minimizeTravelTime" />
            <RadioButton.Item label="Everyone has similar travel times" value="similarTravelTimes" />
          </View>
        </RadioButton.Group>

        {/* Button to navigate to the next screen */}
        <Button title="Next" onPress={handleNext} />

        {/* Display current location */}
        {formData.userLocation && (
          <Text>Current Location: {JSON.stringify(formData.userLocation)}</Text>
        )}
      </View>
    </View>
  );
}

