import React, { useState, useEffect } from "react";
import Geolocation from "react-native-geolocation-service";
import { View, Text,  PermissionsAndroid, ActivityIndicator } from "react-native";
import MapView, {Marker, Polyline, AnimatedRegion} from "react-native-maps";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


//위치 접근 권한 받기
async function requestPermission() {
  try {
    return await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
  }catch(e) {
    console.log(e);
  }
}

function App() {

  const [latitude, setLatitude] = useState(null)
  const [longitude, setLongitude] = useState(null)
  const route = [];
  useEffect(() => {
    requestPermission().then(result => {
      console.log({result});
      if(result === "granted") {
        const _watchId = Geolocation.watchPosition(
          position => {
            const {latitude, longitude} = position.coords;
            setLatitude(latitude);
            setLongitude(longitude);
            route.push({latitude: latitude, longitude: longitude});
            
          },
          error => {
            console.log(error);
          },
          {
            enableHighAccuracy: true,
            distanceFilter: 0,
            interval: 3000,
            fastestInterval: 2000,
          },
        );
    
        return () => {
          if(_watchId) {
            Geolocation.clearWatch(_watchId);
          }
        }
      }
    });
  }, []);
  
  if(!latitude && !longitude) {
    return (
      <View style={{ flex: 1 }}>
        <Text style={{ flex: 1 }}>Loading...</Text>
      </View>
    );
  }

  return (
      <View style={{ flex: 1 }}>
        <MapView
          style={{ flex: 1, width:'100%', height:'100%' }}
          initialRegion={{
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
        >
          <Marker
            coordinate= {{latitude: latitude, longitude: longitude}}
          />

          <Polyline coordinates={route} strokeColor="#000" strokeColors={['#7F0000']} strokeWidth={5}/>
      
        </MapView>
      </View>
  );
}

export default App;
