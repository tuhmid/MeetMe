import React, { useState, useEffect } from 'react'
import { View, Text, Button, TextInput, Alert, FlatList } from 'react-native'
import Header from '../Header'
import * as Location from 'expo-location'

import { useNavigation, useRoute } from '@react-navigation/native'
import { supabase } from '../../db/supabase'
import styles from '../style'

export default function JoinMeetDetails() {
  const navigation = useNavigation()
  const route = useRoute()
  const { meetId } = route.params

  const [formData, setFormData] = useState({
    name: '',
    allowLocation: false,
    manualLocation: '',
    userLocation: null,
  })

  const [meetUsers, setMeetUsers] = useState([])

  useEffect(() => {
    let locationSubscription

    const getLocation = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync()
        if (status !== 'granted') {
          console.log('Location permission denied')
          setFormData({ ...formData, allowLocation: false })
        } else {
          locationSubscription = Location.watchPositionAsync(
            { accuracy: Location.Accuracy.Balanced, timeInterval: 5000 },
            (location) => {
              setFormData((prevData) => ({
                ...prevData,
                userLocation: location.coords,
              }))
            }
          )
        }
      } catch (error) {
        console.error('Error requesting location permission:', error)
      }
    }

    if (formData.allowLocation) {
      getLocation()
    }

    // Fetch users with the same meetId from the database
    const fetchMeetUsers = async () => {
      try {
        const { data, error } = await supabase
          .from('meetings')
          .select('*')
          .eq('meetid', meetId)

        if (error) {
          console.error('Error fetching meet users:', error)
          // Handle the error as needed
        } else {
          setMeetUsers(data)
        }
      } catch (error) {
        console.error('Error fetching meet users:', error)
      }
    }

    fetchMeetUsers()

    // Cleanup function
    return () => {
      if (locationSubscription) {
        locationSubscription.remove()
      }
    }
  }, [formData.allowLocation, meetId])

  const handleNext = async () => {
    if (!formData.allowLocation && formData.manualLocation === '') {
      Alert.alert('Invalid Input', 'Please enable location or enter a manual location.')
      return
    }
  
    try {
      const userData = {
        users: {
          name: formData.name,
          location: formData.allowLocation ? formData.userLocation : formData.manualLocation,
        },
        allowlocation: formData.allowLocation,
        manuallocation: formData.manualLocation,
        meetid: meetId,
      }
  
      // Insert data into your Supabase table
      const { data, error } = await supabase
        .from('meetings')
        .insert([userData])
  
      if (error) {
        throw error
      }
  
      console.log('Inserted Data:', data)
  
      // Navigate to the 'Meet' screen
      navigation.navigate('Meet')
    } catch (error) {
      console.error('Error inserting data to Supabase:', error)
    }
  }

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

        {/* Display current location */}
        {formData.userLocation && (
          <Text>Current Location: {JSON.stringify(formData.userLocation)}</Text>
        )}

        {/* Display users with the same meetId */}
        <Text>Users in this Meet:</Text>
        <FlatList
  data={meetUsers}
  keyExtractor={(item) => item.id.toString()}
  renderItem={({ item }) => (
    <View>
      <Text>Name: {item.users.name}</Text>
      <Text>Location: {JSON.stringify(item.users.location)}</Text>
    </View>
  )}
/>
      </View>
    </View>
  )
}
