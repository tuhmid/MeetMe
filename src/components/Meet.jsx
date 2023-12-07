import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Header from '../Header';
import styles from '../style';
import { supabase } from '../../db/supabase'; // Adjust the path based on your project structure

export default function Meet() {
  const [meetUsers, setMeetUsers] = useState([]);

  useEffect(() => {
    // Fetch users from Supabase and set them to meetUsers state
    const fetchMeetUsers = async () => {
      try {
        const { data, error } = await supabase
          .from('meetings')
          .select('users')
          // You can add any additional filters or conditions here
          .limit(10); // Limit the number of users fetched for better performance
    
        if (error) {
          console.error('Error fetching meet users:', error);
          return;
        }
    
        // Extract the users array from the data
        const usersArray = data.map(item => item.users);
    
        // Log the extracted users array (for debugging purposes)
        console.log('Meet Users Array:', usersArray);
    
        
        // Set the meetUsers state with the retrieved data
setMeetUsers(data.map(item => item.users));

      } catch (error) {
        console.error('Error fetching meet users:', error);
      }
    };
    

    fetchMeetUsers();
  }, []); // Run this effect only once on component mount

  return (
    <View>
      <Header title="Meet Screen" />
      <View style={styles.container}>
        <Text>This is the Meet screen.</Text>
        
        {/* Display MapView with markers for meetUsers */}
        <MapView
          style={{ flex: 1, height: 400 }}
          initialRegion={{
            latitude: 37.7749, // Replace with your default latitude
            longitude: -122.4194, // Replace with your default longitude
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          {meetUsers.map(user => (
            <Marker
              key={user.name}
              coordinate={{
                latitude: user.location.latitude,
                longitude: user.location.longitude,
              }}
              title={user.name}
            />
          ))}
        </MapView>
      </View>
    </View>
  );
}
