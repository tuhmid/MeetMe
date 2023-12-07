import React, { useState, useRef } from 'react';
import { View, Text, Button, StyleSheet, TextInput, Alert } from 'react-native';
import Header from '../Header';
import { useNavigation } from '@react-navigation/native';
import styles from '../style';
import { supabase } from '../../db/supabase'; // Adjust the path based on your project structure

export default function JoinMeet() {
  const navigation = useNavigation();
  const [meetCode, setMeetCode] = useState(['', '', '', '']);
  const refs = [useRef(), useRef(), useRef(), useRef()];
  const [meetId, setMeetId] = useState(null); // New state to store the verified meet ID

  const handleDigitInput = (index, text) => {
    const newMeetCode = [...meetCode];
    newMeetCode[index] = text;

    setMeetCode(newMeetCode);

    if (index < 3 && text !== '') {
      // Focus on the next TextInput
      refs[index + 1].current.focus();
    }
  };

  const handleNavigateToJoinMeetDetails = async () => {
    const code = meetCode.join('');

    // Validate code if needed
    if (code.length === 4 && /^\d+$/.test(code)) {
      // Check if the entered meet code exists in the database
      const { data, error } = await supabase
        .from('meetings')
        .select('meetid')
        .eq('meetid', code);

      if (error) {
        console.error('Error checking meet code in the database:', error);
        // Handle the error as needed
        return;
      }

      if (data && data.length > 0) {
        // Set the verified meet ID
        setMeetId(code);

        // Navigate to the 'JoinMeetDetails' screen with the verified meet ID
        navigation.navigate('JoinMeetDetails', { meetId: code });
      } else {
        // Clear the input boxes
        setMeetCode(['', '', '', '']);

        // Alert the user to enter a valid meet code
        Alert.alert('Invalid Meet Code', 'Please enter a valid meet code.');
      }
    } else {
      // Handle invalid input
      Alert.alert('Invalid Meet Code', 'Please enter a valid four-digit numeric meet code.');
    }
  };

  return (
    <View>
      <Header title="Join Meet" />
      <View style={styles.container}>
        <Text>Enter the meet code to join:</Text>
        <View style={styles.inputContainer}>
          {meetCode.map((digit, index) => (
            <TextInput
              key={index}
              style={styles.inputBox}
              keyboardType="numeric"
              maxLength={1}
              value={digit}
              onChangeText={(text) => handleDigitInput(index, text)}
              ref={refs[index]}
            />
          ))}
        </View>
        <Button title="Next" onPress={handleNavigateToJoinMeetDetails} />
      </View>
    </View>
  );
}
