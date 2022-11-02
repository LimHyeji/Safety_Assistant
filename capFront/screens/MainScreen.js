import React, { useState, useEffect } from "react";
import Geolocation from "react-native-geolocation-service";
import { View, Text,  PermissionsAndroid, ActivityIndicator } from "react-native";
import MapView, {Marker, Polyline, AnimatedRegion, Circle} from "react-native-maps";
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
  const [dangerAreas, setDangerAreas] = useState([]);
  const guGun = [680, 740, 305, 500, 620, 215, 530, 545, 350, 320, 230, 590, 440, 410, 650, 200, 290, 710, 470, 560, 170, 380, 110, 140, 260];
  const componentDidMount = async() => {
      for(let g in guGun) {
        const response = await fetch('http://taas.koroad.or.kr/data/rest/frequentzone/pedstrians?authKey=L6AJCRUtjxzVfZqqHFgIvQf4%2BwvvY3qA63M7pxG0TPwVKUiZZMu08Pq0sIg77mQa&searchYearCd=2022032&siDo=11&guGun=' + guGun[g] + '&type=json');
        const danger = await response.json();
        setDangerAreas(dangerAreas => [...dangerAreas, danger.items.item]);
      }
  }

  useEffect(() => {
    componentDidMount();
  }, []);

  const [latitude, setLatitude] = useState(null)
  const [longitude, setLongitude] = useState(null);
  useEffect(() => {
    requestPermission().then(result => {
      console.log({result});
      if(result === "granted") {
        const _watchId = Geolocation.watchPosition(
          position => {
            const {latitude, longitude} = position.coords;
            setLatitude(latitude);
            setLongitude(longitude);
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
            coordinate={{latitude: latitude, longitude: longitude}}
          />
       
        {dangerAreas.length === 0 ? (
              <ActivityIndicator
                color="white"
                style={{margin: 10}}
                size="large"
              />
          ) : (
            dangerAreas.map(dangerArea => {
              dangerArea.map((dan, i) => {
                  return(
                    <Circle
                    key={i}
                    center={{latitude: parseFloat(dan.la_crd), longitude: parseFloat(dan.lo_crd)}}
                    radius={50}
                    strokeColor="rgba(255,255,255,0.05)"
                    strokeWidth={3}
                    fillColor="rgba(255,0,0,0.1)"
                />
                  )
              })
            })
          )}

        </MapView>
      </View>
  );
}

export default App;