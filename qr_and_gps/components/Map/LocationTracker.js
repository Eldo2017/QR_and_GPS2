// components/Map/LocationTracker.js
import React, { useState } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

const window = Dimensions.get('window');

export default function LocationTracker() {
  const [region, setRegion] = useState(null);
  const [marker, setMarker] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  // ✅ 내 현재 위치로 이동
  const getCurrentLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('위치 권한이 거부되었습니다.');
      return;
    }

    const loc = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = loc.coords;

    setRegion({
      latitude,
      longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
    setMarker({
      latitude,
      longitude,
      title: '현재 위치',
    });

    setErrorMsg(null);
  };

  // ✅ 주소(잠실동) 기반 지도 이동
  const geocodeAddress = async () => {
    const address = '서울특별시 송파구 잠실동 40-1';
    try {
      const results = await Location.geocodeAsync(address);
      if (results.length > 0) {
        const { latitude, longitude } = results[0];

        setRegion({
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });

        setMarker({
          latitude,
          longitude,
          title: address,
        });

        setErrorMsg(null);
      }
    } catch (e) {
      setErrorMsg('주소 → 좌표 변환 실패');
      console.error('지오코딩 실패:', e);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📍 위치 기반 지도 보기</Text>

      <View style={styles.buttonWrap}>
        <Button title="현재 위치로 이동" onPress={getCurrentLocation} />
      </View>
      <View style={styles.buttonWrap}>
        <Button title="주소 → 지도 보기" onPress={geocodeAddress} />
      </View>

      {errorMsg && <Text style={styles.error}>{errorMsg}</Text>}

      {region ? (
        <MapView style={styles.map} region={region}>
          {marker && (
            <Marker coordinate={marker} title={marker.title || '위치'} />
          )}
        </MapView>
      ) : (
        <ActivityIndicator style={{ marginTop: 30 }} size="large" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
    paddingHorizontal: 20,
    flex: 1,
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 15,
    fontWeight: 'bold',
  },
  buttonWrap: {
    marginBottom: 10,
  },
  map: {
    width: window.width,
    height: 400,
    marginTop: 20,
  },
  error: {
    color: 'red',
    marginTop: 15,
    textAlign: 'center',
  },
});
