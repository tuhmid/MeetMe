import React from 'react'
import { View, Text } from 'react-native'
import Header from '../Header'
import styles from '../style'

export default function Meet() {
  return () => {
    if (locationSubscription) {
      locationSubscription.remove()
    }
  }
  return (
    <View>
      <Header title="Meet Screen" />
      <View style={styles.container}>
        <Text>This is the Meet screen.</Text>
        {/* Add specific details or components for your Meet screen */}
      </View>
    </View>
  )
}

