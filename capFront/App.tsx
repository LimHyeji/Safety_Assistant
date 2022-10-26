import React, { useState, useEffect } from "react";
import Geolocation from "react-native-geolocation-service";
import { View, Text,  PermissionsAndroid, ScrollView } from "react-native";
import MapView, {Marker, Polyline, AnimatedRegion} from "react-native-maps";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import axios from 'axios';

async function requestPermission() {
  try {
    return await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
  }catch(e) {
    console.log(e);
  }
}

interface ILocation {
  latitude: number;
  longitude: number;
}

function App() {

  const [coordinates] = useState([
    {
      latitude: 37.58401068268302,
      longitude: 126.98504333919456,
    },
    {
      latitude: 37.584008349073436,
      longitude: 126.9852000701678,
    },
  ]);

  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchInfo = async () => {
    try {
      setError(null);
      setInfo("");
        
      setLoading(true);
        
      const response = await axios.get(
        'http://taas.koroad.or.kr/data/rest/frequentzone/pedstrians?authKey=%2Buvw8mtEC8SxmORSnCRCjrnB2BDLitKPgiqG4575Ym%2Btu2WpCtx3C25RGKSVuxEb&searchYearCd=2022032&siDo=11&guGun=680'
      );

      setInfo(response.data.data);
    } catch (e) {
      console.log(e);
    }
    // loading 끄기
    setLoading(false);
  };

  const [location, setLocation] = useState<ILocation | undefined>(undefined);
  useEffect(() => {
    fetchInfo();
    requestPermission().then(result => {
      console.log({result});
      if(result === "granted") {
        const _watchId = Geolocation.watchPosition(
          position => {
            const {latitude, longitude} = position.coords;
            setLocation({latitude, longitude});
          },
          error => {
            console.log(error);
          },
          {
            enableHighAccuracy: true,
            distanceFilter: 0,
            interval: 1000,
            fastestInterval: 0,
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

  
  if(!location) {
    return (
      <View style={{ flex: 1 }}>
        <Text style={{ flex: 1 }}>Loading...</Text>
      </View>
    );
  }

  if (loading) return <View style={{margin: 50, width: 300, height: 200}}><Text>로딩 중..</Text></View>;
  if (!info) return null;

  return (
      <View style={{ flex: 1 }}>
        <MapView
          style={{ flex: 1, width:'100%', height:'100%' }}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
        >
          <Marker
            coordinate={{latitude: location.latitude, longitude: location.longitude}}
          />
          <Marker
            coordinate={coordinates[0]}
          />
          <Marker
            coordinate={coordinates[1]}
          />
            <Polyline
              coordinates={coordinates}
              strokeColor="#000"
              strokeColors={['#7F0000']}
              strokeWidth={6}
            />
        </MapView>
      </View>
  );
}

export default App;
