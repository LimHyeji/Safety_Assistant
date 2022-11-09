import React, { useState, useEffect } from "react";
import Geolocation from "react-native-geolocation-service";
import { View, Text, Button, PermissionsAndroid, ActivityIndicator, } from "react-native";
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


function App({navigation}) {
  /*

//timer 컴포넌트 생성
const Timer=({mm,ss})=>{
  const [minutes, setMinutes]=useState(parseInt(mm));
  const [seconds,setSeconds]=useState(parseInt(ss));

  
useEffect(() => {
  const countdown = setInterval(() => {
    if (parseInt(seconds) > 0) {
      setSeconds(parseInt(seconds) - 1);
    }
    if (parseInt(seconds) === 0) {
      if (parseInt(minutes) === 0) {
          clearInterval(countdown);
      } else {
        setMinutes(parseInt(minutes) - 1);
        setSeconds(59);
      }
    }
  }, 1000);
  return () => clearInterval(countdown);
}, [minutes, seconds]);



  return(
    <div>
      {minutes}:{seconds<10?'0${seconds}':seconds}
    </div>
  );

};
  */

  const [dangerAreas, setDangerAreas] = useState([]); // 위험 지역
  const [latitude, setLatitude] = useState(null)
  const [longitude, setLongitude] = useState(null);
  const [route, setRoute] = useState([]); // 이동 경로
  const guGun = [680, 740, 305, 500, 620, 215, 530, 545, 350, 320, 230, 590, 440, 410, 650, 200, 290, 710, 470, 560, 170, 380, 110, 140, 260];

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

       <Polyline coordinates={route} strokeColor="#000" strokeColors={['#7F0000']} strokeWidth={5}/>

        {dangerAreas.length === 0 ? (
              <ActivityIndicator
                color="white"
                style={{margin: 10}}
                size="large"
              />
          ) : (
            dangerAreas.map((dangerArea, index) => (
              <View key={index}>
                {
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
                }
              </View>
            ))
          )}

        </MapView>
        <View>
          <Button title="설정" onPress={() =>  navigation.navigate('SetUppage')}></Button> 
        </View>
        <View>
          <Button title="위치보내기" onPress={() =>  MainAPI(latitude,longitude)}></Button>
        </View>
      </View>
  );
}

function MainAPI(latitude,longitude){
  fetch('http://34.64.74.7:8081/user/child', {
  method: 'POST',
  body: JSON.stringify({
    "phoneNum": "01012341234",
    "latitude":latitude,
    "longitude":longitude
  }  ),
  headers : {'Content-Type' : 'application/json; charset=utf-8'}
})
  .then((response) => response.json())
  .then((responseJson) => {
    //console.log(latitude, longitude);
    console.log(responseJson);
    //setLoading(false);
    //if (responseJson.status === 'success') {
    /*  AsyncStorage.setItem('userId', responseJson.data.stu_id);
      console.log(responseJson.data.stu_id);
      navigation.replace('DrawerNavigationRoutes');
    } else {
      setErrortext('아이디와 비밀번호를 다시 확인해주세요');
      console.log('Please check your id or password');*/
    ///  console.log(responseJson);
  //  }
  })
  .catch((error) => {
    //setLoading(false);
    console.error(error);
  });
}

export default App;