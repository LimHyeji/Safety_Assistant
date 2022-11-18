import React, { useState, useEffect } from "react";
import { View, Text, Button, PermissionsAndroid, ActivityIndicator, } from "react-native";
import Geolocation from "react-native-geolocation-service";
import MapView, {Marker, Polyline, Circle} from "react-native-maps";

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


function ChildMain({navigation}) {

  const [latitude, setLatitude] = useState(null)
  const [longitude, setLongitude] = useState(null);
  const [route, setRoute] = useState([]); // 이동 경로
  const [dangerAreas, setDangerAreas] = useState([]); // 위험 지역
  const guGun = [680, 740, 305, 500, 620, 215, 530, 545, 350, 320, 230, 590, 440, 410, 650, 200, 290, 710, 470, 560, 170, 380, 110, 140, 260];
  const [routetest,setRouteTest]=useState([{latitude:"37",longitude:"128"},{latitude:"38",longitude:"129"}]);

  const componentDidMount = async() => {
      for(let g in guGun) {
        const response = await fetch('http://taas.koroad.or.kr/data/rest/frequentzone/pedstrians?authKey=L6AJCRUtjxzVfZqqHFgIvQf4%2BwvvY3qA63M7pxG0TPwVKUiZZMu08Pq0sIg77mQa&searchYearCd=2022032&siDo=11&guGun=' + guGun[g] + '&type=json');
        const danger = await response.json();
        setDangerAreas(dangerAreas => [...dangerAreas, danger.items.item]);
      }
  }

  const trackPosition = () => {
    requestPermission().then(result => {
      console.log({result});
      if(result === "granted") {
        const _watchId = Geolocation.watchPosition(
          position => {
            const {latitude, longitude} = position.coords;
            setLatitude(latitude);
            setLongitude(longitude);
            setRoute(route => [...route, {latitude: latitude, longitude: longitude}]);
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
  }

  useEffect(() => {
    componentDidMount();
    trackPosition();

    setInterval(()=>ChildMainAPI(latitude,longitude),5000);
    //setInterval(()=>ChildMainAPI(routetest),5000);
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

        <Polyline
            coordinates={route} strokeColor="#000" strokeColors={['#7F0000']} strokeWidth={5}
        />

        {dangerAreas.length === 0 ? (
              <ActivityIndicator
                color="white"
                style={{margin: 10}}
                size="large"
              />
          ) : (
            dangerAreas.map(dangerArea => (
              dangerArea.map((dan, i) => (
                <Circle
                  key={i}
                  center={{latitude: parseFloat(dan.la_crd), longitude: parseFloat(dan.lo_crd)}}
                  radius={50}
                  strokeColor="rgba(0,0,0,0)"
                  strokeWidth={3}
                  fillColor={dan.occrrnc_cnt >= 1 && dan.occrrnc_cnt <= 4 ? "rgba(255,255,0,0.1)" : (
                    dan.occrrnc_cnt > 4 && dan.occrrnc_cnt <= 7 ? "rgba(255,127,0,0.1)" : "rgba(255,0,0,0.1)"
                  )}
                />
              ))
            ))
          )}

        </MapView>
        <View>
          <Button title="설정" onPress={() =>  navigation.navigate('ChildSetUppage')}></Button> 
        </View>
        {/*<View>
          <Button title="자녀위치보내기" onPress={() =>  ChildMainAPI(latitude,longitude)}></Button>
          </View>*/}
      </View>
  );
}
/*
function ChildMainAPI(latitude,longitude){
  fetch('http://34.64.74.7:8081/user/login/child', {
  method: 'POST',
  body: JSON.stringify({
    "userId": "child",
    "latitude":latitude,
    "longitude":longitude
  }  ),
  headers : {'Content-Type' : 'application/json; charset=utf-8'}
})
  .then((response) => response.json())
  .then((responseJson) => {
    console.log("ok");
  })
  .catch((error) => {
    console.error("no");
  });
}
*/
//*
//테스트용1
function ChildMainAPI(latitude,longitude){
  fetch('http://34.64.74.7:8081/test/loc', {
  method: 'POST',
  body: JSON.stringify({
    "latitude":latitude,
    "longitude":longitude
  }  ),
  headers : {'Content-Type' : 'application/json; charset=utf-8'}
})
  .then((response) => response.json())
  .then((responseJson) => {
    console.log(latitude);
    console.log(longitude);
    console.log(responseJson);
  })
  .catch((error) => {
    console.error("no");
  });
}
/*/
//테스트용2
function ChildMainAPI(routetest){
  fetch('http://34.64.74.7:8081/test/loc2', {
  method: 'POST',
  body: JSON.stringify({
      list : routetest
  }),
  headers : {'Content-Type' : 'application/json; charset=utf-8'}
})
  .then((response) => response.json())
  .then((responseJson) => {
    console.log(routetest);
    console.log(responseJson);
  })
  .catch((error) => {
    console.error("no");
  });
}
*/
export default ChildMain;