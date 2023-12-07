import React, { useState, useEffect } from 'react'
import { View, Text, Button, TextInput, Alert } from 'react-native'
import Header from '../Header'
import { useNavigation } from '@react-navigation/native'
// import { RadioButton } from 'react-native-paper'
import * as Location from 'expo-location'
import { supabase } from '../../db/supabase' // Adjust the path based on your project structure
import styles from '../style'

export default function CreateMeetDetails() {
  const navigation = useNavigation()
  const [formData, setFormData] = useState({
    name: '',
    allowLocation: false,
    manualLocation: '',
    userLocation: null,
  })
  const [meetId, setMeetId] = useState(null) // New state to store meetid

  useEffect(() => {
    let locationSubscription

    const getLocation = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync()
        if (status !== 'granted') {
          Alert.alert(
            'Permission Denied',
            'You need to grant location permission to use this feature.'
          )
          setFormData({ ...formData, allowLocation: false })
        } else {
          // Start watching for location updates
          locationSubscription = Location.watchPositionAsync(
            { accuracy: Location.Accuracy.Balanced, timeInterval: 5000 },
            (location) => {
              // Update the user's location in the state
              setFormData((prevData) => ({
                ...prevData,
                userLocation: location.coords,
              }))

              // Log the location data to the console whenever it changes
              console.log('Location:', location.coords)
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

    // stop watching location
    // return () => {
    //   if (locationSubscription) {
    //     locationSubscription.remove()
    //   }
    // }
  }, [formData.allowLocation])

  

  const generateUniqueMeetId = async () => {
    try {
      // Generate a random four-digit number
      let meetid = Math.floor(1000 + Math.random() * 9000)

      // Check if the generated meetid already exists in the database
      const { data, error } = await supabase
        .from('meetings')
        .select('meetid')
        .eq('meetid', meetid)

      if (error) {
        console.error('Error checking meetid in the database:', error)
        
        return null
      }

      // If a record with the same meetid already exists, regenerate the meetid
      while (data && data.length > 0) {
        meetid = Math.floor(1000 + Math.random() * 9000)

        // Check again if the regenerated meetid exists in the database
        const { newData, newError } = await supabase
          .from('meetings')
          .select('meetid')
          .eq('meetid', meetid)

        if (newError) {
          console.error('Error checking meetid in the database:', newError)
          return null 
        }

        data = newData
      }

      return meetid
    } catch (error) {
      console.error('Error generating meetid:', error)
      return null
    }
  }

  const handleNext = async () => {
    try {
      // Generate a unique four-digit meetid
      const meetid = await generateUniqueMeetId()

      if (!meetid) {
        // Handle the case where meetid generation fails
        return
      }

      // Create an object with a 'users' property and the additional 'meetid'
      const userData = {
        users: {
          name: formData.name,
          location: formData.userLocation,
        },
        allowlocation: formData.allowLocation,
        manuallocation: formData.manualLocation,
        meetid: meetid,
      }

      // Insert data into your Supabase table
      const { data, error } = await supabase
        .from('meetings') // Make sure to use the correct table name here
        .insert([userData])

      if (error) {
        throw error
      }

      // Set the meetid state with the generated meetid
      setMeetId(meetid)

      // Log the response from Supabase (for demonstration purposes)
      console.log('Inserted Data:', data)

      // Navigate to the 'CreateMeet' screen with the meetid parameter
      navigation.navigate('CreateMeet', { meetId })
    } catch (error) {
      console.error('Error inserting data to Supabase:', error)
    }
  }

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
            setFormData({ ...formData, allowLocation: !formData.allowLocation })
          }}
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
      </View>
    </View>
  )
}
