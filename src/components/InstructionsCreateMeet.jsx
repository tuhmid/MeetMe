import React from 'react'
import { View, Text, Button } from 'react-native'
import Header from '../Header'
import styles from '../style'

export default function InstructionsCreateMeet({ navigation }) {
  const handleNext = () => {
    navigation.navigate('CreateMeetDetails')
  }

  return (
    <View>
      <Header title="Create Meet Instructions" />
      <View style={styles.container}>
        <Text>Follow these instructions to create a meet:</Text>

        {/* Specific instructions */}
        <Text>1. Click the Start a New Meet button!</Text>
        <Text>2. Invite your friends via your individualized MeetID or link.</Text>
        <Text>3. Add your location manually or with your location feature. Invitees will be asked to do the same.</Text>
        <Text>4. Select criteria for the midpoint.</Text>

        <Button title="Next" onPress={handleNext} />
      </View>
    </View>
  )
}
