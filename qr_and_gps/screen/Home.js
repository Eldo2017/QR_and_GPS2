// screen/Home.js
import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import LocationTracker from '../components/Map/LocationTracker';

export default function Home() {
  return (
    <SafeAreaView style={styles.container}>
      <LocationTracker />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
