// CreateMeet.js
import React, { useState } from 'react';
import { View, Text, Button, FlatList } from 'react-native';
import Header from '../Header';
import { useNavigation } from '@react-navigation/native';
import styles from '../style';

export default function CreateMeet() {
  const navigation = useNavigation();

  const [meetID, setMeetID] = useState('12345'); // Replace with actual logic to generate MeetID
  const [invitees, setInvitees] = useState([]); // List of invitees with { name, location, connected }

  const handleNavigateToMeet = () => {
    navigation.navigate('Meet');
  };

  // Dummy data for testing
  const dummyInvitees = [
    { id: '1', name: 'John Doe', location: 'New York', connected: true },
    { id: '2', name: 'Jane Doe', location: 'Los Angeles', connected: false },
    // Add more invitees as needed
  ];

  // Add dummy invitees to state on component mount (useEffect)
  useState(() => {
    setInvitees(dummyInvitees);
  }, []);

  return (
    <View>
      <Header title="Create Meet" />
      <View style={styles.container}>
        <Text>Your MeetID is {meetID}</Text>
        <Button title="Navigate to Meet" onPress={handleNavigateToMeet} />

        <Text style={styles.inviteesTitle}>Invitees:</Text>
        <FlatList
          data={invitees}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.inviteeItem}>
              <Text>{item.name}</Text>
              <Text>{item.location}</Text>
              <Text>{item.connected ? 'Connected' : 'Not Connected'}</Text>
            </View>
          )}
        />
      </View>
    </View>
  );
}

