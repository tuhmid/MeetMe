import React, { useState, useEffect } from 'react'
import { View, Text, Button, FlatList } from 'react-native'
import Header from '../Header'
import { useNavigation, useRoute } from '@react-navigation/native'
import { supabase } from '../../db/supabase' // Adjust the path based on your project structure
import styles from '../style'

export default function CreateMeet() {
  const navigation = useNavigation()
  const route = useRoute()

  const [meetID, setMeetID] = useState(null)
  const [invitees, setInvitees] = useState([])

  useEffect(() => {
    // Retrieve meetId from the route parameters
    const { meetId } = route.params
    setMeetID(meetId)

    // Fetch invitees based on the meetId from your Supabase database
    const fetchInvitees = async () => {
      try {
        // Make a request to the 'meetings' table where meetid equals the provided meetId
        const { data, error } = await supabase
          .from('meetings')
          .select('users') // Assuming the users are stored under 'users' property
          .eq('meetid', meetId)

        if (error) {
          throw error
        }

        // Log the response from Supabase (for debugging purposes)
        console.log('Supabase Response:', data)

        // Extract the 'users' array from the data, handling the case where it's null
        const usersArray = data && data.users ? data.users : []

        // Log the extracted users array (for debugging purposes)
        console.log('Users Array:', usersArray)

        // Set the invitees state with the retrieved data
        setInvitees(usersArray)
      } catch (error) {
        console.error('Error fetching invitees:', error)
      }
    }

    fetchInvitees()
  }, [route.params])

  const handleNavigateToMeet = () => {
    navigation.navigate('Meet')
  }

  return (
    <View>
      <Header title="Create Meet" />
      <View style={styles.container}>
      <Text>Your MeetID is {meetID}</Text>
        <Button title="Navigate to Meet" onPress={handleNavigateToMeet} />

        <Text style={styles.inviteesTitle}>Invitees:</Text>
        <FlatList
          data={invitees}
          keyExtractor={(item) => item.id.toString()} // Assuming 'id' is a unique identifier
          renderItem={({ item }) => (
            <View style={styles.inviteeItem}>
              <Text>{item.name}</Text>
              <Text>Latitude: {item.location.latitude}</Text>
              <Text>Longitude: {item.location.longitude}</Text>
              <Text>{item.connected ? 'Connected' : 'Not Connected'}</Text>
            </View>
          )}
        />
      </View>
    </View>
  )
}