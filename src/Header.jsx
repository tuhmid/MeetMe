import React from 'react';
import { View, Text } from 'react-native';
import styles from './style';

export default function Header({ title }) {
  return (
    <View style={styles.header}>
      <Text style={styles.headerText}>{title}</Text>
    </View>
  );
}

