import React, { useState, useRef } from 'react';
import { View, Text, Button, StyleSheet, TextInput } from 'react-native';
import Header from '../Header';
import { useNavigation } from '@react-navigation/native';
import styles from '../style';

export default function JoinMeet() {
  const navigation = useNavigation();
  const [meetCode, setMeetCode] = useState(['', '', '', '']);
  const refs = [useRef(), useRef(), useRef(), useRef()];

  const handleDigitInput = (index, text) => {
    const newMeetCode = [...meetCode];
    newMeetCode[index] = text;

    setMeetCode(newMeetCode);

    if (index < 3 && text !== '') {
      // Focus on the next TextInput
      refs[index + 1].current.focus();
    }
  };

  const handleNavigateToJoinMeetDetails = () => {
    const code = meetCode.join('');

    // Validate code if needed
    if (code.length === 4 && /^\d+$/.test(code)) {
      navigation.navigate('JoinMeetDetails', { meetCode: code });
    } else {
      // Handle invalid input
      alert('Please enter a valid four-digit numeric meet code.');
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


