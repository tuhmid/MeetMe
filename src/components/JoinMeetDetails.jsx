import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput } from 'react-native';
import Header from '../Header';
import { useNavigation } from '@react-navigation/native';
import styles from '../style';
import * as Location from 'expo-location';

export default function JoinMeetDetails() {
    const navigation = useNavigation();
    const [formData, setFormData] = useState({
      name: '',
      allowLocation: false,
      manualLocation: '',
      userLocation: null,
      loadingLocation: false, // New state to track loading status
    });
  
    useEffect(() => {
      let locationSubscription;
  
      const getLocation = async () => {
        try {
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            console.log('Location permission denied');
            setFormData({ ...formData, allowLocation: false });
          } else {
            setFormData((prevData) => ({ ...prevData, loadingLocation: true }));
            locationSubscription = Location.watchPositionAsync(
              { accuracy: Location.Accuracy.Balanced, timeInterval: 5000 },
              (location) => {
                console.log('Location:', location.coords);
                setFormData((prevData) => ({
                  ...prevData,
                  userLocation: location.coords,
                  loadingLocation: false, // Update loading status
                }));
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
  
      // Navigate to the 'Meet' screen
      navigation.navigate('Meet');
    };
  
    return (
      <View>
        <Header title="Join Meet Details" />
        <View style={styles.container}>
          <Text>This is the Join Meet Details screen.</Text>
  
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
            onPress={() => setFormData({ ...formData, allowLocation: !formData.allowLocation })}
          />
  
          {/* Text input for entering location manually */}
          <TextInput
            style={styles.input}
            placeholder="Enter Location Manually"
            value={formData.manualLocation}
            onChangeText={(text) => setFormData({ ...formData, manualLocation: text })}
          />
  
          {/* Button to navigate to the next screen */}
          <Button title="Next" onPress={handleNext} />
  
          {/* Display current location or loading message */}
          {formData.loadingLocation ? (
            <Text>Loading location...</Text>
          ) : formData.userLocation ? (
            <Text>Current Location: {JSON.stringify(formData.userLocation)}</Text>
          ) : null}
        </View>
      </View>
    );
  }