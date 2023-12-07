import React from 'react'
import { View, Text, Button, StyleSheet } from 'react-native'
import Header from '../Header'
import styles from '../style'

export default function HomePage({ navigation }) {
  return (
    <View>
      <Header title="Home Page" />
      <View style={styles.container}>
        <Text>Welcome to MeetMe!</Text>
        <Button
          title="Create a Meet"
          onPress={() => navigation.navigate('InstructionsCreateMeet')}
        />
        <Button
          title="Join a Meet"
          onPress={() => navigation.navigate('JoinMeet')}
        />
      </View>
    </View>
  )
}




