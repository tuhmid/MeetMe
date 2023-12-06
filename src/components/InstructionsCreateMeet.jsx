import React from 'react';
import { View, Text, Button } from 'react-native';
import Header from '../Header';
import styles from '../style';

export default function InstructionsCreateMeet({ navigation }) {
  const handleNext = () => {
    navigation.navigate('CreateMeetDetails');
  };

  return (
    <View>
      <Header title="Create Meet Instructions" />
      <View style={styles.container}>
        <Text>Follow these instructions to create a meet:</Text>
        {/* Add specific instructions here */}
        <Button title="Next" onPress={handleNext} />
      </View>
    </View>
  );
}

