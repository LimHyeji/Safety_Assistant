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
  const [dangerAreas, setDangerAreas] = useState([]);
  const componentDidMount = async () => {
    //guGun을 바꿔가면서 여러 번 호출 필요
    const response = await fetch('http://taas.koroad.or.kr/data/rest/frequentzone/pedstrians?authKey=%2Buvw8mtEC8SxmORSnCRCjrnB2BDLitKPgiqG4575Ym%2Btu2WpCtx3C25RGKSVuxEb&searchYearCd=2022032&siDo=11&guGun=680&type=json');
    const danger = await response.json();
    setDangerAreas(danger.items.item);
    console.log(dangerAreas);
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

          <Polyline coordinate={{latitude: latitude, longitude: longitude}} strokeColor="#CAEF53"/> 
        
        {dangerAreas.length === 0 ? (
            <View>
              <ActivityIndicator
                color="white"
                style={{margin: 10}}
                size="large"
              />
            </View>
          ) : (
            dangerAreas.map((dangerArea, index) => {
              return (
                //마커 띄우긴 가능 그러나 geom_json이 string으로 읽혀 polyline으로 출력 어려움
                <Marker
                  key={index}
                  coordinate={{latitude: parseFloat(dangerArea.la_crd), longitude: parseFloat(dangerArea.lo_crd)}}
                />
              )
            })
          )}

        </MapView>
      </View>
  );
}

export default App;