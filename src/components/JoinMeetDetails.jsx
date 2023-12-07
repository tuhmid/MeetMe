import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, Alert } from 'react-native';
import Header from '../Header';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../../db/supabase'; // Adjust the path based on your project structure
import styles from '../style';

export default function JoinMeetDetails({ route }) {
  const navigation = useNavigation();
  const { meetId } = route.params;
  const [formData, setFormData] = useState({
    name: '',
    allowLocation: false,
    manualLocation: '',
    userLocation: null,
  });

  useEffect(() => {
    let locationSubscription;

    const getLocation = async () => {
      try {
        // ... (unchanged code for requesting location permission)
      } catch (error) {
        console.error('Error requesting location permission:', error);
      }
    };

    if (formData.allowLocation) {
      getLocation();
    }

    // return () => {
    //   // if (locationSubscription) {
    //   //   locationSubscription.remove();
    //   // }
    // };
  }, [formData.allowLocation]);

  const handleNext = async () => {
    if (!formData.allowLocation && formData.manualLocation === '') {
      Alert.alert('Invalid Input', 'Please enable location or enter a manual location.');
      return;
    }
  
    try {
      // Fetch the existing data for the specific meetId
      const { data: existingData, error: fetchError } = await supabase
        .from('meetings')
        .select('users')
        .eq('meetid', meetId)
        .single();
  
      if (fetchError) {
        throw fetchError;
      }
  
      // Extract the existing users array or initialize it if it doesn't exist
      const existingUsers = existingData && existingData.users ? existingData.users : [];
  
      // Create an object with 'users' property
      const newUser = {
        name: formData.name,
        location: formData.allowLocation ? formData.userLocation : formData.manualLocation,
      };
  
      // Add the new user to the existing users array
      const updatedUsers = [...existingUsers, newUser];
  
      // Update the specific meetId row in the database with the updated users array
      const { data: updateData, error: updateError } = await supabase
        .from('meetings')
        .update({
          users: updatedUsers,
        })
        .eq('meetid', meetId);
  
      if (updateError) {
        throw updateError;
      }
  
      // Log the response from Supabase (for demonstration purposes)
      console.log('Updated Data:', updateData);
  
      // Navigate to the 'Meet' screen
      navigation.navigate('Meet');
    } catch (error) {
      console.error('Error updating data in Supabase:', error);
    }
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
        {formData.userLocation && (
          <Text>Current Location: {JSON.stringify(formData.userLocation)}</Text>
        )}
      </View>
    </View>
  );
}
